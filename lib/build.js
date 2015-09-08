/**
 * @file Generate target files
 */

var parse = require('./parse');
var fs = require('fs-extra');
var env = require('./env');
var async = require('async');
var path = require('path');
var render = require('./render');

module.exports = function() {
    console.log('Removing: ', env.destination);
    fs.remove(env.destination, function(err) { // remove old files
        if (err) {
            throw err;
        }
        console.log('Copying: ', env.theme);
        fs.copy(env.theme, path.join(env.destination, 'theme'), function() {}); // copy theme
        console.log('Copying: ', env.source);
        fs.copy(env.source, env.destination, function(err) { // copy static files
            if (err) {
                throw err;
            }
            console.log('Parsing: ', env.source);
            parse(function(err, files) { // parse
                if (err) {
                    throw err;
                }
                console.log('Source files parsed: ', files.length);
                debugger;
                var tasks = files.map(function(file) { // write render results
                    return function(callback) {
                        var filepath = path.join(env.destination, file.path);
                        var filename = path.basename(filepath, path.extname(filepath)) + '.html';
                        filepath = path.join(path.dirname(filepath), filename);
                        console.log('Writing: ', filepath);
                        fs.writeFile(filepath, render(file), callback);
                    }
                });
                async.parallel(tasks);
            });
        });
    });
};