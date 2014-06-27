_ = require 'underscore'
jade = require 'jade'
yaml = require 'js-yaml'
glob = require 'glob'
marked = require 'marked'
fs = require 'fs'
natural = require 'natural'

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
# Load All markdown/txt files
#
################################

types =
  markdown: ["md", "mkd", "markdown"]
  text: ["txt"]
exts = _.flatten(_.values(types)).join('|')
files = glob.sync "content/*.+(#{exts})"

wordTokenizer = new natural.WordTokenizer()
guessTags = (content, path, globalTags) ->
  content += " " + path
  englishWords = wordTokenizer.tokenize(content).map (word) ->
    word = word.toLowerCase()
    natural.PorterStemmer.stem word
  globalTags.filter (tag) ->
    if (new RegExp("[A-Za-z]")).test(tag)
      # for english words
      tag = tag.toLowerCase()
      tagStem = natural.PorterStemmer.stem tag
      englishWords.indexOf(tagStem) > -1
    else
      (content+path).indexOf(tag) > -1
getFileInfo = (path) ->
  stat = fs.statSync path
  dir = "./#{path}".split('/')
  [name, ext] = path.split('/').pop().split('.')
  type = ""
  for key, exts in types
    type = key if exts.indexOf(ext) > -1
  file =
    content: fs.readFileSync path
    mtime: (new Date(info.mtime)).getTime()
    name: name
    ext: ext
    type: type
    path: path

site.pages = files.map (path) ->
  file = getFileInfo path
  html = marked(file.content)
  h1 = html.match(new RegExp("<h1>(.*)</h1>"))
  page =
    time: file.mtime
    content: file.content
    html: html
    title: h1 or file.name
    tags: guessTags(file.content, path, site.tags)
    file: file

################################
#
# Compile Based on Routes
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

routes = require("./config/routes.js")(config, site.pages)
routes.forEach (route) -> compile route
