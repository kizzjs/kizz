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
var commonmark = require('commonmark');
var commonmarkParser = new commonmark.Parser();
var commonmarkRender = new commonmark.HtmlRenderer();

var parseFile = function(file) {

    // Parse front matter
    var metadata = parseFrontMatter(file.contents);
    file.contents = metadata.__content;
    delete metadata.__content;
    _.assign(file, metadata);

    // Parse markdown
    file.parsed = commonmarkParser.parse(file.contents); // parsed is a Node tree

    if (!file.title) {
        // Try using h1 in Markdown
        var h1 = file.parsed._firstChild;
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
    file.html = commonmarkRender.render(file.parsed);

    return file;
};

var parse = function(callback) {
    glob('**/*.md', {cwd: env.source}, function(err, files) {
        if (err) {
            callback(err);
            return;
        }
        var tasks = files.map(function(filePath) {
            return function(callback) {
                fs.readFile(path.join(env.source, filePath), {encoding: 'UTF-8'}, function(err, contents) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    var file = {path: filePath, contents: contents};
                    callback(null, parseFile(file));
                });
            }
        });
        async.parallel(tasks, callback);
    });
};

module.exports = parse;
