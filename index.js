var gitlog = require('./lib/gitlog');

var gravatar = require('gravatar');

var getAvatar = function(email) {
    var cache = {};
    if(!cache.email) {
        cache.email = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, true);
    }
    return cache.email;
};

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
