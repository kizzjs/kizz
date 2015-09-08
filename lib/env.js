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
    throw new Error('Fail to parse config, please check your config.json or config.js.');
} finally {
    var env = config || {};
    _.defaults(env, {
        source: './source',
        destination: './site',
        theme: './theme',
        cwd: cwd
    });
    env.source = path.join(cwd, env.source);
    env.destination = path.join(cwd, env.destination);
    // resolve theme
    var theme = path.join(cwd, env.theme);
    if (fs.existsSync(theme)) {
        env.theme = theme;
    } else {
        // TODO: allow using theme installed via npm
        // TODO: default theme
    }
}

module.exports = config;
