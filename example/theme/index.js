module.exports = function *(app) {
    app.use(function *(next) {
        yield next;
        // compile start here
    }
}