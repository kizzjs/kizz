# Kizz

Kizz 试图为写作提供一组合理的预设，
希望在大多数时间省去写 yaml 头的痛苦。

## Status

Still coding. The alpha version may come out in 2015.01.

## Jekyll / Hexo 的痛点

- 默认值（标题、layout、tags）不够机智

- 与 git 整合不够，不能自动从 git log 里获取 author、date 和修订记录

- 多人写作的缺失

- 改动主题需要重新 build，对主题开发非常痛苦

- 生成了很多小文件，还挺影响管理和网络传输

## 对 Kizz 的期望

- 使用 git log 的信息

- 多人写作

- 更加聪明的默认值，比如 title 从 yaml 头、Markdown H1 和文件名去猜测

- 按照文件目录去组织文章

- 内容是被动态组装上样式的，内容归内容，样式归样式

## Kizz Design

### Compile Time

- index (with metadata and gitlog)

- feed

### Frontend

- Index based search (path, metadata)

### Github API

- Full-text search

## 目录结构

### 源文件

- /contents 博客源文件

- config.json 博客配置

### 编译产生

- index.json 编译产生的索引文件，包括 metadata、gitlog

- feed.xml Atom Feed

### 主题文件

- index.html

- 404.html （用于 github rewrite）

- theme/ （其他 js、css 之类的东西）


## Requirements

```bash
sudo apt-get install git npm
```

## Dev

http://semver.org/lang/zh-CN/
