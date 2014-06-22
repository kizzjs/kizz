_ = require 'underscore'
jade = require 'jade'

globals = {}
helper = {}
config =
  tags: []
  output: 'output/'

# TODO: load tags

# TODO: load pages

compile = (options) ->
  {data, template, target} = options

  options =
    globals: _.extend globals, data
    pretty: true

  jade.renderFile "theme/templates/#{template}", options, (err, html) ->
    throw err if err?
    fs.writeFile output+target, html

routes = require("config/routes.coffee")(config, pages)
routes.forEach (route) -> compile route
