var glob = require('glob');
var async = require('async');
var fs = require('fs');
var gitlog = require('./lib/gitlog');
var getAvatar = require('./lib/avatar');
var path = require('path');

glob('contents/**/*.md', function(err, files) {
    var cwd = process.cwd();
    var fn = function(file, callback){
        async.parallel([
            function(callback) {
                gitlog(file, cwd, callback);
            },
            function(callback) {
                fs.readFile(file, {encoding: 'UTF-8'}, callback);
            }
        ], function(err, results) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, {
                    commits: results[0],
                    contents: results[1],
                    path: path.relative('contents/', file)
                });
            }
        });
    };
    async.map(files, fn, function(err, files) {
        if(err) {
            throw new Error(err);
        } else {
            files = files.map(function(file) {
                return file;
            });
            console.log(JSON.stringify(files, null, 4));
        }
    });
});
