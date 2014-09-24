var spawn = require("co-child-process"),
    co = require("co"),
    watch = require("watch"),
    fs = require("fs"),
    coFsPlus = require("co-fs-plus"),
    path = require("path"),
    _simhash = require("simhash")("md5"),
    crypto = require('crypto'),
    isBinaryFile = require('isbinaryfile'),
    _ = require('underscore');

var hammingDistance = function(arr1, arr2) {
    var d = 0;
    arr1.forEach(function(a, i) {
        if(a ^ arr2[i]) d++;
    });
    return d;
};

var simhash = function(filePath) {
    return function(callback) {
        fs.readFile(filePath, {encoding: 'UTF-8'}, function(err, content) {
            var re = /[\n]/,
                tokens = content.split(re);
            tokens = tokens.filter(function(token) {
                return token.length > 0;
            });
            callback(null, _simhash(tokens));
        });
    };
};

module.exports = function(app) {
    app.when(function *() {

        return this.config && this.Storage;

    }).use(function *(next) {

        var argv = this.argv,
            cmd = argv[2],
            arg = argv[3],
            logger = this.logger,
            ctx = this;

        if(cmd === "build" || cmd === "rebuild") {

            ////////////////////////
            //
            // Load files
            //
            ////////////////////////

            var filePaths = yield coFsPlus.walk(ctx.config.source);

            // get relative path & simhash
            var files = yield filePaths.map(function(filePath) {
                return function *() {
                    return {
                        path: path.relative(ctx.config.source, filePath),
                        absolutePath: path.join(ctx.cwd, filePath),
                        simhash: yield simhash(filePath)
                    };
                };
            });

            ////////////////////////
            //
            // Load cache & storage
            //
            ////////////////////////

            var genFileGetter = function(files) {
                var obj = {};
                files.forEach(function(file) {
                    obj[file.path] = file;
                });
                return function(path) {
                    return obj[path];
                };
            };

            var upgrade = function(storage) {
                storage.setVersion(3);
            };
            var storage = new this.Storage('kizz/files', upgrade);
            var cachedFiles = storage.getItem('files');
            cachedFiles = cachedFiles ? JSON.parse(cachedFiles) : [];
            var getCachedFile = genFileGetter(cachedFiles);

            ////////////////////////
            //
            // Classification
            //
            ////////////////////////

            var removedFiles = cachedFiles.filter(function(file) {
                return files.map(function(file) {
                    return file.path;
                }).indexOf(file.path) < 0;
            });

            var newFiles = [],
                changedFiles = [],
                unchangedFiles = [];

            var now = (new Date()).toISOString();
            files.forEach(function(file) {
                var cachedFile = getCachedFile(file.path);
                // new file
                if(!cachedFile) {
                    file.creationTime = now;
                    file.modificationTime = now;
                    newFiles.push(file);
                    return;
                }
                if(hammingDistance(cachedFile.simhash, file.simhash) === 0) {
                    // unchanged file
                    unchangedFiles.push(cachedFile);
                } else {
                    // changed file
                    file.modificationTime = now;
                    file.creationTime = cachedFile.creationTime;
                    changedFiles.push(file);
                }
            });

            //////////////////////////////////////////////////
            //
            // Rename Detection
            // Using Locality Sensitive Hashing (simhash)
            //
            /////////////////////////////////////////////////

            var removedFilesCopy = removedFiles.concat();
            newFiles = newFiles.map(function(file) {

                if(isBinaryFile(file.absolutePath)) {
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

            var basicInfo = function(file) {
                return {
                    path: file.path,
                    absolutePath: file.absolutePath,
                    simhash: file.simhash,
                    creationTime: file.creationTime,
                    modificationTime: file.modificationTime
                };
            };


            if(cmd === "rebuild") {
                if(isNaN(parseInt(arg))) {
                    newFiles = changedFiles.concat(unchangedFiles).map(basicInfo).concat(newFiles);
                    changedFiles = [];
                    unchangedFiles = [];
                } else {
                    // rebuild N
                    var N = parseInt(arg);
                    unchangedFiles = unchangedFiles.sort(function(a, b) {
                        return (new Date(b.modificationTime)).getTime() - (new Date(a.modificationTime)).getTime();
                    });
                    var moved = unchangedFiles.splice(0, N).map(basicInfo);
                    changedFiles = changedFiles.concat(moved);
                }
            }

            this.files = newFiles.map(function(file) {
                file.status = 'modified';
                return file;
            }).concat(changedFiles.map(function(file) {
                file.status = 'modified';
                return file;
            })).concat(unchangedFiles.map(function(file) {
                file.status = 'unmodified';
                return file;
            })).concat(removedFiles.map(function(file) {
                file.status = 'deleted';
                return file;
            }));

            yield next;
            
            // write to cache
            files = this.files.filter(function(file) {
                return file.status !== "deleted";
            });
            storage.setItem('files', JSON.stringify(files));
        } else {
            yield next;
        }

        if(cmd === "watch") {
            watch.watchTree(ctx.config.source, function (f, curr, prev) {
                if (typeof f == "object" && prev === null && curr === null) {
                    // nothing changed
                } else {
                    logger.info("Change detected: " + f + ", rebuild now.");
                    co(function *() {
                        var output = yield spawn(argv[0], process.execArgv.concat([argv[1], 'build']));
                        logger.info(output);
                    })();
                }
            });
        }
    });
};
