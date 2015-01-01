var glob = require('glob');
var async = require('async');
var fs = require('fs');
var path = require('path');
var parseMetadata = require('./lib/metadata');
var gitlog = require('./lib/gitlog');

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
            // parse metadata
            files = files.map(parseMetadata);

            // sort by commit time
            files = files.sort(function(a, b) {
                var time = [a, b].map(function(file) {
                    return (file.commits[0] && (new Date(file.commits[0].date)).getTime()) || Infinity;
                });
                return time[1] - time[0];
            });

            // generate atom feed
            // called using sync, otherwise the contents maybe already set to null
            var config = fs.readFileSync('config.json');
            config = JSON.parse(config);
            var feed = require('./lib/feed')(config, files);
            fs.writeFile('feed.xml', feed);

            // write to index
            files = files.map(function(file) {
                file.contents = null;
                return file;
            });
            fs.writeFile('index.json', JSON.stringify(files, null, 4));
        }
    });
});
