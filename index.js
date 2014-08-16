var co = require("co"),
    fs = require("co-fs"),
    logger = require("log4js").getLogger(),
    context = {},
    app = new (require("beads"))(context);

co(function* () {

    // init context
    context.argv = process.argv;
    context.cwd = process.cwd;
    context.logger = logger;

    // load config
    require(cwd + "/config/index.js")(app);

    // load core middleswares
    ["lib/kizz-fs", "lib/kizz-git"].forEach(function(middleware) {
        require(middleware)(app);
    });

    // load installed middlewares
    (yield fs.readdir(cwd + "/node_modules/")).forEach(function(middleware) {
        require(cwd + "/node_modules/" + middleware)(app);
    });

    // Run Middlewares
    app.run(function(err) {
        if(err) throw(err);
    });

})();
