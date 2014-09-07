var co = require("co"),
    fs = require("co-fs"),
    argv = process.argv,
    cwd = process.cwd(),
    context = {
        argv: argv,
        cwd: cwd
    },
    path = require('path'),
    app = new (require("beads"))(context);;

module.exports = co(function* () {

    var requireMiddleware = function(middlewarePath) {
        var name = middlewarePath.split('/').pop();
        var wrap = function (middleware) {
            return function *(_next) {
                this.logger = require("log4js").getLogger(name);
                this.logger.setLevel("debug");
                this.logger.debug('BEGIN');
                var next = function *() {
                    yield _next;
                    this.logger = require("log4js").getLogger(name);
                    this.logger.setLevel("debug");
                };
                yield middleware.call(this, next);
                this.logger.debug('END');
            };
        };
        require(middlewarePath)(app.wrap(wrap));
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
