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

    纯静态的博客系统。

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
    目录结构会被保留。
    用你最喜欢的方式组织你的文件吧，那同时也是你的URL构成方式。

- Global Tags

    No need to write tags in a markdown file,
    simply define global tags,
    and kizz will automatically figure out tags for each file.
    This is based on the content and path of each file.
    And great thanks to NaturalNode's general natural language facilities.

- Powerful Theme System

    A theme is also a middleware (like plugins).
    You can use your favorite templating engine (Jade, Swig, HAML and etc.)
    Simply define it in package.json's dependency and require it in your theme/index.js.
    
    Example: https://github.com/zenozeng/kizz-theme-paper

- Feed: Atom

## Features of default theme

- Search Support

    Frontend powered search support

## Usage

### Update

#### Update Plugins & Theme

```
kizz update
```

#### Update Kizz

```
sudo npm update -g kizz
```

## Standerd object

### File Object

```javascript
{
    "path": "filepath",
    "mtime": "modified time (Date Object)",
    "extname": "extname", // ".md"
    "dirname": "dirname",
    "basename": "basename"
    "content": "html", // after kizz-markdown
    "title": "title", // after kizz-guess-title
    "tags": ["tag1", "tag2"] // after kizz-guess-tags-en
}
```

## FAQ

### Why Generator Functions?

和 Koa 一样。

Koa:
With generators we can achieve “true” middleware.
Contrasting Connect’s implementation which simply passes control through series of functions until one returns,
Koa yields “downstream”, then control flows back “upstream”.
