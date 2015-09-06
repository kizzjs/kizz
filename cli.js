/**
 * @file Command Line Interface
 */

var cmd = process.argv[2];

/**
 * Kizz Server
 */
if (cmd === "server") {
    return;
}

/**
 * Kizz watch -- will start watcher
 */
if (cmd === "watch") {
    return;
}

/**
 * Kizz Build
 */
var build = require('./lib/build');
build();
