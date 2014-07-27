var gitStat = require('../lib/git-stat.js');

[
    '../README.md',
    '../DOESNT EXISTS',
    '../lib/git-stat.js',
    '../todo.org',
].forEach(function(path) {
    gitStat(path, function(err, gitStats) {
        console.log(path);
        console.log(gitStats);
    });
});
