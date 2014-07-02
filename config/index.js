var yaml = require("js-yaml"),
    fs = require("fs"),
    _ = require("underscore"),
    onFilesChanged = require("./onFilesChanged.js");

module.exports = function(kizz) {

    kizz.on("filesChanged", function(event, next) {
        var handler = function(obj, callback) {
            kizz.compile(obj);
            callback(null);
        };
        onFilesChanged(event.changedFiles, event.files, handler, function() {
            next(event);
        });
    });

    kizz.on("filesRemoved", function(event, next) {
        var handler = function(obj, callback) {
            fs.unlink(obj.target, callback);
        };
        onFilesChanged(event.removedFiles, event.files, handler, function() {
            next(event);
        });
    });

    kizz.config = yaml.safeLoad(fs.readFileSync("config.yml", "utf-8"));
};