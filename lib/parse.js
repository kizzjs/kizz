/**
 * @file Parser for whole source directory
 */

var glob = require('glob');
var env = require('./env');
var parseFrontMatter = require('yaml-front-matter').loadFront;
var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var gitlog = require('./git');
var commonmark = require('commonmark');
var commonmarkParser = new commonmark.Parser();
var commonmarkRender = new commonmark.HtmlRenderer();

var parseFile = function(file) {

    // Parse front matter
    var metadata = parseFrontMatter(file.raw);

    // Parse markdown
    var parsed = commonmarkParser.parse(metadata.__content); // parsed is a Node tree

    // Copy attributes
    delete metadata.__content;
    _.assign(file, metadata);

    // Guess title
    if (!file.title) {
        // Try using h1 in Markdown
        var h1 = parsed._firstChild;
        if (h1 && h1.level === 1 && h1.type === "Header") {
            file.title = h1._firstChild && h1._firstChild._literal;
            h1.unlink(); // delete the <h1>
        }
        if (!file.title) {
            // Then try using title from path
            file.title = path.basename(file.path, path.extname(file.path));
        }
    }

    // Render HTML
    file.html = commonmarkRender.render(parsed);

    return file;
};

var parse = function(callback) {
    glob('**/*.md', {cwd: env.source}, function(err, files) {
        if (err) {
            callback(err);
            return;
        }
        var tasks = files.map(function(relativeFilePath) {
            var filePath = path.join(env.source, relativeFilePath);
            return function(callback) {
                async.parallel({
                    raw: function (callback) { // read file contents
                        fs.readFile(filePath, {encoding: 'UTF-8'}, callback);
                    },
                    stat: function (callback) { // fs stat
                        fs.stat(filePath, callback);
                    },
                    gitlog: function (callback) { // git commits
                        gitlog(relativeFilePath, env.source, callback)
                    }
                }, function (err, file) {
                    file.path = filePath;
                    callback(err, parseFile(file));
                });
            };
        });
        async.parallel(tasks, callback);
    });
};

module.exports = parse;
