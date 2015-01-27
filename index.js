var glob = require('glob');
var async = require('async');
var fs = require('fs');
var path = require('path');
var parseMetadata = require('./lib/metadata');
var gitlog = require('./lib/gitlog');
var cwd = process.cwd();
var config = require(path.join(cwd, 'config.js'));

glob(path.join(config.source, '**/*.md'), function(err, files) {
    var readFiles = function(file, callback){
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
                    path: path.relative(config.source, file)
                });
            }
        });
    };
    async.map(files, readFiles, function(err, files) {
        if(err) {
            throw new Error(err);
        } else {
            // parse metadata
            files = files.map(parseMetadata);

            // sort by commit time
            files = files.sort(function(a, b) {
                var time = [a, b].map(function(file) {
                    return (file.commits[0] && (new Date(file.commits[0].date)).getTime()) || Infinity;
                });
                return time[1] - time[0];
            });

            var target = config.target;

            // generate atom feed
            // called using sync, otherwise the contents maybe already set to null
            var feed = require('./lib/feed')(config, files);
            fs.writeFile(path.join(target, 'feed.xml'), feed);

            // write to index
            files = files.map(function(file) {
                file.contents = null;
                return file;
            });
            fs.writeFile(path.join(target, 'index.json'), JSON.stringify(files, null, 4));
        }
    });
});
