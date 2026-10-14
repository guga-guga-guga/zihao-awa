# 线上地址

| 用途 | 地址 | 构建方式 |
| --- | --- | --- |
| **主站（默认）** | https://guga-guga-guga.github.io/zihao-awa/ | GitHub Pages · `npm run build` |
| 备用 | https://zihao-awa.pages.dev/ | Cloudflare Pages · `npm run build:cf` |

日常以**主站**为准。

## 备用地址为什么用不同的构建命令

Cloudflare Pages 有**单文件 25 MiB** 上限，而游戏引擎 `index.wasm` 有 35.94 MB（34.3 MiB），用普通构建会被拒绝上传。

`npm run build:cf` = 正常构建 + 后处理（`scripts/optimize-game.mjs`）：

1. 把 `dist/game/index.wasm` 压成 `dist/game/index.wasm.gz`（**9.03 MiB**，不超限）；
2. 在 `dist/game/index.html` 注入一段 fetch 包装：引擎请求 `index.wasm` 时改取 `.wasm.gz`，用 `DecompressionStream('gzip')` 流式解压后交给引擎。

该后处理**只作用于 `dist/`**，不影响主站的构建流程。

> `DecompressionStream` 需要 Chrome/Edge 80+、Firefox 113+、Safari 16.4+；更旧的浏览器上备用站会加载不出游戏（主站不受影响）。

## 环境变量

- `VITE_GAME_ORIGIN`：**保持未设置**。留空时游戏走同域相对路径 `game/index.html`；一旦指向其它域名会变成跨域，站点与游戏的界面状态联动（切走时冻结/停音乐）会失效。

## 游戏更新后的流程

1. 游戏仓库导出 Web → 覆盖本仓库的 `public/game/`
2. 提交 `public/game/` 并推送 → 主站与备用站各自自动重新构建
