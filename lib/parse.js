/**
 * @file Parser for whole source directory
 */

var glob = require('glob');
var env = require('./lib/env');
var parseFrontMatter = require('yaml-front-matter').loadFront;
var path = require('path');

var parseMetadata = function(file) {
    var metadata = parseFrontMatter(file.contents);
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
    file.contents = metadata.__content;
    metadata.__content = undefined;
    _.assign(file, metadata);
    return file;
};

var parse = function(callback) {
    glob(env.source, '**/*.md', function(err, files) {
        if (err) {
            callback(err);
            return;
        }
    });
};

module.exports = parse;
