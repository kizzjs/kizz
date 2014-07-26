var spawn = require('child_process').spawn,
    co = require('co');

var gitStatus = function(path) {
    return function(callback) {
        var gitStatus = spawn('git', ['status', '-s', path]);
        gitStatus.stdout.on('data', function(data) { callback(null, data) });
        gitStatus.stderr.on('data', function(err) { callback(err, null) });
    }
}

var gitLog = function(path) {
    return function(callback) {
        var gitLog = spawn('git', ['log', '--format="%ai"', '--follow', '--', path]);
        gitLog.stdout.on('data', function(data) { callback(null, data) });
        gitLog.stderr.on('data', function(err) { callback(err, null) });
    }
}

var stat = function(path, callback) {
    var file = {path: path};

    co(function* () {
        try {
            // Modified: M README.md
            // Untracked: ?? todo.md
            // Staged: empty
            var status = yield gitStatus(path);
            var log = yield gitLog(path);
        } catch (err) {
            callback(err, null);
        }
    })()
}

module.exports = stat;
