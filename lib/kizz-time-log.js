module.exports = function(app) {
    app.when(function *() {
        return true;
    }).use(function *(next) {
        var startTime = new Date();
        this.logger.log("Kizz Start: " + startTime);
        yield next;
        var endTime = new Date();
        this.logger.log("Kizz End: " + endTime);
        this.logger.log("Kizz in: " + (endTime - startTime) + "ms");
    });
}
