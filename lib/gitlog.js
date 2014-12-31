var cp = require('child_process');

module.exports = function(dir, callback) {
    // Note: don't use string to concat json, for commit subject may contain ' or "
    var sep = "<_______GITLOG COMMITS START_________>";
    var pretty = sep + ["%s", "%an", "%ae", "%ai"].join('%n');
    var gitlog = cp.spawn('git', ['log', '--pretty=' + pretty, '--name-only'], {cwd: dir});

    var stdout = '',
        stderr = '';

    gitlog.stderr.on('data', function(err) {
        stderr += err;
    });

    gitlog.stdout.on('data', function(data) {
        stdout += data;
    });

    gitlog.on('exit', function(code) {
        var logs = [];
        stdout.split(sep).forEach(function(commit) {
            if(!commit) {
                return;
            }

            var lines = commit.split('\n');

            var obj = {};
            obj.subject = lines.shift();
            obj.author = {
                name: lines.shift(),
                email: lines.shift()
            };
            obj.date = lines.shift();
            obj.files = lines.filter(function(line) {
                return !!line;
            });

            logs.push(obj);
        });

        callback(stderr, logs);
    });
};
