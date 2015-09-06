/**
 * @file Generate target files
 */

var parse = require('./parse');

module.exports = function() {
    parse(function(err, files) {
        console.log(files);
    });
};