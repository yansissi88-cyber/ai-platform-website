# GitHub 同步与网站更新管理

这个目录用于管理网站内容的自动更新，包括 GitHub Releases 同步和竞品/参考网站截图。

## 目录结构

```
github-sync/
├── releases/           # GitHub Releases 数据存储
├── screenshots/        # 网站截图存储
├── scripts/            # 同步和截图脚本
└── README.md          # 本文件
```

## 功能说明

### 1. GitHub Releases 同步

从 GitHub 仓库获取 Releases 信息，用于更新网站的"更新日志"或"新功能"板块。

**使用方法：**

```bash
# 设置环境变量
export GITHUB_OWNER=your-github-org
export GITHUB_REPO=your-repo-name
export GITHUB_TOKEN=your-token  # 如果是私有仓库

# 运行同步脚本
node scripts/sync-releases.js
```

**输出：**
- `releases/release-{tag}.json` - 每个 release 的详细数据
- `../src/updates/releases.json` - 网站可直接使用的更新数据

### 2. 网站截图

自动捕获 https://kira.keyreply.com/ 的截图，用于参考新功能和设计。

**使用方法：**

```bash
# 安装依赖（首次运行）
npm install -g playwright
playwright install chromium

# 运行截图脚本
node scripts/capture-screenshots.js
```

**输出：**
- `screenshots/desktop_hero_YYYY-MM-DD.png` - 桌面端首页
- `screenshots/desktop_full_YYYY-MM-DD.png` - 桌面端完整页面
- `screenshots/tablet_hero_YYYY-MM-DD.png` - 平板端首页
- `screenshots/tablet_full_YYYY-MM-DD.png` - 平板端完整页面
- `screenshots/mobile_hero_YYYY-MM-DD.png` - 移动端首页
- `screenshots/mobile_full_YYYY-MM-DD.png` - 移动端完整页面

## 自动化

可以设置定时任务（如 cron）来自动执行这些脚本：

```bash
# 每天凌晨 2 点同步
0 2 * * * cd /path/to/ai-platform-website && node github-sync/scripts/sync-releases.js
0 3 * * * cd /path/to/ai-platform-website && node github-sync/scripts/capture-screenshots.js
```

## 配置

编辑 `scripts/sync-releases.js` 和 `scripts/capture-screenshots.js` 中的 `CONFIG` 对象来修改默认设置。
