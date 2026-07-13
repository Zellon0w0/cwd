# Emotion Picker Design

## 目标

为 CWD 评论系统新增表情系统：默认使用根目录 `emotion/` 下的三组表情资源，后台可自定义表情 JSON，前台 Widget 在评论框和回复框下方显示表情按钮，点击后弹出表情选择面板并插入内容。

## 资源格式

- 默认表情数据使用现有 `emotion/OwO.json`。
- `emotion/emoticons.json` 提供文本表情。
- `emotion/aru/` 与 `emotion/twemoji/` 提供图片表情包，目录内 `meta.json` 负责显示名和标签。
- `emotion/generate-owo.cjs` 继续作为生成组文件的脚本，不新增资源扫描机制。

## 数据流

1. 后端 `FeatureSettings` 增加 `emotionJson?: string`。
2. 后台设置页在功能设置中显示“表情 JSON”输入框，保存到 `/admin/settings/features`。
3. 公共配置接口 `/api/config/comments` 返回 `emotionJson`。
4. Widget 读取 `emotionJson`，解析为表情组；若为空则使用内置 `emotion/OwO.json`，若自定义 JSON 解析失败则不显示自定义表情。
5. 用户选择文本表情时插入文本；选择图片表情时插入安全的 `<img class="tk-owo-emotion" ...>` 标记。

## 安全和兼容

- 自定义 JSON 只作为数据解析，不执行脚本。
- 后端保存前必须验证 JSON 格式合法。
- Widget 只使用表情项的 `icon`、`text`、`name`、`type` 字段。
- 图片表情 URL 优先使用表情项 `url`，其次使用分组 `baseUrl`，最后回退到站点相对路径 `/emotion/<pack>/<icon>.png`；不从 JSON 执行脚本。
- 后端评论 Markdown 渲染后的 XSS 白名单允许 `img.class`，但只用于保留 `tk-owo-emotion` 展示样式。

## UI

- 主评论框和回复框下方显示一个“表情”按钮。
- 点击按钮展开浮层，顶部为分组 tab，主体为表情网格。
- 点击表情后在当前光标位置插入表情内容，并关闭浮层。
- 表情按钮、弹窗和网格需要支持窄屏，不遮挡提交按钮。

## 验证

- 后端为 feature settings 增加 Vitest：读取默认值、保存合法 JSON、拒绝非法 JSON。
- 运行 `cd cwd-api && pnpm test`。
- 运行 `cd cwd-admin && npm run build`。
- 运行 `cd docs/widget && npm run build`。
