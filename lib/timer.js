module.exports = function(app) {
    app.when(function *() {
        return true;
    }).use(function *(next) {
        var startTime = new Date();
        this.logger.info("Kizz Start: " + startTime);
        yield next;
        var endTime = new Date();
        this.logger.info("Kizz End: " + endTime);
        this.logger.info("Build in: " + (endTime - startTime) + "ms");
    });
};
