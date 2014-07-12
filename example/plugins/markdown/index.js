// Markdown Plugin for KIZZ
// Licensed under GPLv2
// Version: 0.0.2

var fs = require('fs'),
    marked = require('marked');

module.exports = function(app) {
    app.when(function *() {
        // The files object are ready before plugins run
        // thus this plugin should be run as soon as possible
        return true;
    }).use(function *() {
        this.files = this.files.map(function(file) {
            if(["markdown", "mkd", "md"].indexOf(file.extname) > -1) {
                file.content = fs.readFileSync(file.path);
                file.html = marked(file.content);
                file.title = file.html.match(/<h1>(.*)<\/h1>/g) || file.basename;
            }
            return file;
        });
    });
}
