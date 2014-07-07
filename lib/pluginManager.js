var exec = require('child_process').exec;

var PluginManager = function(config) {
    this.registry = config.npmRegistry;
    this.plugins = [];
    return PluginManager.instance or (PluginManager.instance = this);
}

PluginManager.prototype.add = function(plugin) {
    this.plugins.push(plugin);
}

PluginManager.prototype.install = function(plugin, callback) {
    var cmd = "npm install "+plugin;
    if(this.registry) {
        cmd += " --registry=" + this.registry;
    }
    exec(cmd, function(err, stdout, stderr) {
        callback(err || stderr, stdout);
    });
}

PluginManager.prototype.activate = function(plugin) {
    try {
        require(plugin)();
    } catch (err) {
        this.install(plugin, function(err) {
            if(err) {
                throw new Error("Fail to install dep for " + plugin);
            }
            try {
                require(plugin)();
            } catch (err) {
                console.error("Fail to activate " + plugin);
                throw err;
            }
        });
    }
}

PluginManager.prototype.activateAll = function() {
    this.plugins.forEach(function(pluginName) {
        PluginManager.instance.activate(pluginName);
    });
}

module.exports = PluginManager;