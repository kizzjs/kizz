var glob = require('glob');
var async = require('async');
var fs = require('fs');
var gitlog = require('./lib/gitlog');
var getAvatar = require('./lib/avatar');
var path = require('path');
var getFrontMatter = require('yaml-front-matter').loadFront;
var _ = require('lodash');

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
                var matter = getFrontMatter(file.contents);
                if(!matter.title) {
                    var match = file.contents.match(/^#[ ]*(.*)$/m);
                    if(!match) {
                        matter.title = path.basename(file.path, path.extname(file.path));
                    } else {
                        matter.title = match && match[1];
                    }
                }
                matter.__content = undefined;
                _.assign(file, matter);
                file.contents = undefined;
                return file;
            });
            fs.writeFile('index.json', JSON.stringify(files, null, 4));
        }
    });
});
