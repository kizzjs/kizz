var fs = require("fs");

var ObjCache = function() {
    this.cacheDir = '.cache/';
    if(!fs.existsSync(this.cacheDir)) {
        throw new Error("Fail to init ObjCache, " + this.cacheDir + " doesn't exists.");
    }
}

ObjCache.prototype.get = function() {
    var file = this.cacheDir + "cache.json";
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, {encoding: "UTF-8"})) : null;
}

ObjCache.prototype.set = function(obj) {
    var file = this.cacheDir + "cache.json";
    fs.writeFile(file, JSON.stringify(obj), function(err) {
        if(err) {
            console.error("Fail to write cache to " + file);
            throw err;
        }
    });
}

module.exports = ObjCache;