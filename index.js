var co = require("co"),
    fs = require("co-fs"),
    yaml = require("js-yaml"),
    mkdirp = require("mkdirp");

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
})();
