var co = require("co"),
    fs = require("co-fs"),
    argv = process.argv,
    cwd = process.cwd(),
    context = {
        argv: argv,
        cwd: cwd
    },
    path = require('path'),
    app = new (require("beads"))(context),
    requireMiddleware = require('./require-middleware')(app);

module.exports = co(function* () {

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

    // set default argv
    if(typeof argv[2] === "undefined") {
        argv[2] = "build";
    }

    // Run Middlewares
    app.run();
});
