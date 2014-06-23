_ = require 'underscore'
jade = require 'jade'
yaml = require 'js-yaml'
glob = require 'glob'
marked = require 'marked'
fs = require 'fs'
guessTags = require './lib/guess-tags.js'

globals = {}

################################
#
# Load Config
#
################################

defaultConfig =
  tags: []
  output: 'output/'
config = yaml.safeLoad fs.readFileSync('config/config.yml', 'utf-8')
globals.config = _.extend defaultConfig, config

################################
#
# Load All markdown/txt files
#
################################

guessTags = (content, path, globalTags) ->
  globalTags.filter (tag) -> (content+path).indexOf(tag) > -1

types =
  markdown: ["md", "mkd", "markdown"]
  text: ["txt"]
exts = _.flatten(_.values(types)).join('|')

files = glob.sync "content/*.+(#{exts})"
globals.pages = files.map (path) ->
  info = fs.statSync path
  content = fs.readFileSync path
  # todo: try to get title from h1
  [name, ext] = path.split('/').pop().split('.')
  h1 = null
  type = ""
  for key, exts in types
    type = key if exts.indexOf(ext) > -1
  page =
    path: path
    content: content
    mtime: info.mtime
    html: marked(content)
    title: h1 or name
    name: name
    type: type
    tags: guessTags(content, path, globals.config.tags)

################################
#
# Compile Based on Routes
#
################################

compile = (options) ->
  {data, template, target} = options

  options =
    globals: _.extend {globals: globals}, data
    pretty: true

  jade.renderFile "theme/templates/#{template}", options, (err, html) ->
    throw err if err?
    fs.writeFile output+target, html

routes = require("./config/routes.js")(config, pages)
routes.forEach (route) -> compile route
