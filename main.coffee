_ = require 'underscore'
jade = require 'jade'
yaml = require 'js-yaml'
glob = require 'glob'
fs = require 'fs'
path = require 'path'
natural = require 'natural'
cache = require 'lib/json-obj-cache.js'

################################
#
# Load Config
#
################################

defaultConfig =
  tags: []
  output: 'output/'
config = yaml.safeLoad fs.readFileSync('config/config.yml', 'utf-8')
site = _.extend defaultConfig, config

################################
#
# Load and Parse
#
################################

files = glob.sync "content/*"
files_last_time = cache.get('files_last_time')

# todo diff
removedFiles = []

# check mtime, lastCompileTime
changedFiles = [{path: "xxx"}]

parseChangedFiles = (changedFiles, callback) ->

  # basic parse

  files = changedFiles.map (file) ->
    # get modified time
    stat = fs.statSync file.path
    file.mtime = (new Date(stat.mtime)).getTime()
    # get basename, extname, dirname
    file.extname = path.extname file.path
    file.dirname = path.dirname file.path
    file.basename = path.basename file.path, file.extname
    # return file
    file

  # dispatch event
  # apply plugins

  callback(changedFiles);


################################
#
# Compile
#
################################

compile = (options) ->
  {template, target} = options

  options =
    globals: _.extend {site: site}, options.globals
    pretty: true

  jade.renderFile "theme/templates/#{template}", options, (err, html) ->
    throw err if err?
    fs.writeFile output+target, html

parseChangedFiles changedFiles, (changedFiles) ->
  # Note that event if changeFiles.length is []
  # compile should be called to update index files if removedFiles isn't []
  if(changedFiles.length > 0 || removedFiles.length > 0)
    require("./config/compile.js")(changedFiles, site, compile)
