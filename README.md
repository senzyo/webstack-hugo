![Navigation-on-Devices](static/images/Display.png)

**[中文 README](/README_CN.md)**

## Introduction

This is a modified version of [webstack-hugo-v2.0rc2](https://github.com/iplaycode/webstack-hugo/releases/tag/2.0rc2) with some simple changes:

- [x] Replaced the display icon of website with SVG format. All icons are drawn by me. Some websites use the [default icon](static/images/Default.svg).
- [x] Supports custom icons for submenus.
- [x] ~~Uses a floating button to switch to dark mode instead of specifying dark mode in `config.toml`.~~
- [x] Fixed the search bar to the top bar.
- [x] Supports custom search engines.
- [x] Supports website ownership verification through `<meta>` tags.
- [x] Modified the 404 page.
- [x] Removed the 'About this site' page and related templates.
- [x] Uses Hugo built-in templates: [Open Graph](https://gohugo.io/templates/embedded/#open-graph) and [Twitter Cards](https://gohugo.io/templates/embedded/#twitter-cards).
- [x] Supports custom GitHub link in the upper right corner of pages.

## Usage

```
git clone https://github.com/senzyo-desu/webstack-hugo.git
```

Download [Hugo](https://github.com/gohugoio/hugo/releases/latest), and it is recommended to use the `hugo_extended` version.

Develop:

```
hugo server
```

Build:

```
hugo --gc --minify
```

## Customization

- Modify [config.toml](/config.toml) to customize website settings.
- Modify [/data/webstack.yml](/data/webstack.yml) to customize the website list.
- It is recommended to use [Favicon Generator](https://realfavicongenerator.net/) to generate your own favicon and replace the relevant files in `/static`.
- Images referenced in [/data/webstack.yml](/data/webstack.yml) are located in [/static/images/logos](/static/images/logos).
- The logo in the top left corner of the pages is located at [static/images/logo.svg](static/images/logo.svg) and [static/images/logo@2x.svg](static/images/logo@2x.svg).
- This project uses [Font Awesome 4.7.0](https://fontawesome.com/v4/icons/). Please note that its reference format is different from [Font Awesome 5](https://fontawesome.com/v5/search) and [Font Awesome 6](https://fontawesome.com/v6/icons).
- If you don't want to manually adapt the icons of website, you can use the [iowen api](https://api.iowen.cn/doc/favicon.html) to automatically obtain them.

## Thanks to

- https://github.com/iplaycode/webstack-hugo
- https://github.com/WebStackPage/WebStackPage.github.io
- https://github.com/gohugoio/hugo
