var co = require("co"),
    fs = require("co-fs"),
    logger = require("log4js").getLogger(),
    context = {},
    argv = process.argv,
    cwd = process.cwd(),
    app = new (require("beads"))(context);

co(function* () {

    // init context
    context.argv = argv;
    context.cwd = cwd;
    context.logger = logger;

    // load config
    require(cwd + "/config/index.js")(app);

    // load core middleswares
    ["./lib/storage.js", "./lib/files.js", "kizz-markdown", "kizz-guess-tags"].forEach(function(middleware) {
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
