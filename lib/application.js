var Application = function() {
    // Middleware
    this.middlewares = [];
    // Source Files
    this.sourceFiles = [];
    // Parsed Files
    this.files = [];
    this.cachedFiles = [];
    this.changedFiles = [];
    this.removedFiles = [];
}

Application.use = function(test, middleware) {
    if(middleware.constructor.name != "GeneratorFunction") {
        throw new Error("Error: Application can only use Generator Function.");
    }
    this.middleware.push(middleware);
    return this;
}

Application.run = function() {
    // this.middlewares
}

module.exports = Application;