var glob = require('glob');
var async = require('async');
var fs = require('fs');
var path = require('path');
var parseMetadata = require('./lib/metadata');
var gitlog = require('./lib/gitlog');
var cwd = process.cwd();
var config = require(path.join(cwd, 'config.js'));
var mkdirp = require('mkdirp');
var _ = require('lodash');

var cmd = process.argv[2];

// kizz server
if(cmd === "server") {
    var serveStatic = require('serve-static');
    var http = require('http');
    var finalhandler = require('finalhandler');

    var dir = path.join(cwd, config.target);
    var serve = serveStatic(dir, {index: ['index.html']});
    http.createServer(function(req, res) {
        serve(req, res, finalhandler(req, res));
    }).listen(8000);
    return;
}

// kizz build
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

            var commonmark = require('commonmark');
            var commonmarkParser = new commonmark.Parser();
            var commonmarkRender = new commonmark.HtmlRenderer();

            files = files.map(function(file) {
                delete file.__content;

                // path info
                file.dirname = path.dirname(file.path);
                file.basename = path.basename(file.path, path.extname(file.path));

                // time info
                file.creationTime = file.commits[file.commits.length - 1].date;
                file.modificationTime = file.commits[0].date;

                // common mark
                file.html = commonmarkRender.render(commonmarkParser.parse(file.contents));

                return file;
            });

            var targetDir = config.target;

            var writeFile = function(filepath, contents) {
                filepath = path.join(targetDir, filepath);
                mkdirp(path.dirname(filepath), function() {
                    fs.writeFile(filepath, contents, function() {
                        console.log('Generated: ' + filepath);
                    });
                });
            };

            var compiled = _.template(fs.readFileSync());
            var renderFile = function(filepath, object) {
                var html = compiled(object);
                writeFile(filepath, html);
            };

            var rimraf = require('rimraf');
            rimraf(targetDir, function() { // clear
                // generate atom feed
                // called using sync, otherwise the contents maybe already set to null
                var feed = require('./lib/feed')(config, files);
                writeFile('feed.xml', feed);

                // generate index.json
                files = files.map(function(file) {
                    // file.contents = null;
                    return file;
                });
                writeFile('index.json', JSON.stringify(files, null, 4));

                // generate permalinks
                files.forEach(function(file) {
                    var permalink = config.permalink(file);
                    renderFile(permalink, file);
                });
            });
        }
    });
});
