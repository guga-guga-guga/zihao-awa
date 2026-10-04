export const profile = {
  name: '王子豪',
  latinName: 'WANG ZIHAO',
  initials: 'ZH',
  roles: ['视觉设计师', 'AI设计师', '独立开发者'],
  location: '重庆',
  education: '人工智能',
  educationPeriod: '2022.09 — 2026.06',
  degree: '大学本科',
  email: 'eqfsbcpoilk098@163.com',
  wechat: 'Im_baka_poi',
  github: 'guga-guga-guga',
  githubUrl: 'https://github.com/guga-guga-guga',
  available: '开放合作 / 求职中',
  summary:
    '跨越视觉设计、AI 工具与品牌策略的多面手。熟悉 3D 视觉、AI 辅助设计、品牌系统与交互体验，擅长用设计语言把技术能力转化为有辨识度的作品。具备嵌入式 + AI 视觉 + 软件开发 + 3D 设计的多维跨界储备，学习能力强，能快速把新工具、新工作流落到真实项目里。',
  longBio: [
    '利用课余及假期时间自主深耕跨界技术领域，独立完成多项技术实践项目。系统自学Blender三维建模课程拥有较高的审美，完成整套科幻场景搭建、Q版人物建模、风格化物品建模、材质节点以及动画制作等多个小型完整项目，掌握3D硬表面建模与可视化设计核心技巧。能够使用兼具美观的手段完成模型和动画制作。',
    '自主学习Godot游戏引擎及GDScript开发语言，完成过一款2D射击小游戏的全流程开发，掌握游戏需求设计、代码编写、功能调试、成品落地的开发逻辑。掌握瓦片制作、动画合成、游戏地图设计以及简易shader编写等技能。',
  ],
  stats: [
    { value: '3+', label: '年 Blender 3D 实操' },
    { value: '10+', label: 'AI / 视觉落地探索' },
    { value: '4+', label: '跨领域能力栈' },
    { value: '100%', label: '项目全流程参与' },
  ],
}

export const projects = [
  {
    id: 'scifi-scene',
    index: '01',
    title: '三维视觉',
    category: '3D DESIGN / VISUAL',
    year: '2024',
    tags: ['Blender', '场景设计', '概念视觉'],
    description: '独立完成整套科幻场景搭建、材质与灯光设计，将世界观转化为具有电影感的视觉画面。',
    image: 'images/project-history-scifi.png',
      images: [
        'images/project-history-scifi.png',
        'images/project-history-3d-q.png',
        'images/project-history-3d-washer.png',
        'images/project-history-3d-animation.png',
      ],
      media: [
        { type: 'image', src: 'images/project-history-scifi.png' },
        { type: 'image', src: 'images/project-history-3d-q.png' },
        { type: 'image', src: 'images/project-history-3d-washer.png' },
        { type: 'image', src: 'images/project-history-3d-animation.png' },
        {
          type: 'video',
          src: 'videos/project-history-3d-animation.mp4',
          poster: 'images/project-history-3d-animation-first-frame-v3.webp',
        },
      ],
    accent: '#6ee7ff',
  },
  {
    id: 'godot-game',
    index: '02',
    title: '2D 小游戏全流程',
    category: 'GAME / MOTION',
    year: '2023',
    tags: ['Godot', '游戏视觉', '动效'],
    description: '从玩法设计到视觉绘制、动效与代码实现，完成一款可游玩的 2D 小游戏，探索轻量级独立开发的完整路径。',
    gameUrl: 'game/index.html',
    gameLabel: '开始游戏',
    poster: 'images/project-history-game-2d.png',
    accent: '#fbbf24',
  },
  {
    id: 'ai-chat',
    index: '03',
    title: '多智能体 AI 聊天软件',
    category: 'AI PRODUCT / UI',
    year: '2024',
    tags: ['AI 产品', '界面设计', '交互流程'],
    description: '基于 Vibe Coding 工作流开发的可自定义 AI 人设、多群聊实时交互应用，同时负责产品视觉与体验设计。',
    image: 'images/project-history-ai.png',
    accent: '#a78bfa',
  },
  {
    id: 'ai-video',
    index: '04',
    title: 'AI 视频创作',
    category: 'AI VIDEO / CREATIVE',
    year: '2025',
    tags: ['AI 视频', '视频生成', '创意导演'],
    description: '使用 AI 视频生成工具完成从脚本、分镜到成片的创意视频创作，探索 AI 在视觉叙事中的高效工作流。',
    image: 'images/project-history-video.png',
      media: [
        { type: 'image', src: 'images/project-history-video.png' },
        {
          type: 'video',
          src: 'videos/project-history-ai-video.mp4',
          poster: 'images/project-history-ai-video-cover.webp',
        },
        {
          type: 'video',
          src: 'videos/project-ai-video-cat-home.mp4',
          poster: 'images/project-ai-video-cat-home-cover.webp',
          orientation: 'portrait',
        },
        {
          type: 'video',
          src: 'videos/project-ai-video-cat-horror.mp4',
          poster: 'images/project-ai-video-cat-horror-cover.webp',
          orientation: 'portrait',
        },
        {
          type: 'video',
          src: 'videos/project-ai-video-cat-wild.mp4',
          poster: 'images/project-ai-video-cat-wild-cover.webp',
          orientation: 'portrait',
        },
      ],
    accent: '#f472b6',
  },
]


export const skillGroups = [
  {
    name: 'AI 创作工具',
    items: ['updream', '即梦', '可灵'],
  },
  {
    name: '编程语言',
    items: ['C / C++', 'Python', 'Java'],
  },
  {
    name: '三维与游戏开发',
    items: ['Blender', 'Unity'],
  },
  {
    name: 'AI 开发工具',
    items: ['Open Code', 'Codex', 'DSH'],
  },
]


export const navLinks = [
  { label: '首页', en: 'HOME', href: '#home' },
  { label: '经历', en: 'ABOUT', href: '#about' },
  { label: '项目', en: 'WORKS', href: '#projects' },
  { label: '技能', en: 'SKILLS', href: '#skills' },
  { label: '联系', en: 'CONTACT', href: '#contact' },
]
