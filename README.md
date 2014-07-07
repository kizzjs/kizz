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

- ES6 Support

    kizz included node-v0.11.13.

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
