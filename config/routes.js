var routes = function(config, pages) {
    var tags;
    tags = config.tags;
    routes = [];

    // tags
    tags.forEach(function(tag) {
        routes.push({
            data: {
                tag: tag
            },
            template: "tag.jade",
            target: "tags/" + tag + ".html"
        });
    });

    // articles
    pages.forEach(function(page) {
        routes.push({
            data: {
                page: page
            },
            template: "page.jade",
            target: page.dir + page.name + ".html"
        });
    });

    // feed
    routes.push({
        data: {
            pages: pages
        },
        template: "atom.jade",
        target: "atom.xml"
    });

    // index.json
    routes.push({
        data: {
            pages: pages
        },
        template: "index.json.jade",
        target: "index.json"
    });

    return routes;
};

module.exports = routes;
