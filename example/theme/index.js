var jade = require("jade"),
    fs = require("fs");

var compile = function(options) {
    jade.renderFile(
      "theme/templates/" + options.template,
      {globals: options.globals},
      function(err, html) {
          if (err) throw err;
          fs.writeFile(options.target, html);
      }
    );
}

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