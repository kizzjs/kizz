var instance = {};
function File(path, obj) {
    for(var key in obj) {
        this[key] = obj[key];
    }
    this[path] = path;
    return instance[path] || (instance[path] = this);
}