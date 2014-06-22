_ = require 'underscore'
jade = require 'jade'
yaml = require 'js-yaml'
glob = require 'glob'
marked = require 'marked'
fs = require 'fs'
require('coffee-script/register')

globals = {}

# load config
defaultConfig =
  tags: []
  output: 'output/'
config = yaml.safeLoad fs.readFileSync('config/config.yml', 'utf-8')
globals.config = _.extend defaultConfig, config

# load pages
files = glob.sync "content/*.+(md|mkd|markdown|txt)"
pages = files.map (path) ->
  info = fs.statSync path
  content = fs.readFileSync path
  filename = path.split('/').pop().split('.').shift()
  # todo: try to get title from h1
  # todo: figure out tags
  page =
    path: path
    content: content
    mtime: info.mtime
    html: marked(content)
    title: filename
    h1: null
    tags: []

# define compile fn
compile = (options) ->
  {data, template, target} = options

  options =
    globals: _.extend globals, data
    pretty: true

  jade.renderFile "theme/templates/#{template}", options, (err, html) ->
    throw err if err?
    fs.writeFile output+target, html

# compile based on routes
routes = require("./config/routes.js")(config, pages)
routes.forEach (route) -> compile route
