/**
 * @file Command Line Interface
 */

var cmd = process.argv[2];

/**
 * Kizz Server
 */
if (cmd === "server") {
}

/**
 * Kizz watch -- will start watcher
 */
if (cmd === "watch") {
}


/**
 * Kizz Build
 */
if (cmd === "build" || !cmd) {
    var build = require('./lib/build');
    build();
}