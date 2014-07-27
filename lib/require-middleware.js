var logger = require("log4js").getLogger();

module.exports = function(plugin) {
    try {
        var path = process.cwd() + "/node_modules/" + plugin;
        return require(path);
    } catch(err) {
        if(err.toString().indexOf(plugin) < 0) {
            // module exists, but something went wrong
            logger.error("Fail to load: " + path);
            throw(err);
        }
        try {
            return require(plugin);
        } catch(e) {
            logger.error("Fail to load: " + plugin);
            throw(e);
        }
    }
}
