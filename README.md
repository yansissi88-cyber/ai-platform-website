# KeyReply Kira - AI 客服平台网站

## 项目简介

这是 KeyReply Kira AI 客服平台的官方网站，基于 React + Vite 构建。

## 项目结构

```
ai-platform-website/
├── assets/                 # 构建后的静态资源
├── github-sync/           # GitHub 同步管理
│   ├── releases/          # GitHub Releases 数据
│   ├── screenshots/       # 竞品/参考网站截图
│   ├── scripts/           # 同步和截图脚本
│   └── README.md          # 同步工具说明
├── images/                # 网站图片资源
├── src/                   # 源代码
│   └── updates/           # 更新内容展示
│       ├── index.html     # 更新中心页面
│       ├── kira-features.json    # Kira 功能分析
│       └── releases.json  # GitHub Releases 数据
├── index.html            # 主页面入口
├── package.json          # 项目配置
└── README.md            # 本文件
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 网站访问

- 主站: http://localhost:3456/
- 更新中心: http://localhost:3456/src/updates/

## GitHub 同步功能

项目包含自动同步工具，用于：

1. **GitHub Releases 同步** - 自动获取仓库 Releases 作为更新来源
2. **参考网站截图** - 自动捕获 kira.keyreply.com 新功能截图

### 使用方法

```bash
# 1. 配置 GitHub 仓库
cd github-sync
# 编辑 scripts/sync-releases.js 设置 GITHUB_OWNER 和 GITHUB_REPO

# 2. 同步 Releases
node scripts/sync-releases.js

# 3. 捕获参考网站截图
node scripts/capture-screenshots.js
```

详细说明见 [github-sync/README.md](github-sync/README.md)

## Git 管理

```bash
# 初始化
git init

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin <your-github-repo-url>

# 推送
git push -u origin main
```

## 截图展示

项目自动捕获 kira.keyreply.com 的界面截图，用于参考新功能：

- 统一收件箱 (Unified Inbox)
- AI 智能回复建议
- 对话摘要面板
- 智能标签系统
- Kira AI 助手
- 工作流自动化
- Agent 构建器

截图保存在 `github-sync/screenshots/` 目录。

## 技术栈

- React 18
- Vite
- Playwright (截图)
- GitHub API (Releases 同步)
