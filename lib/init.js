var fs = require('co-fs'),
    fsPlus = require('co-fs-plus'),
    path = require('path');

module.exports = function(app) {
    app.use(function *(next) {
        var cmd = this.argv[2];
        var logger = this.logger;
        if(cmd === "init") {
            var writeFileUnlessExists = function *(file, data) {
                if(yield fs.exists(file)) {
                    logger.warn(file + ' already exists, ignore.');
                } else {
                    logger.info('Write File: ' + file);
                    yield fsPlus.mkdirp(path.dirname(file));
                    yield fs.writeFile(file, data);
                }
            };

            // package.json
            yield writeFileUnlessExists('package.json', JSON.stringify({
                dependencies: {
                    "kizz-theme-paper": "latest",
                    "kizz-guess-tags": "latest",
                    "kizz-markdown": "latest"
                }
            }));

            // config
            var config = yield fs.readFile(path.join(__dirname, 'config.example.js'));
            yield writeFileUnlessExists('config/index.js', config);
        }
        yield next;
    });
};

