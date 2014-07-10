module.exports = function(app) {
    app.when(function *() {
        // sth
    }).use(function *(next) {
        this.files.forEach(function(file) {
            file.title = file.content.match(/<h1>(.*)<\/h1>/g) || file.basename;
        });
        yield next;
    });
}