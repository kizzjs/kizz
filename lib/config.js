var fs = require('fs'),
    cwd = process.cwd(),
    path = require('path'),
    _ = require('lodash'),
    config;

try {
    if(fs.existsSync(path.join(cwd, 'config.json'))) {
        config = fs.readFileSync(path.join(cwd, 'config.json'));
        config = JSON.parse(config);
    } else {
        config = require(path.join(cwd, 'config.js'));
    }
} catch(err) {
    console.error('Fail to parse config, make sure your config.js or config.json exists');
    throw new Error(err);
}

_.defaults(config, {
    site: {
        "name": "Example Site",
        "description": "Example site for kizz",
        // "link": "http://example.com/",
        "keywords": []
        // "copyright": "Copyright (C) Kizz Team 2014-2015."
    },
    source: './source',
    target: './site',
    navs: [],
    github: null, // kizzjs/kizz-example
    // permalink: ":year/:month/:day/:title.html"
    permalink: function(post) {
        // permalink: ":dirname/:basename/"
        return path.join(post.dirname, post.basename, 'index.html');
    }
});

// convert :year/:month/:day/:title.html style to function style
if(typeof config.permalink === "string") {
    config.permalink = (function(permalink) {
        return function(file) {
            var date = new Date(file.creationTime);
            var props = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                title: file.title,
                dirname: file.dirname,
                basename: file.basename
            };
            return permalink.replace(/:[a-z]+/g, function(matched) {
                return props[matched.substring(1)];
            });
        };
    })(config.permalink);
}

module.exports = config;
