var _ = require("underscore"),
    fs = require("fs");

module.exports = function (changedFiles, files, handler, callback) {

    var tags = changedFiles.map(function(file) {
        return file.tags;
    });
    tags = _.uniq(_.flatten(tags));

    var targets = [];

    // tags/tagName.html
    tags.forEach(function(tag) {
        targets.push({
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
        targets.push({
            globals: file,
            template: "page.jade",
            target: file.dir + file.name + ".html"
        });
    });

    // index.html
    targets.push({
        globals: {
            files: files
        },
        template: "archives.jade",
        target: "index.html"
    });

    // static files
    files.forEach(function(file) {
        if(file.type == "binary") {
            targets.push({
                file: file,
                target: file.path
            });
        }
    });
};