# kizz

Relaxing blog system / static site generator

If there’s one word to describe kizz, it is relax. 

## Status

Still coding. The alpha version may come in this summer.

## Features

- Static

- Everything is a NPM package

    The plugins and the config/ are all npm packages.
    And thus you can use your favorite packages via npm.
    Simply create package.json and kizz will automatcally install it.

- Builtin Markdown Support

- FileSystem Based Generator

    Use file's modified timestamp and filename for date and title

- Global Tags

    No need to write tags in a markdown file,
    simply define global tags,
    and kizz will automatically figure out tags for each file.
    This is based on the content and path of each file.

- Flexible and Programmable Routing System

    See config/routes.js
    
- Search Support

    Frontend powered search support

- Feed: Atom

- Jade Templating

## Doc

Every file in content/ is called page.
Page is an object,

TODO: 标准化

```
  page =
    path: path
    content: content
    mtime: info.mtime
    html: marked(content)
    title: h1 or name
    name: name
    type: type
    tags: guessTags(content, path, globals.config.tags)
```
