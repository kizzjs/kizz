var gitlog = require('./lib/gitlog');
var getAvatar = require('./lib/avatar');
var glob = require('glob');
var path = require('path');

glob('contents/**/*.md', function(err, files) {
    var cwd = process.cwd();
    files.forEach(function(file) {
        gitlog(file, cwd, function(err, data) {
            if(err) {
                throw new Error(err);
            } else {
                console.log(data);
            }
        });
    });
});
