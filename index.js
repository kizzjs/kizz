var co = require("co"),
    fs = require("co-fs");

var context = {},
    app = new (require("beads"))(context),
    pluginManager = new (require("./lib/pluginManager"));

co(function* () {
    var config;

    try {
        config = yield fs.readFile('config.yml', 'utf-8');
    } catch(e) {
        console.error("Fail to parse config.yml");
        throw e;
    }
})();
