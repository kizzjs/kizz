var walk = require('walk'),
    path = require('path'),
    fileStat = require('./file-stat.js');

        sourceFiles = yield sourceFiles.map(function(file) {
            return function(callback) {
                var stat = fileStat(file.path);
                file.modifiedTime = stat.modifiedTime;
                file.createTime = stat.createTime;
                return file;
            };
        });



module.exports = function(dir) {
    return function(cb) {
        var files = [],
            walker = walk.walk(dir, {followLinks: false});
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
}


