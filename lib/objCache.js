var fs = require("fs");

var ObjCache = function() {
    this.cacheDir = '.cache/';
    if(!fs.existsSync(this.cacheDir) {
        throw new Error("Fail to init ObjCache, " + this.cacheDir + " doesn't exists.");
    }
}

ObjCache.prototype.get = function(key) {
    var file = this.cacheDir + key + ".json";
    return fs.existsSync(file) ? fs.readFileSync(file) : null;
}

ObjCache.prototype.set = function(key, obj) {
    var file = this.cacheDir + key + ".json";
    fs.write(file, JSON.stringify(obj), function(err) {
        console.error("Fail to write cache to " + file);
        throw err;
    });
}