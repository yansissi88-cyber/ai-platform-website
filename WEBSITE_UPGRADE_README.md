# Kira 网站功能升级实施文档

## 📋 项目概述

本升级方案为 KeyReply Kira AI 客服平台网站添加了三个核心功能模块：

1. **产品时间轴 (Timeline)** - 展示产品迭代历程
2. **路线图 (Roadmap)** - 展示即将开发的功能  
3. **用户故事 (User Stories)** - 从客户视角阐述产品价值

## 🗂️ 文件结构

```
ai-platform-website/
├── index.html                    # 主站首页 (已更新导航)
├── timeline.html                 # 产品时间轴页面 ⭐新增
├── roadmap.html                  # 路线图页面 ⭐新增
├── user-stories.html             # 用户故事页面 ⭐新增
│
├── data/                         # 数据文件目录 ⭐新增
│   ├── schema.json               # JSON Schema 定义
│   ├── timeline-data.json        # 时间轴数据
│   ├── roadmap-data.json         # 路线图数据
│   └── user-stories.json         # 用户故事数据
│
├── assets/
│   ├── css/
│   │   ├── timeline.css          # 时间轴样式 ⭐新增
│   │   ├── roadmap.css           # 路线图样式 ⭐新增
│   │   └── user-stories.css      # 用户故事样式 ⭐新增
│   └── js/
│       ├── timeline.js           # 时间轴交互 ⭐新增
│       ├── roadmap.js            # 路线图交互 ⭐新增
│       └── user-stories.js       # 用户故事交互 ⭐新增
│
├── scripts/
│   └── sync-all-data.js          # 数据同步脚本 ⭐新增
│
├── .github/workflows/
│   ├── auto-sync.yml             # 现有同步工作流
│   └── update-website.yml        # 新工作流：统一更新 ⭐新增
│
└── PRODUCT_UPGRADE_PLAN.md       # 完整产品方案文档
```

## 🚀 快速开始

### 1. 本地预览

```bash
cd ai-platform-website

# 使用 Python 简单 HTTP 服务器
python3 -m http.server 8080

# 或使用 Node.js 的 serve
npx serve .
```

访问 http://localhost:8080 查看网站

### 2. 页面访问

| 页面 | 本地 URL | GitHub Pages URL |
|------|----------|------------------|
| 首页 | http://localhost:8080 | https://yansissi88-cyber.github.io/ai-platform-website/ |
| 时间轴 | http://localhost:8080/timeline.html | .../timeline.html |
| 路线图 | http://localhost:8080/roadmap.html | .../roadmap.html |
| 用户故事 | http://localhost:8080/user-stories.html | .../user-stories.html |

## 📊 数据管理

### 时间轴数据
- **文件**: `data/timeline-data.json`
- **来源**: GitHub Releases
- **自动更新**: 每小时从 GitHub Releases API 同步
- **手动编辑**: 可直接修改 JSON 文件添加自定义内容

### 路线图数据
- **文件**: `data/roadmap-data.json`
- **来源**: GitHub Issues (label=roadmap) / Milestones / Projects
- **自动更新**: 每小时同步
- **状态映射**:
  - `planning` → 📋 规划中
  - `in_progress` → 🚀 开发中
  - `testing` → 🧪 测试中
  - `ready` → ✅ 待发布

### 用户故事数据
- **文件**: `data/user-stories.json`
- **来源**: 手动维护 (可扩展 AI 自动生成)
- **编辑**: 直接修改 JSON 文件

## 🔧 配置 GitHub 集成

### 1. 设置 GitHub Token

在仓库 Settings → Secrets and variables → Actions 中添加:

```
Name: KIRA_CLOUDFLARE_TOKEN
Value: <your-github-personal-access-token>
```

Token 需要权限:
- `repo` - 读取仓库数据
- `read:project` - 读取 Projects 数据

### 2. 配置 GitHub Issues 标签

在 `kira-cloudflare` 仓库中创建以下标签:

