# RESTful API 设计文档

- GET

- POST

后端会认为作者提供的信息不可信（多人协作可能会有奇怪的东西混进来）。
后端本质上只有读操作，没有写操作。

- Gavatar (Cached in RAM, 输出的时候直接写到流里就好，中间件形式接入)

- Google Analytics API 接入（中间件形式）

## Posts

### List all posts

```
GET /posts
```

(in RAM)

不会分页，毕竟几千篇文章的索引也没多大。

### List all posts in dir

```
GET /posts/path-to-dir/
```

(Cached in RAM, with GC)

```json
[{}, {}]
```

### Query by tags

```
GET /posts/?tags=tag1+tag2
```

(Cached in RAM, with GC)


```json
[{}, {}]
```

### Query by keywords

```
GET /search/posts?q=keyword1+keyword2+keyword3
```

(Cached in RAM, with GC)

### Combine query

```
GET /search/posts/path-to-dir/?tags=tag1+tag2&q=keyword1+keyword2+keyword3
```

(Cached in RAM, with GC)

### Get a post

```
GET /posts/path-to-file
```

(in RAM)

```json
{
    "title": "TITLE",
    "path": "",
    "category": {
        "id": "catid",
        "name": "better name",
        "parent": "parent category id"
    },
    "tags": [],
    "authors": [
        {
            "name": "Zeno Zeng",
            "avatar": "AVATAR LINK"
        }
    ],
    "creationTime": "",
    "modificationTime": "",
    "content": "content"
}
```

## Tags

### List all tags

```
GET /tags
```

## Categories

### List all categories

```
GET /categories
```

(in RAM)

## Pull Github

```
POST /github/pull
```
