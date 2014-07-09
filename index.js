var co = require("co"),
    fs = require("co-fs"),
    yaml = require("js-yaml"),
    mkdirp = require("mkdirp"),
    walk = require("walk"),
    path = require("path");

var context = {},
    app = new (require("beads"))(context),
    PluginManager = require("./lib/pluginManager");

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

    // init cache dir
    mkdirp.sync(".cache/node_modules");

    // load plugins
    var pluginManager = new PluginManager({registry: config.registry});
    yield config.plugins.map(function(plugin) {
        return function(cb) {
            pluginManager.activate(plugin, app, cb);
        };
    });

    ////////////////////////////
    //
    // Check files in content/
    //
    ////////////////////////////

    var walkContent = function(cb) {
        var files = [],
            walker = walk.walk("content", {followLinks: false});
        walker.on("file", function(root, stats, next) {
            files.push({
                path: root + "/" + stats.name,
                mtime: stats.mtime,
                extname: path.extname(stats.name),
                dirname: root,
                basename: path.basename(stats.name)
            });
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

    context.sourceFiles = yield walkContent;

})();
