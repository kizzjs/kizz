var co = require("co"),
    fs = require("co-fs"),
    yaml = require("js-yaml"),
    mkdirp = require("mkdirp"),
    logger = require("log4js").getLogger(),
    requireMiddleware = require("./lib/require-middleware.js");

var context = {},
    app = new (require("beads"))(context);

co(function* () {

    ////////////////////////////
    //
    // Init
    //
    ////////////////////////////

    var config = yield fs.readFile('config.yml', 'utf-8');
    config = yaml.safeLoad(config);

    ////////////////////////////
    //
    // Load Middlewares
    //
    ////////////////////////////

    // files cache & walker, the outer control
    require('./lib/files.js')(app);

    // load theme (theme is a also a plugin)
    requireMiddleware(config.theme)(app);

    // load plugins
    config.plugins.forEach(function(plugin) {
        requireMiddleware(plugin)(app);
    });

    ////////////////////////////
    //
    // Run Middlewares
    //
    ////////////////////////////

    context.config = config;

    logger.setLevel(config.log);
    context.logger = logger;

    app.run(function(err) {
        if(err) throw(err);
    });

})();
