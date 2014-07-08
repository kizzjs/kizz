moudle.exports = function (kizz) {
    var isDependencySatisfied = function(callback) {
        callback(kizz.files.length > 0);
    }
    return function(next) {
        var iter = function() {
            isDependencySatisfied(function(satisfied) {
                if(satisfied) {
                    console.log("Hello World!");
                } else {
                    next(iter);
                }
            });
        }
        iter();
    }
}