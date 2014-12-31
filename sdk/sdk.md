# SDK API

## Posts

### List all

```javascript
SDK.getPosts();
```

### List all posts with path

Note: If all posts are already fetched, will simply use filter locally.

```javascript
SDK.getPosts({path: path})
```

### List all posts with tag

Note: If all posts are already fetched, will simply use filter locally.

```javascript
SDK.getPosts({tags: ["a", "b", "c"]});
```

### Search

```javascript
SDK.getPosts({query: [keyword1, keyword2, keyword3]});
```

### Combine Query

Note: If query is undefined and all posts are already fetched, will simply use filter locally.

```javascript
SDK.getPosts({path: path, tags: tags, query: [keyword1, keyword2, keyword3]});
```

## Tags

### List all tags

```javascript
SDK.getTags();
```

## Categories

### List all categories

```javascript
SDK.getCategories();
```
