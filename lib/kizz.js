var co = require("co"),
    fs = require("co-fs"),
    context = {},
    argv = process.argv,
    cwd = process.cwd(),
    path = require('path');

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
    ["./timer", "./storage", "./files", "./categories", "kizz-markdown", "kizz-guess-tags"].forEach(function(middleware) {
        requireMiddleware(middleware);
    });

    // load config
    requireMiddleware(path.join(cwd, "config"));

    // load installed middlewares
    (yield fs.readdir(path.join(cwd, "node_modules"))).forEach(function(middleware) {
        requireMiddleware(path.join(cwd, "node_modules", middleware));
    });

    // Run Middlewares
    app.run();
});
