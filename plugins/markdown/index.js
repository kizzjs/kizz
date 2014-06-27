// Markdown Plugin for KIZZ
// Licensed under GPLv2

var fs = require('fs'),
    marked = require('marked');

module.exports = {
    name: "Markdown",
    version: "0.0.1",
    call: function(changedFiles, site, next) {
        changedFiles = changedFiles.map(function(file) {
            if(["markdown", "mkd", "md"].indexOf(file.extname) > -1) {
                file.content = fs.readFileSync(file.path);
                file.html = marked(file.content);
                file.title = file.html.match(/<h1>(.*)<\/h1>/g) || file.basename;
            }
        });
        next(changedFiles, site);
    }
}
