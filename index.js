var co = require("co"),
    fs = require("co-fs"),
    logger = require("log4js").getLogger(),
    cwd = process.cwd(),
    context = {},
    app = new (require("beads"))(context);

co(function* () {

    context.cmd = "watch" || "build" || "rebuild";

    // init logger
    context.logger = logger;

    // load config
    require(cwd + "/config/index.js")(app);

    // load core middleswares
    ["kizz-fs"].forEach(function(middleware) {
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
