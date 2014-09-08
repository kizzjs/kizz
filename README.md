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

- Sometimes we want to use dropbox or seafile to sync files

    With seafile, it's possible to let my girl friend to use kizz. Simply run `kizz watch` and seafile client in my server, the site will be automatically built when my girl firend updates the markdown files in seafile.

    https://github.com/haiwen/seafile

- We may need storage for extra information

### But why storage? State is evil!

- Meta Data should be saved in DB

    Without a Database, all these things have to be typed by human being.
    For me, that's worse.

    为了用户使用的简单性，我宁可牺牲架构的简单性。

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
