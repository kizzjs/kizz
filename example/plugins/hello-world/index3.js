module.exports = function(context) {
    var isDependencySatisfied = function() {}
    return function(context) {
        co(function *() {
            while(true) {
                var satisfied = yield isDependencySatisfied();
                if( satisfied ) {
                    console.log("Hello World");
                } else {
                    yield next;
                }
            }
        });
    }
}