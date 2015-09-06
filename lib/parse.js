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

var parseMetadata = function(file) {
    if (!metadata.title) {
        // try using H1 in markdown
        var match = file.contents.match(/^#[ ]*(.*)$/m);
        if(!match) {
            // try to get title from path
            matter.title = path.basename(file.path, path.extname(file.path));
        } else {
            matter.title = match && match[1];
        }
    }
    return file;
};

var parseFile = function(file) {

    // Parse front matter
    var metadata = parseFrontMatter(file.contents);
    file.contents = metadata.__content;
    delete metadata.__content;
    _.assign(file, metadata);

    // Parse markdown
    file.parsed = commonmarkParser.parse(file.contents); // parsed is a Node tree

    // Parse title


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
