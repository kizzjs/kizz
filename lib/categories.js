var path = require('path');

module.exports = function(app) {
    app.when(function *() {
        return (typeof this.newFiles !== "undefined");
    }).use(function *() {
        var getCategories = function(file) {
            var categories = path.dirname(file.path).split(path.sep);
            file.categories = categories.filter(function(cat) {
                return cat !== '.';
            });
            return file;
        };
        this.newFiles = this.newFiles.map(getCategories);
        this.changedFiles = this.changedFiles.map(getCategories);
    });
};
