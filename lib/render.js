/**
 * @file Renderer for page
 */

var env = require('./env');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // allow using syntax like {{ name }}
var template = fs.readFileSync(path.join(env.theme, 'index.html'));
var compiled = _.template(template);

var render = function(file) {
    var data = {
        page: file,
        site: {}
    };
    data.site.baseurl = path.relative(path.dirname(file.path), './');
    return compiled(data);
};

module.exports = render;