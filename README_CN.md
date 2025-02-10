![Navigation-on-Devices](/static/images/Display.png)

**[English README](/README.md)**

## 介绍

在 [webstack-hugo-v2.0rc2](https://github.com/iplaycode/webstack-hugo/releases/tag/2.0rc2) 的基础上进行了一些简单的改动:

- [x] 替换网站的展示图标为 SVG 格式。所有图标均为我本人绘制。部分网站使用 [默认图标](static/images/Default.svg)。
- [x] 支持自定义次级菜单的图标。
- [x] ~~使用悬浮按钮切换暗色模式, 而不是在 `config.toml` 中指定是否启用暗色模式。~~
- [x] 搜索框固定到顶栏。
- [x] 支持自定义搜索引擎。
- [x] 支持通过 `<meta>` 标签验证网站所有权。
- [x] 修改 404 页面。
- [x] 删除 `关于本站` 页面及相关模板。
- [x] 使用 Hugo 内置模板: [Open Graph](https://gohugo.io/templates/embedded/#open-graph) 和 [Twitter Cards](https://gohugo.io/templates/embedded/#twitter-cards)。
- [x] 支持自定义页面右上角的 GitHub 链接。

## 使用

```
git clone https://github.com/senzyo-desu/webstack-hugo.git
```

下载 [Hugo](https://github.com/gohugoio/hugo/releases/latest), 推荐使用 `hugo_extended` 版本。

本地调试:

```
hugo server
```

构建:

```
hugo --gc --minify
```

## 自定义

- 修改 [config.toml](/config.toml) 以自定义网站设置。
- 修改 [/data/webstack.yml](/data/webstack.yml) 以自定义网站列表。
- 推荐使用 [Favicon Generator](https://realfavicongenerator.net/) 来生成自己的 Favicon 并替换掉 `/static` 中的相关文件。
- [/data/webstack.yml](/data/webstack.yml) 中引用的图片位于 [/static/images/logos](/static/images/logos)。
- 页面左上角的 logo 即 [static/images/logo.svg](static/images/logo.svg) 和 [static/images/logo@2x.svg](static/images/logo@2x.svg)。
- 本项目使用 [Font Awesome 4.7.0](https://fontawesome.com/v4/icons/)。应注意其引用格式不同于 [Font Awesome 5](https://fontawesome.com/v5/search) 和 [Font Awesome 6](https://fontawesome.com/v6/icons)。
- 如果不想手动适配网站的图标, 可以使用 [一为 API](https://api.iowen.cn/doc/favicon.html) 自动获取。

## 致谢

- https://github.com/iplaycode/webstack-hugo
- https://github.com/WebStackPage/WebStackPage.github.io
- https://github.com/gohugoio/hugo
