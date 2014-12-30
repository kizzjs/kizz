# RESTful API 设计文档

- GET
- POST
- PUT
- DELETE

## Pull Github

```
POST /github/pull
```

## Articles

```
GET /posts
```

```
GET /post/id
```

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


