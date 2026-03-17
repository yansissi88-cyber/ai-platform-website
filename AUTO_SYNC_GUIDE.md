# 🔄 智能自动同步系统使用指南

## 系统概述

当 `keyreply/kira-cloudflare` 发布新 Release 时，系统自动：
1. 📡 检测 GitHub Releases 更新
2. 🔍 分析 Release 内容提取新功能
3. 📸 访问 kira.keyreply.com 自动截图
4. 🌐 更新网站展示最新功能和截图

---

## 🚀 快速开始

### 手动触发同步

```bash
cd /Users/sissi/ai-platform-website
export $(cat .env | grep -v '^#' | xargs)
node github-sync/scripts/smart-sync.js
```

### 设置定时自动同步

```bash
# 编辑 crontab
crontab -e

# 添加每小时检查一次
0 * * * * cd /Users/sissi/ai-platform-website && export $(cat .env | grep -v '^#' | xargs) && node github-sync/scripts/smart-sync.js >> /var/log/kira-sync.log 2>&1
```

---

## 📁 系统架构

```
ai-platform-website/
├── github-sync/
│   ├── scripts/
│   │   ├── smart-sync.js          # ⭐ 智能同步主脚本
│   │   ├── sync-releases.js       # 基础 Releases 同步
│   │   └── capture-screenshots.js # 基础截图脚本
│   ├── releases/                  # Releases 数据
│   │   ├── release-v0.8.0.json
│   │   ├── release-v0.7.0.json
│   │   └── ...
│   └── screenshots/               # 📸 功能截图
│       ├── feature_campaign_v0.8.0_2026-02-06.png
│       ├── feature_agent_v0.6.0_2026-02-06.png
│       └── ...
└── src/updates/
    ├── smart-update.html          # 🌐 新版更新中心
    ├── releases.json              # Releases 展示数据
    └── feature-screenshots.json   # 功能截图映射
```

---

## 🎯 功能映射配置

系统通过关键词匹配自动识别功能并截图：

| 关键词 | 页面路径 | Release 示例 |
|--------|----------|--------------|
| `campaign` | `/campaigns` | v0.8.0 Call Script Optimizer |
| `agent` | `/agent-builder` | v0.6.0 Agent Integration |
| `mcp` | `/mcp-store` | v0.5.0 MCP Server Store |
| `contact` | `/contacts` | v0.6.0 Contact Management |
| `voice` | `/testing` | v0.7.0 Voice Templates |
| `workflow` | `/workflows` | v0.6.0 Workflow |
| `knowledge` | `/knowledge-base` | v0.6.0 Knowledge Base |
| `dashboard` | `/dashboard` | v0.5.0 Dashboard |

**配置文件**: `github-sync/scripts/smart-sync.js` 中的 `FEATURE_ROUTES`

---

## 📸 已捕获的功能截图

### v0.8.0 (最新)
- ✅ `feature_campaign_v0.8.0` - Campaign/Call Script Optimizer
- ✅ `feature_disc_v0.8.0` - DISC Profiling
- ✅ `feature_dashboard_v0.8.0` - Dashboard

### v0.7.0
- ✅ `feature_voice_v0.7.0` - Voice Templates
- ✅ `feature_template_v0.7.0` - Template Management

### v0.6.0
- ✅ `feature_campaign_v0.6.0` - Campaign Wizard
- ✅ `feature_agent_v0.6.0` - Agent Builder
- ✅ `feature_contact_v0.6.0` - Contact Management
- ✅ `feature_mcp_v0.6.0` - MCP Store
- ✅ `feature_voice_v0.6.0` - Voice Testing
- ✅ `feature_template_v0.6.0` - Templates
- ✅ `feature_workflow_v0.6.0` - Workflows
- ✅ `feature_knowledge_v0.6.0` - Knowledge Base
- ✅ `feature_setting_v0.6.0` - Settings

### v0.5.0
- ✅ `feature_agent_v0.5.0` - Agent Skills
- ✅ `feature_disc_v0.5.0` - DISC Integration
- ✅ `feature_mcp_v0.5.0` - MCP Store
- ✅ `feature_dashboard_v0.5.0` - Dashboard

### v0.4.0
- ✅ `feature_agent_v0.4.0` - Agent Testing
- ✅ `feature_contact_v0.4.0` - Contact Updates
- ✅ `feature_workflow_v0.4.0` - Workflow Security

---

## 🌐 访问网站

启动本地服务器查看更新：

```bash
./start-server.sh
```

访问地址：
- **新版更新中心**: http://localhost:3456/src/updates/smart-update.html
- **基础更新页面**: http://localhost:3456/src/updates/

---

## ⚙️ 高级配置

### 添加新的功能映射

编辑 `smart-sync.js`，在 `FEATURE_ROUTES` 中添加：

```javascript
'新功能关键词': { 
  path: '/页面路径', 
  selector: 'CSS选择器' 
},
```

### 修改截图分辨率

```javascript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },  // 修改此处
});
```

### 调整同步频率

修改 `.last-sync` 文件内容可强制重新同步所有 Releases。

---

## 🔍 故障排除

### 截图失败
```bash
# 检查 Playwright 是否安装
npx playwright install chromium

# 检查网络连接
curl https://kira.keyreply.com
```

### GitHub API 限制
```bash
# 检查 Token 是否有效
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# 查看 API 限制
curl https://api.github.com/rate_limit
```

### 网站不显示更新
```bash
# 强制刷新缓存
node github-sync/scripts/smart-sync.js

# 检查文件是否正确生成
ls -la github-sync/screenshots/
cat src/updates/feature-screenshots.json
```

---

## 📊 同步记录

上次同步时间: `github-sync/releases/.last-sync`

查看同步日志：
```bash
cat github-sync/releases/.last-sync
```

---

## 🎉 完成状态

✅ GitHub Token 已配置 (keyreply/kira-cloudflare)  
✅ 智能同步脚本已部署  
✅ 21 个功能截图已捕获 (v0.4.0 - v0.8.0)  
✅ 新版更新中心已上线  
✅ 自动化流程已就绪  

**系统已完全配置，可自动从 GitHub Releases 同步更新并截图！** 🚀
