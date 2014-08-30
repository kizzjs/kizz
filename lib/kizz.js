var co = require("co"),
    fs = require("co-fs"),
    context = {},
    argv = process.argv,
    cwd = process.cwd();

module.exports = co(function* () {

    // init context
    context.argv = argv;
    context.cwd = cwd;

    var app = require('./app')(context);

    var requireMiddleware = function(middleware) {
        app.setContextName(middleware.split('/').pop());
        require(middleware)(app);
    };

    // load core middleswares
    ["./timer.js", "./storage.js", "./files.js", "kizz-markdown", "kizz-guess-tags"].forEach(function(middleware) {
        requireMiddleware(middleware);
    });

    // load config
    requireMiddleware(cwd + "/config");

    // load installed middlewares
    (yield fs.readdir(cwd + "/node_modules/")).forEach(function(middleware) {
        requireMiddleware(cwd + "/node_modules/" + middleware);
    });

    // Run Middlewares
    app.run();
});
