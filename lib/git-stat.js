var spawn = require('co-child-process'),
    co = require('co'),
    _ = require('underscore');

var stat = function(path, callback) {
    var file = {path: path};

    co(function* () {
        try {
            var stats = {};

            var status = yield spawn('git', ['status', '-s', path]);
            var log = yield spawn('git', ['log', '--format="%ai"', '--follow', '--', path]);

            log = _.initial(log.split('\n')).map(function(log) {
                return new Date(log);
            });

            stats.tracked = log.length > 0;
            stats.modifiedTime = _.first(log);
            stats.createTime = _.last(log);
            stats.modified = status.indexOf(' M') === 0;

            callback(null, stats);
        } catch (err) {
            callback(err, null);
        }
    })()
}

module.exports = stat;
