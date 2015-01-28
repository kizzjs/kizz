# Theme Develop Guide

## Set up contents

```bash
mkdir kizz-new-theme
ln -s ../my-blog/config.json .
ln -s ../my-blog/contents .
echo config.json > .gitignore
echo contents >> .gitignore
kizz build
```

## Start server

```bash
kizz server
```

## Router

### Backbone

```javascript
routes: {
    "": "index",
    "tags/:tag": "tag",
    "*whatever": function(route) {
        if(KIZZ.router.isPost(route)) {
            // post view
        } else {
            // 404 view
        }
    }
}
```
