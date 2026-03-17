# KeyReply Kira 产品展示网站 - 项目结构

## 项目概述
基于 React + TypeScript + Tailwind CSS + shadcn/ui 构建的现代化产品展示网站

## 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **图标**: Lucide React

## 项目结构
```
my-app/
├── index.html              # 入口HTML
├── package.json            # 依赖配置
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite配置
├── public/
│   └── images/             # 产品截图资源
│       ├── dashboard.png
│       ├── agent_builder.png
│       ├── mcp_store.png
│       ├── synapse.png
│       ├── testing.png
│       ├── voice_testing.png
│       ├── campaigns_overview.png
│       ├── workflows.png
│       ├── inbox.png
│       ├── channels.png
│       ├── contacts_list.png
│       ├── contacts_detail.png
│       ├── knowledge_base.png
│       └── settings_overview.png
├── src/
│   ├── main.tsx            # 应用入口
│   ├── App.tsx             # 主应用组件
│   ├── index.css           # 全局样式
│   ├── sections/           # 页面区域组件
│   │   ├── Navbar.tsx      # 导航栏
│   │   ├── Hero.tsx        # 主视觉区
│   │   ├── FeaturesOverview.tsx  # 功能概览
│   │   ├── AIIntelligence.tsx    # AI智能模块
│   │   ├── Automation.tsx        # 自动化营销
│   │   ├── CommunicationHub.tsx  # 通信中心
│   │   ├── KnowledgeManagement.tsx # 知识管理
│   │   ├── Roadmap.tsx           # 路线图
│   │   ├── CTA.tsx               # 行动号召
│   │   └── Footer.tsx            # 页脚
│   └── components/ui/      # shadcn/ui组件
│       └── button.tsx
```

## 安装依赖
```bash
npm install
```

## 开发运行
```bash
npm run dev
```

## 构建部署
```bash
npm run build
```

## 颜色配置 (Tailwind)
- 主蓝色: #2563eb (kr-blue-600)
- 深蓝色: #1e40af (kr-blue-800)
- 青色: #06b6d4 (kr-cyan-500)
- 背景色: #0f172a (kr-dark-900)
- 卡片背景: #1e293b (kr-dark-800)
