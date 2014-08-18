var spawn = require("co-child-process"),
    co = require("co"),
    watch = require("watch"),
    fs = require("fs"),
    coFsPlus = require("co-fs-plus"),
    path = require("path"),
    simhash = require("simhash")("md5"),
    crypto = require('crypto'),
    moment = require('moment'),
    isBinaryFile = require("isbinaryfile");

var hammingDistance = function(arr1, arr2) {
    var d = 0;
    arr1.forEach(function(a, i) {
        if(a ^ arr2[i]) d++;
    });
    return d;
}

var coSimhash = function(file) {
    return function(callback) {
        fs.readFile(file.path, {encoding: 'UTF-8'}, function(err, content) {
            var re = /[\n]/,
                tokens = content.split(re);
            tokens = tokens.filter(function(token) {
                return token.length > 0;
            });
            file.simhash = simhash(tokens);
            callback(null, file);
        });
    }
}

module.exports = function(app) {
    app.when(function *() {

        return this.config && this.storage;

    }).use(function *(next) {

        var sourceDir = this.config.source || "source/",
            argv = this.argv,
            cmd = argv[2],
            logger = this.logger;

        if(cmd === "build" || cmd === "rebuild") {

            var filePaths = yield coFsPlus.walk(sourceDir);

            // calc simhash
            var files = yield filePaths.map(function(path) {
                return coSimhash({path: path});
            });

            // load cached files
            var cachedFiles = this.storage.getItem('files');
            cachedFiles = cachedFiles ? JSON.parse(cachedFiles) : [];
            var cachedFilesObj = {};
            cachedFiles.forEach(function(file) {
                cachedFilesObj[file.path] = file;
            });

            var removedFiles = cachedFiles.filter(function(file) {
                return filePaths.indexOf(file.path) < 0;
            });

            var newFiles = [],
                changedFiles = [],
                unchangedFiles = [];

            var now = moment().format('YYYY-MM-DD H:mm:ss Z');
            files.forEach(function(file) {
                var cachedFile = cachedFilesObj[file.path];
                if(!cachedFile) {
                    file.creationTime = now;
                    file.modificationTime = now;
                    newFiles.push(file);
                    return;
                }
                if(hammingDistance(cachedFile.simhash, file.simhash) === 0) {
                    unchangedFiles.push(cachedFile);
                } else {
                    file.modificationTime = now;
                    file.creationTime = cachedFile.creationTime;
                    file.simhash = cachedFile.simhash;
                    changedFiles.push(file);
                }
            });

            // Rename Detection
            // using Locality Sensitive Hashing (simhash)

            var removedFilesCopy = removedFiles.concat();
            newFiles = newFiles.map(function(file) {

                if(isBinaryFile(file.path)) {
                    return file;
                }

                var minD = 128,
                    oriFile = null,
                    oriFileIndex = null;

                removedFilesCopy.forEach(function(removedFile, index) {
                    if(!file.simhash || !removedFile.simhash) return;
                    var d = hammingDistance(file.simhash, removedFile.simhash);
                    if(d < minD) {
                        minD = d;
                        oriFile = removedFile;
                        oriFileIndex = index;
                    }
                });

                if(minD < 32) {
                    logger.debug("Hamming Distance: " + minD + " / 128");
                    logger.info("Rename Detected: " + oriFile.path + " -> " + file.path);
                    logger.info("Set file.creationTime to: " + oriFile.creationTime);
                    file.creationTime = oriFile.creationTime;
                    removedFilesCopy.splice(oriFileIndex, 1);
                }

                return file;
            });

            if(cmd === "rebuild") {
                newFiles = changedFiles.concat(unchangedFiles).map(function(file) {
                    return {
                        path: file.path,
                        simhash: file.simhash,
                        creationTime: file.creationTime,
                        modificationTime: file.modificationTime
                    }
                }).concat(newFiles);
                changedFiles = [];
                unchangedFiles = [];
            }


            this.newFiles = newFiles;
            this.changedFiles = changedFiles;
            this.unchangedFiles = unchangedFiles;
            this.removedFiles = removedFiles;

            yield next;

            files = this.newFiles.concat(this.changedFiles, this.unchangedFiles);
            this.storage.setItem('files', JSON.stringify(files));
        }

        if(cmd === "watch") {
            watch.watchTree(sourceDir, function (f, curr, prev) {
                if (typeof f == "object" && prev === null && curr === null) {
                    // nothing changed
                } else {
                    logger.info("Change detected: " + f + ", rebuild now.");
                    co(function *() {
                        var output = yield spawn(argv[0], process.execArgv.concat([argv[1], 'build']));
                        logger.info(output);
                    })();
                }
            })
        }
    });
}
