var spawn = require("co-child-process"),
    co = require("co"),
    watch = require("watch");

module.exports = function(app) {
    app.when(function *() {

        return typeof this.config !== "undefined";

    }).use(function *(next) {

        var sourceDir = this.config.source || "source/",
            argv = this.argv,
            cmd = argv[2];

        if(cmd === "rebuild") {
            this.storage.setItem('files', "[]");
            cmd = "build";
        }

        if(cmd === "build") {
            this.changedFiles = [];
            this.unchangedFiles = [];
            // todo: compare files by hash

            yield next;

            var files = this.changedFiles.concat(this.unchangedFiles);
            this.storage.setItem('files', JSON.stringify(files));
        }

        if(cmd === "watch") {
            watch.watchTree(sourceDir, function (f, curr, prev) {
                if (typeof f == "object" && prev === null && curr === null) {
                    // nothing changed
                } else {
                    this.logger.log("Change detected: " + f + ", rebuild now.");
                    co(function *() {
                        var output = yield spawn(argv[0], [argv[1], 'build']);
                        this.logger.log(output);
                    })();
                }
            })
        }
    });
}
