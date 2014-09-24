var path = require('path');

module.exports = function(app) {
    app.use(function *(next) {

        var ctx = this;

        this.config = {
            site: {
                name: "Your Site Name",
                description: "Your Site Description",
                url: "http://example.com/"
            },
            // global tags
            tags: [
                "Kizz",
                "API",
                "generator",
                "develop",
                "design",
                "theme"
            ],
            source: "source", // defaults to source/
            target: "public" // target dir
        };

        yield next;
    });
};
