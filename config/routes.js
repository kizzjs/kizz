var routes = function(site, pages) {
    var tags = site.tags;
    var routes = [];

    // tags
    tags.forEach(function(tag) {
        routes.push({
            globals: {
                title: tag,
                pages: pages.filter(function(page) {
                    return page.tags.indexOf(tag) > -1;
                })
            },
            template: "archives.jade",
            target: "tags/" + tag + ".html"
        });
    });

    // pages (files in content/)
    pages.forEach(function(page) {
        routes.push({
            globals: page,
            template: "page.jade",
            target: page.file.dir + page.file.name + ".html"
        });
    });

    // index.html
    routes.push({
        globals: {
            pages: pages
        },
        template: "archives.jade",
        target: "index.html"
    });

    // feed
    routes.push({
        globals: {
            pages: pages
        },
        template: "atom.xml.jade",
        target: "atom.xml"
    });

    // index.json (for searching)
    routes.push({
        globals: {
            pages: pages
        },
        template: "index.json.jade",
        target: "index.json"
    });

    return routes;
};

module.exports = routes;