| 标签 | 颜色 | 用途 |
|------|------|------|
| `roadmap` | #0052CC | 标记纳入路线图的功能 |
| `status/planning` | #FEF2C0 | 规划阶段 |
| `status/in-progress` | #0E8A16 | 开发中 |
| `status/testing` | #F9D0C4 | 测试中 |
| `priority/high` | #B60205 | 高优先级 |
| `quarter/Q1-2026` | #666666 | Q1 2026 目标 |
| `quarter/Q2-2026` | #666666 | Q2 2026 目标 |

## 🔄 自动更新机制

### 触发方式

1. **定时触发**: 每小时自动检查更新
2. **手动触发**: 在 Actions 页面点击 "Run workflow"
3. **Webhook 触发**: Release 发布时自动触发

### 更新流程

```
GitHub Releases/Issues → sync-all-data.js → JSON 数据文件 → GitHub Pages 部署
```

### 手动运行同步脚本

```bash
cd ai-platform-website

# 设置环境变量
export GITHUB_OWNER=keyreply
export GITHUB_REPO=kira-cloudflare
export GITHUB_TOKEN=your_token_here

# 运行同步
node scripts/sync-all-data.js
```

## 🎨 页面功能说明

### 产品时间轴 (timeline.html)

**功能**:
- 垂直时间轴展示版本发布历史
- 按年份、分类、类型筛选
- 点击卡片查看详情弹窗
- 响应式适配移动端

**数据字段**:
- 版本号、发布日期
- 功能分类 (Voice/Campaign/Agent/Platform)
- 更新类型 (Feature/Fix/Improvement/Announcement)
- 亮点列表、截图、GitHub 链接

### 路线图 (roadmap.html)

**视图模式**:
- 📋 列表视图 - 按状态分组
- 🎯 看板视图 - Kanban 风格
- 📅 季度视图 - 按季度聚合

**功能**:
- 按季度、分类、优先级筛选
- 进度条可视化
- 点击卡片查看详情
- 链接到 GitHub Issue/Milestone

### 用户故事 (user-stories.html)

**功能**:
- 卡片式故事展示
- 按角色、行业、功能筛选
- 痛点 → 解决方案 → 效果 完整叙事
- 客户证言和量化指标

**故事结构**:
- 用户画像 (角色、公司、痛点)
- 场景故事 (背景、目标、行动、结果)
- 客户证言
- 效果对比指标
- 相关功能和版本

## 📝 添加新用户故事

编辑 `data/user-stories.json`，添加新对象:

```json
{
  "id": "story-007",
  "title": "故事标题",
  "feature": "关联功能",
  "persona": {
    "name": "角色名称",
    "company": "公司类型",
    "painPoints": ["痛点1", "痛点2"]
  },
  "scenario": {
    "background": "背景描述",
    "goal": "目标",
    "action": "行动",
    "result": "结果"
  },
  "quote": {
    "content": "客户证言",
    "author": "姓名",
    "role": "职位"
  },
  "metrics": {
    "before": "改进前",
    "after": "改进后",
    "improvement": "提升 50%"
  },
  "relatedFeatures": ["功能1", "功能2"],
  "relatedReleases": ["v0.12.0"],
  "tags": ["标签1", "标签2"],
  "createdAt": "2026-03-16T00:00:00Z",
  "updatedAt": "2026-03-16T00:00:00Z"
}
```

## 🐛 故障排除

### 数据未更新
1. 检查 GitHub Token 是否正确设置
2. 查看 Actions 日志排查错误
3. 手动运行 sync-all-data.js 测试

### 页面样式问题
1. 确保 CSS 文件路径正确
2. 清除浏览器缓存
3. 检查浏览器控制台错误

### 路线图无数据
1. 确认 GitHub Issues 已添加 `roadmap` 标签
2. 检查 Issues 是否为公开可见
3. 验证 Token 权限

## 📈 后续优化建议

1. **AI 内容生成**: 基于 Release Notes 自动生成用户故事草稿
2. **搜索功能**: 添加全文搜索
3. **数据可视化**: 添加图表展示趋势
4. **评论系统**: 允许用户对功能投票
5. **RSS 订阅**: 提供更新 RSS 源
6. **多语言支持**: 添加英文版本

## 📞 支持

如有问题，请:
1. 查看 GitHub Actions 日志
2. 检查浏览器控制台
3. 参考 `PRODUCT_UPGRADE_PLAN.md` 完整方案文档
