# Kizz

## Status

Still coding. The alpha version may come out in 2014.10.

## Features

- Incremental generation

- Guess Tags

    Simply define global tags, and kizz will automatically figure out tags for each file. This is based on the content and path of each file. And great thanks to NaturalNode's general natural language facilities.

    You can, of course, overwrite the tags by define tags in yaml front matter.

## Usage

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

    以及，如果没有数据库，那么比如用户突然想从 dropbox 迁出到 git，
    那么所有的历史记录就丢失了。
    这种情况下，使用 dropbox/git 作为数据库反而成了一种隐藏状态。

- 文章和 meta data 是不同的东西，它们应该被分离，保持输入的纯粹性。

### Why generator?

- The syntax is simply and sexy

- Lots of co libraries

    https://github.com/visionmedia/co/wiki

- Koajs

### Why not farbox?

For:

- self hosting (private writing)

- auto guess tags / timestamp

- multi-user

- seafile

- https
