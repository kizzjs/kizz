var co = require("co"),
    fs = require("co-fs"),
    yaml = require("js-yaml"),
    mkdirp = require("mkdirp");

var context = {},
    app = new (require("beads"))(context),
    PluginManager = require("./lib/plugin-manager");

context.log = console.log;
context.error = console.log;
context.debug = console.log;

co(function* () {

    ////////////////////////////
    //
    // Init
    //
    ////////////////////////////

    var config;
    try {
        config = yield fs.readFile('config.yml', 'utf-8');
        config = yaml.safeLoad(config);
    } catch(e) {
        console.error("Fail to parse config.yml");
        throw e;
    }

    mkdirp.sync("node_modules");

    ////////////////////////////
    //
    // Load plugins & theme
    //
    ////////////////////////////

    // files cache & walker, the outer control
    require('./lib/files.js')();

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
    // Run Middlewares
    //
    ////////////////////////////

    context.config = config;

    app.run(function(err) {
        if(err) throw(err);
    });

})();
