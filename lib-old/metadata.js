var getAvatar = require('./avatar');
var getFrontMatter = require('yaml-front-matter').loadFront;
var _ = require('lodash');
var path = require('path');

module.exports = function(file) {
    var matter = getFrontMatter(file.contents);
    if(!matter.title) {
        var match = file.contents.match(/^#[ ]*(.*)$/m);
        if(!match) {
            matter.title = path.basename(file.path, path.extname(file.path));
        } else {
            matter.title = match && match[1];
        }
    }
    file.contents = matter.__content;
    matter.__content = undefined;
    _.assign(file, matter);
    return file;
};
