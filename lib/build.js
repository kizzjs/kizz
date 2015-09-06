/**
 * @file Generate target files
 */

var parse = require('./parse');

parse(function(err, files) {
    console.log(files);
});