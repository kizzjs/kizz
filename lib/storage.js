var fs = require('co-fs'),
    fsPlus = require('co-fs-plus');

module.exports = function(app) {
    app.use(function *(next) {
        var obj,
            file = '.kizz/storage.json';

        if(yield fs.exists(file)) {
            var json = yield fs.readFile(file, {encoding: 'UTF-8'});
            obj = JSON.parse(json);
        } else {
            obj = {};
        }

        this.storage = {
            getItem: function(key) {
                return obj[key];
            },
            setItem: function(key, value) {
                if(typeof value !== "string") {
                    throw new Error("Storage: Fail to setItem, key & value must be string");
                }
                obj[key] = value;
            }
        }

        yield next;

        yield fsPlus.mkdirp('.kizz');
        fs.writeFile(file, JSON.stringify(obj));
    });
}

