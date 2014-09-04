var FsStorage = require('fs-storage'),
    VersionStorage = require('version-storage'),
    path = require('path'),
    fsPlus = require('co-fs-plus');

module.exports = function(app) {
    app.use(function *(next) {
        var cmd = this.argv[2];
        if(cmd === "rebuild") {
            yield fsPlus.rimraf(path.join(this.cwd, '.kizz/cache/'));
        }

        var storage = new FsStorage(path.join(this.cwd, '.kizz/storage/'));
        var cache = new FsStorage(path.join(this.cwd, '.kizz/cache/'));
        this.Storage = function(storageName, upgrade) {
            return new VersionStorage(storageName, {storage: storage}, upgrade);
        };
        this.Cache = function(storageName, upgrade) {
            return new VersionStorage(storageName, {storage: cache}, upgrade);
        };

        yield next;
    });
};
