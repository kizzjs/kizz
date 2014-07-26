var fs = require('co-fs'),
    fsExtra = require("fs.extra"),
    walk = require("walk"),
    path = require("path");

var walkContent = function(cb) {
    var files = [],
        walker = walk.walk("content", {followLinks: false});
    walker.on("file", function(root, stats, next) {
        var file = {
            path: root + "/" + stats.name,
            mtime: stats.mtime,
            extname: path.extname(stats.name),
            dirname: root,
            basename: path.basename(stats.name, path.extname(stats.name))
        }
        files.push(file);
        next();
    });
    walker.on("end", function() {
        cb(null, files);
    });
}

var getCache = function* () {
    var cache;
    try {
        cache = yield fs.readFile('.cache.json', {encoding: 'UTF-8'});
        cache = JSON.parse(cache);
    } catch(e) {
        cache = {config: {plugins: []}};
    }
    return cache;
}

module.exports = function(app) {
    app.use(function *(next) {
        var cache = yield getCache;
        var sourceFiles = yield walkContent;

        var configChanged = (JSON.stringify(cache.config) != JSON.stringify(config));
        if(!cache.time || configChanged) {
            cache.time = 0;
        }

        var pluginsChanged = JSON.stringify(cache.config.plugins) != JSON.stringify(config.plugins);
        if(pluginsChanged) {
            yield function(callback) {
                fsExtra.rmrf('.cache/node_modules', callback);
            }
        }

        context.changedFiles = sourceFiles.filter(function(file) {
            return (new Date(file.mtime)).getTime() > (new Date(cache.time)).getTime();
        });

        context.removedFiles = [];
        context.unchangedFiles = [];

        var inArr = function(file, arr) {
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].path === file.path) {
                    return true;
                }
            }
            return false;
        }

        if(!cache.files) {
            cache.files = [];
        }

        cache.files.forEach(function(file) {
            if(inArr(file, sourceFiles)) {
                if(!inArr(file, context.unchangedFiles)) {
                    context.unchangedFiles.push(file);
                }
            } else {
                context.removedFiles.push(file);
            }
        });

        
        yield next;


        // write cache
        var context = this;
        cache = {
            config: context.config,
            files: context.changedFiles.concat(context.unchangedFiles),
            time: (new Date()).getTime()
        };
        yield fs.writeFile('.cache.json', JSON.stringify(cache, null, 4));
    });
}
