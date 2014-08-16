module.exports = function(app) {
    app.use(function *(next) {
        this.logger.setLevel("debug");

        this.config = {
            site: {
                name: "Site Name Here",
                url: "http://example.com"
            },
            source: {
                type: "fs",
                url: "./content/"
            }

            // source: {
            //     type: "seafile",
            //     url: "http://seafile.example.com/",
            //     token: "YOUR AUTH TOKEN"
            // }

            // source: {
            //     type: "git",
            //     url: "https://github.com/zenozeng/kizz.git"
            // }
        }

        yield next;
    });
}
