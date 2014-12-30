// init resources
// all resources will be saved here
var resources = {};

// the cache object
// will be gc
var cache = {};

var build = new Promise(function(resolve, reject) {
    resources.posts = [];
    resources.categories = [];
});



