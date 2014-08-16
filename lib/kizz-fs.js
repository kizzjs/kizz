var spawn = require("co-child-process"),
    co = require("co");

module.exports = function(app) {
    app.when(function *() {
        return typeof this.config !== "undefined";
    }).use(function *(next) {

        if(this.config.source.type !== "fs") {
            return next;
        }

        if(this.cmd == "watch") {
            var onFileChange = function () {
                co(function *() {
                    yield spawn('kizz', ['build']);
                })();
            }
            // todo: bind
        }
        if(this.cmd == "build" || this.cmd == "rebuild") {
            if(this.cmd == "rebuild") {
                // todo: clear cache
            }
            // todo: build
            yield next;
        }
    });
}
