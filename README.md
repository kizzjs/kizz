# kizz

Relaxing blog system / static site generator

If there’s one word to describe kizz, it is relax. 

## Status

Still coding. The alpha version may come in this summer.

## Plugins

- helloworld (will fetch from npm)

- ./plugins/helloworld (will install from local)

- helloworld@0.0.1 (will install version 0.0.1)

- <git remote url> (will install from git)

## Features

- Static

- Everything is a NPM package

    The plugins, theme, and the config/ are all npm packages.
    And thus you can use your favorite nodejs packages via npm.
    Simply create package.json and kizz will automatcally install it.

- Builtin Pandoc / MultiMarkdown Support

    Will use pandoc if avaliable, otherwise Marked will be the Markdown Engine.

- Compiler Cache
    
    Only the changed files will be compiled. 

- FileSystem Based Generator

    Use file's modified timestamp and filename for date and title

- Global Tags

    No need to write tags in a markdown file,
    simply define global tags,
    and kizz will automatically figure out tags for each file.
    This is based on the content and path of each file.
    And great thanks to NaturalNode's general natural language facilities.

- Flexible and Programmable Routing System

    See config/compile.js
    
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

## Install

### Linux / Mac

#### Via npm

Install NodeJS 0.11+ and `sudo npm install -g kizz`

#### Fancy Install

./script/install.sh

### Windows

./script/install.bat

## Dev Install

./devDep.sh
./build.sh

## FAQ

### Why not use Generator Functions for middlewares (like koa)?

Kizz is different from koa. 
Kizz's plugins' order are not defined by hardcoding.
Kizz will try to figure out the right order of them.
Using generator functions won't help with this and what's worse, it reuqires nodejs v0.11+, 
which is not that easy to install for some distros.
And if a plugin wants to use `co` or `Generator Functions`, 
then he can use that in his plugin. 

Koa:
With generators we can achieve “true” middleware.
Contrasting Connect’s implementation which simply passes control through series of functions until one returns,
Koa yields “downstream”, then control flows back “upstream”.
