var jade = require("jade")

module.exports = function *(app) {
    app.use(function *(next) {
        yield next;

        var themeDir = "";

        var route = function(file) {
            var template = file.content ? "post.jade" : null;
            return {
                target: file.path,
                template: template,
                source: file.path,
                globals: file
            }
        }

        ////////////////////////////
        //
        // handle removed files
        //
        ////////////////////////////
    }
}