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

    ////////////////////////////
    //
    // Load plugins & theme
    //
    ////////////////////////////

    // init cache
    mkdirp.sync(".cache/node_modules");
    app.use(function *(next) {
        yield next;
        this.cacheTime = (new Date()).getTime();
        this.cachedConfig = JSON.stringify(config);
        objCache.set("context", this);
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
            files.push(path);
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

    var cachedContext = objCache.get("context");

    var sourceFiles = yield walkContent;

    context.changedFiles = [];
    context.removedFiles = [];
    context.unchangedFiles = [];

    if(!cachedContext) cachedContext = {};
    if(!cachedContext.cacheTime || (cachedContext.cachedConfig != JSON.stringify(config)))
      cachedContext.cacheTime = 0;

    context.changedFiles = sourceFiles.filter(function(file) {
        return (new Date(file.mtime)).getTime() > (new Date(cachedContext.cacheTime)).getTime();
    });

    // todo
    // context.unchangedFiles
    // load from cache

    // todo
    // context.removedFiles
    // and get their file object from cache



    // var cachedSourceFiles = cachedContext.unchangedSourceFiles.concat(cachedContext.changedSourceFiles);
    // var pathArr = sourceFiles.map(function(file) {
    //     return file.path;
    // });
    // context.removedSourceFiles = cachedSourceFiles.filter(function(file) {
    //     return pathArr.indexOf(file.path) === -1;
    // });


    // context.changedSourceFiles = context.sourceFiles.filter(function(file) {
    //     return (new Date(file.mtime)).getTime() > (new Date(cachedContext.cacheTime)).getTime();
    // });
    // // load unchanged files object from cachedContext
    // var changedFiles = context.changedSourceFiles.map(function(file) {
    //     return file.path;
    // });
    // context.files = cachedContext.files.filter(function(file) {
    //     return changedFiles.indexOf(file.path) > -1;
    // });

    // context.changedFiles = [];
    // context.removedFiles = context.removedSourceFiles.concat();
})();
