var gravatar = require('gravatar');

module.exports = function(email) {
    var cache = {};
    if(!cache.email) {
        cache.email = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, true);
    }
    return cache.email;
};
