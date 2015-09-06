/**
 * Env settings (will parse config.json and apply default config)
 */

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var _ = require('lodash');

try {
    var configFile = path.join(cwd, 'config.json');
    if (fs.existsSync(configFile)) {
        config = fs.readFileSync(configFile);
        config = JSON.parse(config);
    }
} catch (err) {
    throw new Error('Fail to parse config, please check your config.json');
} finally {
    config = config || {};
    _.defaults(config, {
        source: './source',
        target: './output',
        cwd: cwd
    });
}

module.exports = config;