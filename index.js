var co = require("co"),
    fs = require("co-fs"),
    yaml = require("js-yaml"),
    mkdirp = require("mkdirp"),
    walk = require("walk"),
    path = require("path");

var context = {},
    app = new (require("beads"))(context),
    PluginManager = require("./lib/pluginManager"),
    objCache = new (require("./lib/objCache")),
    File = require("./lib/file");

context.log = console.log;
context.error = console.log;
context.debug = console.log;

co(function* () {

    ////////////////////////////
    //
    // Init config
    //
    ////////////////////////////

    var config;
    try {
        config = yield fs.readFile('config.yml', 'utf-8');
        config = yaml.safeLoad(config);
        context.debug(config);
    } catch(e) {
        console.error("Fail to parse config.yml");
        throw e;
    }
    context.config = config;

    ////////////////////////////
    //
    // Load plugins & theme
    //
    ////////////////////////////

    // init cache
    mkdirp.sync(".cache/node_modules");
    app.use(function *(next) {
        yield next;
        objCache.set({
            config: context.config,
            files: context.changedFiles.concat(context.unchangedFiles),
            time: (new Date()).getTime()
        });
    });

    // init plugin manager
    var pluginManager = new PluginManager({registry: config.registry});
    var activate = function(plugin) {
        return function(cb) {
            pluginManager.activate(plugin, app, cb);
        };
    }

    // load theme (theme is a also a plugin)
    yield activate(config.theme);

    // load plugins
    yield config.plugins.map(activate);

    ////////////////////////////
    //
    // Check files in content/
    //
    ////////////////////////////

    var walkContent = function(cb) {
        var files = [],
            walker = walk.walk("content", {followLinks: false});
        walker.on("file", function(root, stats, next) {
            var file = {
                path: root + "/" + stats.name,
                mtime: stats.mtime,
                extname: path.extname(stats.name),
                dirname: root,
                basename: path.basename(stats.name)
            }
            files.push(file);
            next();
        });
        walker.on("end", function() {
            cb(null, files);
        });
    }

    ////////////////////////////
    //
    // Init context
    //
    ////////////////////////////

    var cache = objCache.get();

    var sourceFiles = yield walkContent;

    if(!cache) cache = {};
    var configChanged = (JSON.stringify(cache.config) != JSON.stringify(config));
    if(!cache.time || configChanged) {
        cache.time = 0;
    }

    context.changedFiles = sourceFiles.filter(function(file) {
        return (new Date(file.mtime)).getTime() > (new Date(cache.time)).getTime();
    });

    context.removedFiles = [];
    context.unchangedFiles = [];

    var inArr = function(file, arr) {
        for (var i = 0; i < arr.length; i++) {
            if(arr[i].path === file.path) {
                return true;
            }
        }
        return false;
    }

    if(!cache.files) {
        cache.files = [];
    }

    cache.files.forEach(function(file) {
        if(inArr(file, sourceFiles)) {
            if(!inArr(file, context.unchangedFiles)) {
                context.unchangedFiles.push(file);
            }
        } else {
            context.removedFiles.push(file);
        }
    });

    context.debug(context);

    ////////////////////////////
    //
    // Run Middlewares
    //
    ////////////////////////////

    app.run(function(err) {
        if(err) throw(err);
    });

})();
