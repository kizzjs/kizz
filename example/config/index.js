module.exports = function(app) {
    app.use(function *(next) {
        this.logger.setLevel("debug");

        this.config = {
            site: {
                name: "Site Name Here",
                url: "http://example.com"
            }
        }

        yield next;
    });
}
