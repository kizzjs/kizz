var path = require('path');

module.exports = function(app) {
    app.when(function *() {
        return (typeof this.newFiles !== "undefined");
    }).use(function *(next) {

        this.files = this.files.map(function(file) {
            if(file.status === "modified") {
                var categories = path.dirname(file.path).split(path.sep);
                file.categories = categories.filter(function(cat) {
                    return cat !== '.';
                });
            };
            return file;
        });

        yield next;
    });
};
