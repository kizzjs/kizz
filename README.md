# Kizz

Kizz 试图为写作提供一组合理的预设，
希望在大多数时间省去写 yaml 头的痛苦。

## Status

Still coding. The alpha version may come out in 2014.10.

## Features

- Incremental generation

- Guess Tags

    Simply define global tags, and kizz will automatically figure out tags for each file. This is based on the content and path of each file. And great thanks to NaturalNode's general natural language facilities.

    You can, of course, overwrite the tags by define tags in yaml front matter.

- [TODO] Multi-author for single post (with kizz-git / kizz-seafile)

## Usage

### Init

```bash
sudo npm install -g kizz
cd myblog
kizz init
npm install
```

### Build

kizz build (Incremental generation)

kizz rebuild (Total rebuild)

kizz rebuild N (rebuild changed files and  N latest unchanged files)

## FAQ

### Why not use git as Database?

- Sometimes we want only fs

- Sometimes we want to use dropbox or seafile to sync files

    With seafile, it's possible to let my girl friend to use kizz. Simply run `kizz watch` and seafile client in my server, the site will be automatically built when my girl firend updates the markdown files in seafile.

    https://github.com/haiwen/seafile

- We may need storage for extra information

### But why storage? State is evil!

- Meta Data should be saved in DB

    Without a Database, all these things have to be typed by human being.
    For me, that's worse.

    以及，而如果没有数据库，仅使用 git/seafile/dropbox 的元数据作为数据库，
    那么比如用户突然想从 dropbox 迁出到 git，
    所有的历史记录就会丢失了。
    这种情况下，使用 dropbox/git 作为数据库反而成了一种隐藏状态。

- 文章和 meta data 是不同的东西，它们应该被分离，保持输入的纯粹性。

    而且写回到文件会有一大堆问题，比如：

    - 难以区分这是用户设置还是程序生成（难以作为覆盖标准）

### Why generator?

- The syntax is simply and sexy

- Lots of co libraries

    https://github.com/visionmedia/co/wiki

- Koajs

世界是变动着的。
也许以后 promise 成为主流，
或者 es7 的 async function 进入可用阶段。
Anyway, 我认为 generator 是目前一个略有激进却挺中庸，综合各方面优势的一种选择。

### Why not farbox?

For:

- self hosting (private writing)

- auto guess tags / timestamp

- multi-user

- git

- seafile

- https

