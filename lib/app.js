module.exports = function(context) {
    var app = new (require("beads"))(context);
    var contextName = 'Unnamed';

    var _app = {
        setContextName: function(name) {
            contextName = name;
        },
        when: function(dep) {
            return {
                use: function(gfn) {
                    var generatorFn = (function(contextName) {
                        return function *(next) {
                            this.logger = require("log4js").getLogger(contextName);
                            this.logger.setLevel("debug");
                            this.logger.debug('BEGIN');

                            yield gfn.call(this, function *() {
                                yield next;
                                this.logger = require("log4js").getLogger(contextName);
                                this.logger.setLevel("debug");
                            });

                            this.logger.debug('END');
                        };
                    })(contextName);
                    return app.when(dep).use(generatorFn);
                }
            };
        },
        use: function(gfn) {
            _app.when(function *() {
                return true;
            }).use(gfn);
        },
        run: function() {
            app.run();
        }
    };

    return _app;
};
