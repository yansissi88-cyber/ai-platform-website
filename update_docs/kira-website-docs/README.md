# KeyReply Kira 产品展示网站

完整的 React + TypeScript + Tailwind CSS 项目代码

## 快速开始

### 1. 创建项目
```bash
# 使用 Vite 创建项目
npm create vite@latest my-app -- --template react-ts

# 进入项目目录
cd my-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 复制代码文件
将本目录中的所有文件复制到项目对应位置：
- `package.json` - 依赖配置
- `tsconfig.json` - TypeScript配置
- `tsconfig.node.json` - Node配置
- `vite.config.ts` - Vite配置
- `tailwind.config.js` - Tailwind配置
- `postcss.config.js` - PostCSS配置
- `index.html` - 入口HTML
- `src/` - 源代码目录

### 4. 添加图片资源
在 `public/images/` 目录下添加以下图片：
- dashboard.png
- agent_builder.png
- mcp_store.png
- synapse.png
- testing.png
- voice_testing.png
- campaigns_overview.png
- workflows.png
- inbox.png
- channels.png
- contacts_list.png
- contacts_detail.png
- knowledge_base.png
- settings_overview.png

### 5. 启动开发服务器
```bash
npm run dev
```

### 6. 构建生产版本
```bash
npm run build
```

## 项目结构

```
my-app/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── images/           # 产品截图
├── src/
│   ├── main.tsx          # 应用入口
│   ├── App.tsx           # 主应用组件
│   ├── index.css         # 全局样式
│   ├── lib/
│   │   └── utils.ts      # 工具函数
│   ├── components/ui/    # UI组件
│   │   └── button.tsx
│   └── sections/         # 页面区域组件
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── FeaturesOverview.tsx
│       ├── AIIntelligence.tsx
│       ├── Automation.tsx
│       ├── CommunicationHub.tsx
│       ├── KnowledgeManagement.tsx
│       ├── Roadmap.tsx
│       ├── CTA.tsx
│       └── Footer.tsx
```

## 主要功能模块

1. **Hero** - 主视觉区域，展示品牌价值和核心数据
2. **FeaturesOverview** - 功能概览，13个功能模块标签切换
3. **AIIntelligence** - AI智能模块展示
4. **Automation** - 自动化与营销功能
5. **CommunicationHub** - 通信中心（Inbox、Channels、Contacts）
6. **KnowledgeManagement** - 知识库管理
7. **Roadmap** - 产品路线图
8. **CTA** - 行动号召
9. **Footer** - 页脚

## 技术特点

- **响应式设计** - 完美适配桌面和移动设备
- **深色主题** - 科技感深蓝配色方案
- **玻璃拟态效果** - 现代化的UI设计
- **平滑动画** - 流畅的过渡和交互动画
- **TypeScript** - 类型安全的代码

## 颜色配置

- 主蓝色: `#2563eb`
- 青色: `#06b6d4`
- 背景色: `#0f172a`
- 卡片背景: `#1e293b`

## 外部链接

- Demo平台: https://kira.keyreply.com/
- 官网联系: https://www.keyreply.com/request-demo
