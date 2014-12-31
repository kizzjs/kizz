var gitlog = require('./lib/gitlog');

gitlog(process.cwd(), function(err, data) {
    if(!err) {
        console.log(data);
    }
});
