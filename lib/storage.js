var fs = require('co-fs'),
    fsPlus = require('co-fs-plus');

var Storage = function *(file) {

    file = '.kizz/' + file;

    var obj = {};

    if(yield fs.exists(file)) {
        var json = yield fs.readFile(file, {encoding: 'UTF-8'});
        obj = JSON.parse(json);
    }

    return {
        getItem: function(key) {
            return obj[key]
        },
        setItem: function(key, value) {
            obj[key] = value;
        },
        writeFile: function *() {
            yield fsPlus.mkdirp('.kizz');
            yield fs.writeFile(file, JSON.stringify(obj));
        }
    }
}

module.exports = function(app) {
    app.use(function *(next) {
        this.storage = yield Storage('storage.json');
        this.cache = yield Storage('cache.json');
        yield next;
        yield this.storage.writeFile();
        yield this.cache.writeFile();
    });
}
