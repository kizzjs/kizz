# kizz

Relaxing blog system / static site generator

If there’s one word to describe kizz, it is relax. 

## Status

Still coding. The alpha version may come in this summer.

## Plugins

- helloworld (will fetch from npm)

- plugins/helloworld (will install from local)

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

## Standerd object

### Sourcefile Object

```json
{
    "path": "filepath",
    "mtime": "modified timestamp (microtime)",
    "extname": "extname",
    "dirname": "dirname",
    "basename": "basename"
}
```

### File Object

```
{
    "path": "filepath",
    "mtime": "modified time (Date Object)",
    "extname": "extname",
    "dirname": "dirname",
    "basename": "basename"
    "content": "html", // after kizz-markdown
    "title": "title", // after kizz-markdown
    "tags": ["tag1", "tag2"] // after kizz-markdown
}
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
