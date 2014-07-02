// files is the files changed
// site is the global site object
// compile the compile function

var _ = require("underscore"),
    fs = require("fs");

var compileChangedFiles = function(changedFiles, site, compile) {
    var tags = changedFiles.map(function(file) {
        return file.tags;
    });
    tags = _.uniq(_.flatten(tags));

    // tags/tagName.html
    tags.forEach(function(tag) {
        compile({
            globals: {
                // title: tag,
                // pages: site.pages.filter(function(page) {
                //     return page.tags.indexOf(tag) > -1;
                // })
            },
            template: "archives.jade",
            target: "tags/" + tag + ".html"
        });
    });

    // files in content/
    changedFiles.forEach(function(file) {
        compile({
            globals: file,
            template: "page.jade",
            target: file.dir + file.name + ".html"
        });
    });

    // index.html
    compile({
        globals: {
            pages: site.pages
        },
        template: "archives.jade",
        target: "index.html"
    });

    // static files
    site.files.forEach(function(file) {
        if(file.type == "binary") {
            compile({
                file: file,
                target: file.path
            });
        }
    });
}

module.exports = compileChangedFiles;
