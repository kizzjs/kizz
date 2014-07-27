var walk = require('walk'),
    path = require('path'),
    gitStat = require('./git-stat.js');

module.exports = function(dir) {
    return function(cb) {
        var files = [],
            walker = walk.walk(dir, {followLinks: true});
        walker.on("file", function(root, stats, next) {
            var ctime = stats.ctime,
                mtime = stats.mtime,
                file = {
                    path: root + "/" + stats.name,
                    extname: path.extname(stats.name),
                    dirname: root,
                    basename: path.basename(stats.name, path.extname(stats.name))
                };
            gitStat(file.path, function(gitStats) {
                if(gitStats.tracked) {
                    if(gitStats.status === "modified") {
                        file.modifiedTime = mtime;
                    } else {
                        file.modifiedTime = gitStats.modifiedTime;
                    }
                    file.createTime = gitStats.createTime;
                } else {
                    file.modifiedTime = mtime;
                    file.createTime = ctime;
                }
                files.push(file);
                next();
            });
        });
        walker.on("end", function() {
            cb(null, files);
        });
    }
}
