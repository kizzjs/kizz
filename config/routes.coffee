routes = (config, pages) ->
  {tags} = config
  routes = []

  tags.forEach (tag) ->
    routes.push
      data: {tag: tag}
      template: "tag.jade"
      target: "tags/#{tag}.html"

  pages.forEach (page) ->
    routes.push
      data: {page: page}
      template: "page.jade"
      target: "#{page.path}.html"

  routes.push
    data: {pages: pages}
    template: "atom.jade"
    target: "atom.xml"

  routes.push
    data: {pages: data.pages}
    template: "index.json.jade"
    target: "index.json"

  routes

module.exports = routes
