module.exports = function(app) {
    return function(middlewarePath) {
        var name = middlewarePath.split('/').pop();
        var wrap = function (middleware) {
            return function *(_next) {
                this.logger = require("log4js").getLogger(name);
                this.logger.setLevel("debug");
                this.logger.debug('BEGIN');
                var nextCalled = false;
                var next = function *() {
                    nextCalled = true;
                    yield _next;
                    this.logger = require("log4js").getLogger(name);
                    this.logger.setLevel("debug");
                };
                yield middleware.call(this, next);
                this.logger.debug('END');
                if(!nextCalled) {
                    this.logger.error('Forgot to `yiled next` inside your middleware?');
                    throw new Error('`yield next` not found.');
                };
            };
        };
        require(middlewarePath)(app.wrap(wrap));
    };
};
