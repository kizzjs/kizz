var path = require('path'),
    _ = require('lodash');

module.exports = function(app) {
    app.when(function *() {
        return (typeof this.files !== "undefined");
    }).use(function *(next) {

        var dirnames = [];

        var parseDirname = function(dirname) {
        };

        this.files = this.files.map(function(file) {
            if(file.status === "modified") {
                var dirname = path.dirname(file.path);
                dirnames.push(dirname);
                file.categories =
                    dirname.split(path.sep).filter(function(cat) {
                    return cat !== '.';
                });
            };
            return file;
        });

        this.categories = _.uniq(dirnames).map(function(cats) {
            return cats.split(path.sep);
        });

        yield next;
    });
};
