var exec = require('child_process').exec,
    fs = require('fs');

var PluginManager = function(config) {
    this.registry = config.registry;
    this.plugins = [];
    return PluginManager.instance || (PluginManager.instance = this);
};

PluginManager.prototype.install = function(plugin, callback) {
    var cmd = "npm install  --prefix .cache "+plugin;
    if(this.registry) {
        cmd += " --registry=" + this.registry;
    }
    exec(cmd, function(err, stdout, stderr) {
        // note: npm WARN will be in stdout
        callback(err, stderr + stdout);
    });
};

PluginManager.prototype.activate = function(plugin, arg, callback) {
    var activate = function() {
        var name = plugin;
        if (plugin.contains('/')) {
            var pkg = fs.readFileSync(plugin + "/package.json");
            pkg = JSON.parse(pkg);
            name = pkg.name;
        }
        var path = process.cwd() + "/.cache/node_modules/" + name;
        require(path)(arg);
        callback(null);
    };
    try {
        activate();
    } catch (err) {
        this.install(plugin, function(err, stdout) {
            console.log(stdout);
            if(err || stdout.contains("npm ERR!")) {
                console.error(err);
                throw new Error("Fail to install " + plugin);
            }
            try {
                activate();
            } catch (err) {
                console.error("Fail to activate " + plugin);
                throw err;
            }
        });
    }
};

module.exports = PluginManager;
