基于 [Hugo](https://gohugo.io/) 和 [webstack-hugo-v2.0rc2](https://github.com/iplaycode/webstack-hugo/releases/tag/2.0rc2) 二次开发的单页导航网站。站点列表、分类、菜单图标全部由 `data/` 下的 YAML 数据驱动, 主题模板不参与数据维护, 增删站点只需改数据文件。

## 功能特性

- **数据驱动站点列表**: [data/webstack.yml](/data/webstack.yml) 定义全部站点。
- **自定义内联 SVG 图标系统**: [data/icons.yml](/data/icons.yml) 定义图标 (命名遵循 Font Awesome 规范), 由 `icon-sprite.html` 内联注入 sprite, 通过 `partial "icon"` 按名引用, 不依赖任何外部图标库。
- **明暗主题切换**: 默认暗色, 支持 [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) 圆形展开转场动画, 并兼容 `prefers-reduced-motion`。选择保存在 `localStorage`。
- **顶栏搜索**: 搜索框固定于顶栏, 支持 DuckDuckGo、Google、Bing、秘塔、Perplexity、Yandex、百度共 7 种搜索引擎, 选择结果保存在 `localStorage`, 新标签页打开。
- **站点所有权验证**: 通过 `<meta>` 标签支持 Google、Bing、Yandex、Pinterest、百度、360、搜狗 7 个平台, 在 `config.toml` 中填写即可。
- **SEO**: 使用 Hugo 内置的 [Open Graph](https://gohugo.io/templates/embedded/#open-graph) 和 [Twitter Cards](https://gohugo.io/templates/embedded/#twitter-cards) 模板; 提供 `robots.txt`。
- **GitHub 角标**: 页面右上角显示可配置的 GitHub 链接, 置空则隐藏。
- **响应式侧边栏**: 桌面 / 窄屏 / 移动三档自适应。桌面可折叠为纯图标栏 (悬停弹出二级菜单 flyout); 窄屏自动折叠; 移动端汉堡菜单下拉面板。带滚动指示条, 支持鼠标悬停 / 触摸按压 / 键盘聚焦三种高亮通道。
- **平滑滚动定位**: 点击侧边栏菜单平滑滚动至对应分类, 并高亮当前菜单项。
- **浮动按钮**: 主题切换、返回顶部、底部。
- **卡片网格**: 自适应 `grid` 布局, hover 上浮加阴影; 站点图标懒加载, 加载失败自动回退 [默认图标](static/images/Default.svg); 标题 / 描述溢出省略截断。
- **构建优化**: CSS 合并压缩 (`resources.Concat` + `minify`), JS 压缩, logo 懒加载。
- **简单 404 页面**: 跟随主题切换。

## 目录结构

```text
webstack-hugo/
├── config.toml                    # 站点配置
├── check_urls.sh                  # URL 检查脚本
├── data/
│   ├── icons.yml                  # 菜单图标 (内联 SVG) 定义
│   └── webstack.yml               # 站点列表 (分类 / 链接)
├── static/
│   ├── favicon.ico / favicon.svg  # 本项目网站图标
│   └── images/
│       ├── Default.svg            # 站点图标的回退图标
│       ├── logo.svg               # 折叠态 logo
│       ├── logo@2x.svg            # 暗色主题 logo
│       ├── logo@2x_brown.svg      # 亮色主题 logo
│       ├── Preview.png            # Open Graph / Twitter 预览图
│       ├── logos/                 # 站点图标
│       └── logos-unused/          # 暂未使用的站点图标
└── themes/
    └── webstack-hugo/             # 主题
        ├── theme.toml             # 主题元数据 (要求 Hugo ≥ 0.160.0 extended)
        ├── assets/
        │   ├── css/               # 9 个模块化样式文件
        │   └── js/nav.js          # 导航 / 主题 / 搜索交互
        └── layouts/
            ├── 404.html
            ├── index.html
            ├── robots.txt
            └── partials/
                ├── icon-sprite.html   # 内联 SVG sprite
                ├── icon.html          # 按名渲染图标
                ├── search.html        # 搜索框
                └── site-section.html  # 分类区块
```

## 开发

环境要求: [Hugo](https://github.com/gohugoio/hugo/releases/latest) `extended` 版本 (≥ 0.160.0)。

```shell
# 本地调试
hugo server --disableFastRender

# 构建 (输出到 public/)
hugo --gc --minify

# (可选) 检查 webstack.yml 中的重复 URL 与链接连通性
bash check_urls.sh

# (可选) 压缩 SVG
npx svgo -f static/images/logos
```

## 致谢

- https://github.com/iplaycode/webstack-hugo
- https://github.com/WebStackPage/WebStackPage.github.io
- https://github.com/gohugoio/hugo
