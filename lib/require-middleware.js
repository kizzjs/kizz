var logger = require("log4js").getLogger();

module.exports = function(plugin) {
    try {
        return require(process.cwd() + "/node_modules/" + plugin);
    } catch(err) {
        if(err.toString().indexOf(plugin) < 0) {
            // module exists, but something went wrong
            var path = process.cwd() + "/node_modules/" + plugin;
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
