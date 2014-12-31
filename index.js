var gitlog = require('./lib/gitlog');
var getAvatar = require('./lib/avatar');

gitlog(process.cwd(), function(err, data) {
    var commits = data.map(function(commit) {
        commit.author = {
            name: commit.author.name,
            avatar: getAvatar(commit.author.email)
        };
        return commit;
    });
    console.log(commits);
});
