var Feed = require('feed');
var path = require('path');
var url = require('url');
var marked = require('marked');

module.exports = function(config, files) {
    var feed = new Feed({
        title: config.site.name,
        description: config.site.description,
        link: config.site.link,
        copyright: config.site.copyright,
        updated: new Date()
    });

    for(var i = 0, len = Math.min(10, files.length), file; i < len; i++) {
        file = files[i];
        var link = url.resolve(config.site.link,
                               path.join(path.dirname(file.path),
                                         path.basename(file.path,
                                                       path.extname(file.path))));
        feed.addItem({
            title: file.title,
            link: link,
            content: marked(file.contents),
            date: new Date(file.commits[0] && file.commits[0].date) || new Date()
        });
    }

    return feed.render('atom-1.0');
};
