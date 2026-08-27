# 王子豪 · 个人作品集

基于 React + Vite 的个人作品集基础版本，面向 PC 端，暗色科技感风格。

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173

## 构建

```bash
npm run build
npm run preview
```

## 目录说明

- `src/data/profile.js` — 个人资料、项目、技能等文案，后续可在此替换真实内容
- `src/components/` — 页面模块组件
- `public/images/` — 占位图片（SVG），后续可替换为真实作品图
- `public/videos/` — 首页 Hero 视频背景，放入 `hero-bg.mp4` 即可生效

## 后续优化建议

- 替换真实头像、作品截图、品牌项目案例
- 替换 Hero 背景视频
- 增加作品详情页 / 弹窗
- 根据参考网站调整字体、间距、交互动效


## 已实现

- 白昼/黑夜主题：按时间段自动切换，导航栏可手动切换
- 联系方式仅保留邮箱与微信
- 精选项目三列并排卡片
- 滑动过首页后右下角显示回到顶部按钮

- 个人技能改为“技能 / 软件”横向标签排版
- 新增“AI 视频创作”项目
