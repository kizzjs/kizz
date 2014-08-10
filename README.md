# kizz

Relaxing blog system / static site generator.

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
    
- Compiler Cache
    
    Only the changed files will be compiled. 

- FileSystem Based Generator

    Use file's modified timestamp and filename for date and title
    
    Different form hexo and jekyll,
    you can use the following file structrue to organize your posts.

    ```
    content/articleName/index.md
    content/articleName/image1.jpg
    content/articleName/image2.jpg
    ```

    目录结构会被保留。
    用你最喜欢的方式组织你的文件吧，那同时也是你的URL构成方式。

- Global Tags

    No need to write tags in a markdown file,
    simply define global tags,
    and kizz will automatically figure out tags for each file.
    This is based on the content and path of each file.
    And great thanks to NaturalNode's general natural language facilities.

    You can, of course, overwrite the tags by define `tags` in yaml front matter.

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

### Rebuild all

```
kizz rebuild
```

### Preview

Kizz doesn't provide `kizz preview`, 
because there are already a lot of great tools.

```
cd public
python -m SimpleHTTPServer
```

or

```
cd public
php -S localhost:8000
```

### Install a middleware

```
npm install kizz-fs
```

### Uninstall a middleware

```
npm uninstall kizz-fs
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
    "extname": "extname", // ".md"
    "dirname": "dirname",
    "basename": "basename"
    "content": "html", // after kizz-markdown
    "title": "title", // after kizz-markdown
    "modifiedTime": "git/fs modified time (ISO String, eg. 2014-07-27T04:29:14.090Z)",
    "createTime": "git/fs create time (ISO String, eg. 2014-07-27T04:29:14.090Z)",
    "link": "link for the post (optional)",
    "tags": ["tag1", "tag2"] // after kizz-guess-tags
}
```

## FAQ

### Why NodeJS?

- NPM is great.

- Javascript is great & easy for theme developing.

### Why Generator Functions?

Gernerator 是最自然的一种书写异步方式，让人觉得很惊艳。

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

### With Dropbox / Seafile?

Simply `kizz watch` and sync files to /contents .

### Build a private site with KIZZ?

Install [isso](http://posativ.org/isso/), and listen on 127.0.0.1:1234;

```
Nginx -> HTTP Auth -> {
    / => /public
    /comments => 127.0.0.1:1234
}
```
