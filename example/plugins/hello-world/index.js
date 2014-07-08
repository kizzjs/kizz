module.exports = function* (next) {
    var isDependencySatisfied = function() {
        return this.files.length > 0;
    }
    while(!isDependencySatisfied) {
        yield next;
    }
    console.log("Hello World! this.files created.");
}