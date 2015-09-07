var cp = require('child_process');
var shell = require('shelljs');

var git = shell.which('git');

module.exports = function(filePath, cwd, callback) {

    if (!git) {
        setTimtout(function() {
            callback(null, []);
        }, 1);
        return;
    }

    // Note: don't use string to concat json, for commit subject may contain ' or "
    var commitSep = "<_______GITLOG COMMIT START_________>";
    var itemSep = "<_______GITLOG ITEM START_________>";
    var pretty = commitSep + ["%b", "%H", "%s", "%an", "%ae", "%ai"].join(itemSep);
    var gitlog = cp.spawn(git, ['log', '--pretty='+pretty, '--follow', filePath], {cwd: cwd});

    var stdout = '',
        stderr = '';

    gitlog.stderr.on('data', function(err) {
        stderr += err;
    });

    gitlog.stdout.on('data', function(data) {
        stdout += data;
    });

    gitlog.on('close', function(code) {
        var logs = [];
        stdout.split(commitSep).forEach(function(commit) {
            if(!commit) {
                return;
            }

            var items = commit.split(itemSep);

            var obj = {};
            obj.date = items.pop();
            obj.author = {
                email: items.pop(),
                name: items.pop()
            };

            obj.subject = items.pop();
            obj.hash = items.pop();
            obj.body = items.pop();

            logs.push(obj);
        });

        callback(stderr, logs);
    });
};
