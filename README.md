# kizz

Relaxing blog system / static site generator

If there’s one word to describe kizz, it is relax. 

## Status

Still coding. The alpha version may come in this summer.

## Features

- Static

- Everything is a NPM package

    The plugins and the config/ are all npm packages.
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

## Events

- sourceFilesChanged

    Files in content/ changed.

- sourceFilesRemoved

    Files in content/ removed.

- sourceFilesParsed

    Files in content/ parsed.
    This event will be fired when all hooks in sourceFilesChanged will execed.

- filesChanged

    After source files parsed,
    This event will be fired when all hooks in sourceFilesChanged, sourceFilesParsed will execed.
    the kizz.files object will merge the change and fire filesChanged.

- filesRemoved

    This event will be fired when all hooks in sourceFilesRemoved will execed.

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

### Nodejs 0.11

#### Windows

http://nodejs.org/dist/v0.11.13/node-v0.11.13-x86.msi

#### Mac

#### Linux

##### Ubuntu

Use this ppa: 
https://launchpad.net/~chris-lea/+archive/node.js-devel/+packages

##### Debian

Download deb here:
https://launchpad.net/~chris-lea/+archive/node.js-devel/+sourcepub/4150429/+listing-archive-extra

Or, build from source:
http://nodejs.org/dist/v0.11.13/


## Dev Install

### Install batsh

```
sudo apt-get install opam m4
opam init
opam install ocp-build core ounit dlist cmdliner
opam install batsh
```
