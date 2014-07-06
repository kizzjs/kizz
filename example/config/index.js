var yaml = require("js-yaml"),
    fs = require("fs"),
    _ = require("underscore"),
    onFilesChanged = require("./onFilesChanged.js");

module.exports = function(kizz) {

    kizz.use(function(kizz) {
        return true;
    }, function(kizz, next) {
        kizz.config = yaml.safeLoad(fs.readFileSync("config.yml", "utf-8"));
        next(kizz);
    });

    kizz.use(function(kizz) {
        return kizz.files && kizz.files[0].content;
    }, function(kizz, next) {
        // update kizz.routes
    });

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


};