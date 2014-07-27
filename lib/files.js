var fs = require('co-fs'),
    fsExtra = require("fs.extra"),
    walk = require('./co-walk.js'),
    _ = require("underscore");

var getCache = function* () {
    var cache;
    try {
        cache = yield fs.readFile('.cache.json', {encoding: 'UTF-8'});
        cache = JSON.parse(cache);
    } catch(e) {
        cache = {config: {plugins: []}, files: [], time: 0};
    }
    return cache;
}

module.exports = function(app) {
    app.use(function *(next) {
        this.logger.debug("lib/files: parse content/");

        var cache = yield getCache;
        var sourceFiles = yield walk('content');

        var cacheTime = _.isEqual(this.config, cache.config) ? new Date(cache.time) : 0;
        this.changedFiles = [];
        this.unchangedFiles = [];

        var context = this;
        sourceFiles.forEach(function(file) {
            if ((new Date(file.modifiedTime)) > cacheTime) {
                context.changedFiles.push(file);
            } else {
                context.unchangedFiles.push(file);
            }
        });

        context.removedFiles = cache.files.filter(function(file) {
            return !_.find(sourceFiles, function(sourceFile) {
                return sourceFile.path === file.path;
            });
        });
        
        yield next;

        this.logger.debug("lib/files: write .cache.json");

        cache = {
            config: context.config,
            files: context.changedFiles.concat(context.unchangedFiles),
            time: (new Date()).toISOString()
        };
        yield fs.writeFile('.cache.json', JSON.stringify(cache, null, 4));
    });
}
