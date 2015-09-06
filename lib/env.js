/**
 * @file Env settings (will parse config.json and apply default config)
 */

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var _ = require('lodash');

var config;

try {
    var configFile = path.join(cwd, 'config.json');
    if (fs.existsSync(configFile)) {
        config = fs.readFileSync(configFile);
        config = JSON.parse(config);
    } else {
        configFile = path.join(cwd, 'config.js');
        if (fs.existsSync(configFile)) {
            config = require(configFile);
        }
    }
} catch (err) {
    throw new Error('Fail to parse config, please check your config.json');
} finally {
    env = config || {};
    _.defaults(env, {
        source: './source',
        target: './output',
        cwd: cwd
    });
    env.source = path.join(cwd, source);
    env.target = path.join(cwd, target);
}

module.exports = config;