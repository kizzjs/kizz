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

    With dropbox, it's possible to let my girl friend to use kizz. Simply run `kizz watch` and dropbox client in my server, the site will be automatically built when my girl firend updates the markdown files in dropbox.

- We may need storage for extra information

### Why generator?

- The syntax is simply and sexy

- Lots of co libraries

    https://github.com/visionmedia/co/wiki

- Koajs
