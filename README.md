# kizz

Relaxing blog system / static site generator

If there’s one word to describe kizz, it is relax. 

## Status

Still coding. The alpha version may come out this summer.

## Features

- Static

    纯静态的博客系统。

- Everything is a NPM package

    The plugins, theme are all npm packages.
    And thus you can simply npm update to update theme,
    and you can use your favorite nodejs packages via npm.

- Pandoc / MultiMarkdown Support

    Will use pandoc if avaliable, otherwise Marked will be the Markdown Engine.
    
- Emacs Org Support

    Emacs Org to HTML via Eamcs Lisp.
    See https://github.com/zenozeng/kizz-org

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

## Features of default theme

- Search Support

    Frontend powered search support

- Atom Feed

- Syntax Highlight

## Usage

### Build

```
kizz build
```

### Preview

```
sudo npm install http-server -g
http-server ./public -p 8080
```

### Update

#### Update Plugins & Theme

```
npm update
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
    "title": "title", // after kizz-markdown
    "link": "link for the post (optional)",
    "tags": ["tag1", "tag2"] // after kizz-guess-tags-en
}
```

## FAQ

### Why Generator Functions?

TODO

### 为什么文章顶部没有类似 Jekyll 的配置 yaml？

个人认为这样打乱写作的纯粹性。
这些繁琐的东西应该交给程序自己去管理。

### 与 Farbox 的不同？

- Kizz 任然定位成一个静态站点生成器，而非托管平台。

    本地编译意味着可以更加方便地调用本地命令

- Kizz 重度耦合 npm、co

    一切皆为 NPM 包，重度使用 generators。
    
- Kizz 以我自己为目标用户

    我是个懒惰的程序员，却又想要有一些灵活可定制的个人 blog 与 wiki 之类的。

- 开放的插件系统

    Kizz 的核心只是一个插件加载器，基本功能皆是通过插件而来，
    这同时也意味着，插件可以拥有很高的自由度，
    成为整个编译的中间件之一。
