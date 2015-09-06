/**
 * @file Parser for whole source directory
 */

var glob = require('glob');
var env = require('./env');
var parseFrontMatter = require('yaml-front-matter').loadFront;
var path = require('path');
var async = require('async');
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
    metadata.__content = undefined;
    _.assign(file, metadata);

    // Parse markdown
    file.parsed = commonmarkParser.parse(file.contents); // parsed is a Node tree

    // Parse title


    // Render HTML
    file.html = commonmarkRender.render(file.parsed);
};

var parse = function(callback) {
    glob(env.source, '**/*.md', function(err, files) {
        if (err) {
            callback(err);
            return;
        }
        async.parallel([
            function(callback) {
                fs.readFile(file, {encoding: 'UTF-8'}, callback)
            }
        ], function(err, files) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, files.map(function(contents) {
                return parseFile({contents: contents});
            }));
        })
    });
};

module.exports = parse;
