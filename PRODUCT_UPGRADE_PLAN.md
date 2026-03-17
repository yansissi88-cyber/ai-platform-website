# KeyReply Kira 网站功能升级完整产品方案

## 一、需求理解与背景分析

### 1.1 当前系统现状
- **网站地址**: https://yansissi88-cyber.github.io/ai-platform-website/
- **技术栈**: HTML/CSS/JS + React + Vite + GitHub Pages
- **现有同步机制**: 
  - 每小时自动从 `kira-cloudflare` 仓库同步 Releases
  - 通过 Playwright 自动捕获功能截图
  - 已存在 GitHub Actions 自动部署工作流

### 1.2 核心痛点
1. **信息孤岛**: Release 信息分散，缺乏时间维度的可视化展示
2. **未来规划不可见**: 内部人员无法快速了解即将开发的功能
3. **缺乏用户视角**: 功能描述过于技术化，没有从客户价值角度阐述

### 1.3 新增功能需求
| 模块 | 需求描述 | 数据来源 |
|------|----------|----------|
| **产品时间轴** | 按时间展示每个需求的更新内容 | GitHub Releases + 自定义数据 |
| **路线图** | 展示即将完成的功能项目 | GitHub Issues/Milestones/Projects |
| **用户故事** | 从客户角度分析需求及发展方向 | 手动维护 + AI 生成 |

---

## 二、产品架构设计

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Kira 产品网站 (GitHub Pages)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   首页        │  │  产品时间轴   │  │   路线图      │  │  用户故事     │    │
│  │  (现有)       │  │   (新增)      │  │   (新增)      │  │   (新增)      │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │          │
│         └──────────────────┴──────────────────┴──────────────────┘          │
│                                    │                                        │
│                         ┌──────────┴──────────┐                             │
│                         │   数据聚合层 (JS)    │                             │
│                         │  - 数据转换          │                             │
│                         │  - 缓存管理          │                             │
│                         │  - 版本控制          │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                        │
├────────────────────────────────────┼────────────────────────────────────────┤
│                         ┌──────────┴──────────┐                             │
│                         │     数据源层         │                             │
│                         ├─────────────────────┤                             │
│                         │ GitHub Releases API │ ← 现有                      │
│                         │ GitHub Issues API   │ ← 新增 (路线图)             │
│                         │ GitHub Projects API │ ← 新增 (路线图)             │
│                         │ GitHub Milestones   │ ← 新增 (路线图)             │
│                         │ 用户故事 JSON       │ ← 新增 (手动维护)           │
│                         └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │   GitHub Actions    │
                         │  (自动更新工作流)    │
                         └─────────────────────┘
```

### 2.2 数据流设计

```
GitHub Releases ──┐
GitHub Issues ────┼──→ 同步脚本 ──→ JSON 数据文件 ──→ 前端渲染 ──→ 用户界面
GitHub Projects ──┤      ↑
手动用户故事 ─────┘      │
                    GitHub Actions
                    (每小时/手动触发)
```

---

## 三、模块详细设计

### 3.1 模块一：产品时间轴 (Timeline)

#### 3.1.1 功能定义
- **目的**: 以时间轴形式展示产品迭代历程，让用户直观了解产品演进
- **受众**: 内部团队、客户、潜在客户
- **价值**: 
  - 展示产品活跃度和持续创新能力
  - 帮助用户了解功能发布时间线
  - 便于回溯历史功能

#### 3.1.2 数据结构设计
```typescript
// timeline-data.json
interface TimelineEvent {
  id: string;                    // 唯一标识
  date: string;                  // ISO 8601 格式日期
  version: string;               // 版本号 (如 v0.12.0)
  type: 'feature' | 'fix' | 'improvement' | 'announcement';
  category: string;              // 功能分类：voice | campaign | agent | platform | security
  title: string;                 // 事件标题
  description: string;           // 详细描述 (支持 Markdown)
  highlights: string[];          // 亮点列表
  screenshot?: string;           // 截图路径
  releaseUrl: string;            // GitHub Release 链接
  tags: string[];                // 标签：AI, Voice, MCP 等
}

interface TimelineData {
  lastUpdated: string;
  events: TimelineEvent[];
}
```

#### 3.1.3 页面设计
```
┌─────────────────────────────────────────────────────────────────┐
│  产品时间轴                                      [筛选: 全部 ▼] │
│  追踪 Kira 的每一个重要里程碑                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  2026年3月                                                       │
│  ┌─────────┐                                                    │
│  │ v0.12.0 │──────┐  🎉 AI-Native Livechat 发布                  │
│  │ 3月4日   │      │  全新的 AI 客服工作台，支持 AI seats、审批流  │
│  └─────────┘      │  [查看详情 →]                                 │
│                   │                                             │
│  ┌─────────┐      │  🔧 Voice Pipeline 稳定性优化                 │
│  │ v0.11.0 │──────┤  100+ 项修复，全面提升通话质量                │
│  │ 2月24日  │      │  [查看详情 →]                                 │
│  └─────────┘      │                                             │
│                   │                                             │
│  2026年2月 ───────┼─────────────────────────────────────────────│
│                   │                                             │
│  ┌─────────┐      │  📞 Provider AMD 支持                         │
│  │ v0.10.0 │──────┤  电话答录机检测，提升外呼效率                 │
│  │ 2月23日  │      │  [查看详情 →]                                 │
│  └─────────┘      │                                             │
│                   │                                             │
│  2026年1月 ───────┼─────────────────────────────────────────────│
│                   │                                             │
│  ┌─────────┐      │  🔌 MCP Server Store 上线                     │
│  │ v0.5.0  │──────┤  一键连接 Salesforce、Slack、GitHub 等        │
│  │ 1月6日   │      │  [查看详情 →]                                 │
│  └─────────┘      │                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.1.4 交互设计
1. **时间轴视图模式**:
   - 垂直时间轴（默认）- 适合桌面端
   - 卡片网格 - 适合移动端
   - 日历视图 - 按月份查看

2. **筛选功能**:
   - 按年份筛选
   - 按功能分类筛选 (Voice/Campaign/Agent/Platform)
   - 按事件类型筛选 (Feature/Fix/Improvement)

3. **详情展开**:
   - 点击卡片展开完整 Release Notes
   - 内嵌截图画廊
   - 链接到 GitHub Release

---

### 3.2 模块二：路线图 (Roadmap)

#### 3.2.1 功能定义
- **目的**: 展示产品即将开发的功能，便于内部人员理解产品方向
- **受众**: 内部团队（产品、开发、销售、客户成功）
- **价值**:
  - 统一团队对产品方向的认知
  - 帮助销售团队预判功能上线时间
  - 让客户成功团队提前准备客户沟通

#### 3.2.2 数据来源设计

从 GitHub 多个数据源获取路线图信息：

```typescript
// roadmap-data.json
interface RoadmapItem {
  id: string;
  title: string;                 // 功能名称
  description: string;           // 功能描述
  category: string;              // 分类
  status: 'planning' | 'in_progress' | 'testing' | 'ready';
  priority: 'high' | 'medium' | 'low';
  quarter: string;               // 目标季度：Q1 2026, Q2 2026
  progress: number;              // 进度百分比
  source: {
    type: 'issue' | 'milestone' | 'project' | 'note';
    url: string;                 // GitHub 链接
    number?: number;             // Issue/Milestone 编号
  };
  assignees?: string[];          // 负责人
  labels: string[];              // 标签
  dependencies?: string[];       // 依赖的其他功能ID
  targetDate?: string;           // 预计发布日期
  userStory?: string;            // 关联的用户故事ID
}

interface RoadmapData {
  lastUpdated: string;
  currentQuarter: string;
  items: RoadmapItem[];
  categories: string[];
}
```

#### 3.2.3 GitHub 数据源映射

| 数据源 | 获取内容 | 映射规则 |
|--------|----------|----------|
| **GitHub Issues** | 待开发功能 | Label = "roadmap" or "feature-request" |
| **GitHub Milestones** | 版本规划 | Milestone due_date → targetDate |
| **GitHub Projects** | 项目看板 | Column 名称 → status |
| **GitHub Discussions** | 社区需求 | Category = "Ideas" |
| **Repository Notes** | 内部备注 | 特定 Markdown 文件解析 |

#### 3.2.4 页面设计
```
┌─────────────────────────────────────────────────────────────────┐
│  产品路线图                                      [Q1 2026 ▼]     │
│  了解 Kira 即将推出的新功能                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 按状态筛选: [全部] [规划中] [开发中] [测试中] [待发布]        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🚀 进行中 (3)                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ AI-Native Livechat v2          [Voice] [High]               ││
│  │ ████████████████░░░░░░ 80%     📅 Q1 2026                   ││
│  │ 更智能的客服工作台，支持多轮对话和知识库集成                  ││
│  │ #2245 →                                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Multi-language TTS             [Voice] [Medium]             ││
│  │ ██████████░░░░░░░░░░░░ 45%     📅 Q2 2026                   ││
│  │ 支持中文、日语、西班牙语等 12 种语言                          ││
│  │ #2156 →                                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  📋 规划中 (2)                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Advanced Analytics Dashboard   [Platform] [High]            ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░ 0%      📅 Q2 2026                   ││
│  │ 实时通话分析、转化率追踪、ROI 计算                            ││
│  │ #2301 →                                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ✅ 即将发布 (1)                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Voice Call Recording           [Voice] [High]               ││
│  │ ██████████████████████ 95%     📅 Q1 2026                   ││
│  │ 通话录音存储、转录、合规存档                                  ││
│  │ #1987 →                                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2.5 视图模式
1. **列表视图** (默认) - 详细展示每个功能
2. **看板视图** - 类似 GitHub Projects 的 Kanban 风格
3. **甘特图视图** - 时间线展示开发进度
4. **季度视图** - 按季度聚合展示

---

### 3.3 模块三：用户故事 (User Stories)

#### 3.3.1 功能定义
- **目的**: 从客户角度阐述功能价值，连接技术实现与业务价值
- **受众**: 销售团队、客户成功、潜在客户
- **价值**:
  - 帮助销售更好地向客户传达产品价值
  - 让客户理解功能如何解决实际问题
  - 指导产品团队从用户视角思考

#### 3.3.2 数据结构设计
```typescript
// user-stories.json
interface UserStory {
  id: string;
  title: string;                 // 故事标题
  feature: string;               // 关联功能
  persona: {                     // 用户画像
    name: string;                // 角色名称：如 "客服经理"
    company: string;             // 公司类型：如 "电商企业"
    painPoints: string[];        // 痛点列表
  };
  scenario: {                    // 使用场景
    background: string;          // 背景
    goal: string;                // 目标
    action: string;              // 行动
    result: string;              // 结果
  };
  quote?: {                      // 客户证言
    content: string;
    author: string;
    role: string;
  };
  metrics?: {                    // 效果指标
    before: string;
    after: string;
    improvement: string;         // 如 "提升 40%"
  };
  relatedFeatures: string[];     // 相关功能ID
  relatedReleases: string[];     // 相关Release版本
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserStoriesData {
  lastUpdated: string;
  stories: UserStory[];
  personas: string[];            // 所有用户角色类型
  industries: string[];          // 行业分类
}
```

#### 3.3.3 页面设计
```
┌─────────────────────────────────────────────────────────────────┐
│  用户故事                                                       │
│  从客户视角看 Kira 如何创造业务价值                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎭 角色筛选: [全部] [客服经理] [销售总监] [运营主管] [IT管理员]   │
│  🏢 行业筛选: [全部] [电商] [金融] [医疗] [教育] [SaaS]           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │  💼 客服经理 - 电商企业                                        ││
│  │  ─────────────────────────────────────────────────────────── ││
│  │                                                              ││
│  │  "每天处理 500+ 客户咨询，团队压力巨大"                        ││
│  │                                                              ││
│  │  📖 场景故事                                                   ││
│  │  张经理负责某电商平台的客服团队。大促期间，咨询量激增 300%，    ││
│  │  人工客服应接不暇，客户满意度下降至 75%。                      ││
│  │                                                              ││
│  │  使用 Kira AI-Native Livechat 后：                            ││
│  │  • AI 自动处理 60% 的常见问题                                  ││
│  │  • 复杂问题智能转接，附带上下文                                ││
│  │  • 响应时间从 5 分钟缩短至 30 秒                               ││
│  │                                                              ││
│  │  💬 "Kira 让我们的客服团队效率翻倍，客户满意度回升到 92%"       ││
│  │     — 张经理，某知名电商平台客服负责人                          ││
│  │                                                              ││
│  │  📊 效果对比                                                   ││
│  │  响应时间: 5分钟 → 30秒 (↓90%)                                ││
│  │  满意度: 75% → 92% (↑17%)                                    ││
│  │  人工成本: ￥80k/月 → ￥45k/月 (↓44%)                         ││
│  │                                                              ││
│  │  🔗 相关功能: AI-Native Livechat | Smart Routing | Analytics  ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  💼 销售总监 - SaaS 企业                                       ││
│  │  ─────────────────────────────────────────────────────────── ││
│  │  "外呼转化率低，不知道问题出在哪"                              ││
│  │  ...                                                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.3.4 内容生成策略
1. **人工编写** - 核心客户故事由产品团队撰写
2. **AI 辅助生成** - 基于 Release Notes 自动生成用户故事草稿
3. **客户访谈** - 定期收集真实客户反馈

---

## 四、自动更新系统设计

### 4.1 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions 工作流                         │
│                    (auto-sync-and-update.yml)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trigger: 每小时 / Release Published / 手动触发                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Step 1: 检出代码                                             ││
│  └────────────────────┬────────────────────────────────────────┘│
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Step 2: 获取 GitHub 数据                                     ││
│  │ • fetchReleases()    → releases.json                        ││
│  │ • fetchIssues()      → issues.json (label: roadmap)         ││
│  │ • fetchMilestones()  → milestones.json                      ││
│  │ • fetchProjects()    → projects.json                        ││
│  └────────────────────┬────────────────────────────────────────┘│
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Step 3: 数据转换与聚合                                        ││
│  │ • 解析 Release → Timeline 数据                              ││
│  │ • 解析 Issues → Roadmap 数据                                ││
│  │ • 关联用户故事                                              ││
│  │ • 生成聚合数据文件                                          ││
│  └────────────────────┬────────────────────────────────────────┘│
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Step 4: 捕获截图 (如有新功能)                                 ││
│  │ • 使用 Playwright                                           │
│  │ • 针对新功能路由截图                                        ││
│  └────────────────────┬────────────────────────────────────────┘│
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Step 5: 生成静态页面                                         ││
│  │ • timeline.html                                             ││
│  │ • roadmap.html                                              ││
│  │ • user-stories.html                                         ││
│  └────────────────────┬────────────────────────────────────────┘│
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Step 6: 部署到 GitHub Pages                                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 更新触发机制

| 触发方式 | 频率 | 用途 |
|----------|------|------|
| **定时触发** | 每小时 | 定期同步，确保数据新鲜 |
| **Release Published** | 实时 | Release 发布时立即更新 |
| **Issue Updated** | 实时 | Issues/Projects 变更时更新路线图 |
| **手动触发** | 按需 | 紧急更新或调试 |

### 4.3 增量更新策略

```javascript
// 增量更新逻辑
const updateStrategy = {
  // 检查是否有新 Release
  checkNewReleases: async () => {
    const lastSync = fs.readFileSync('.last-sync', 'utf8');
    const releases = await fetchReleases();
    const newReleases = releases.filter(r => r.published_at > lastSync);
    return newReleases;
  },
  
  // 检查 Issues 变更
  checkIssueChanges: async () => {
    const lastSync = fs.readFileSync('.last-sync', 'utf8');
    const issues = await fetchIssues({ labels: 'roadmap', since: lastSync });
    return issues;
  },
  
  // 智能更新决策
  shouldUpdate: (changes) => {
    return changes.newReleases.length > 0 || 
           changes.issueChanges.length > 0 ||
           changes.milestoneChanges.length > 0;
  }
};
```

---

## 五、技术实现方案

### 5.1 文件结构规划

```
ai-platform-website/
├── index.html                    # 主站首页
├── timeline.html                 # 产品时间轴页面
├── roadmap.html                  # 路线图页面
├── user-stories.html             # 用户故事页面
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── timeline.css          # 时间轴样式
│   │   ├── roadmap.css           # 路线图样式
│   │   └── user-stories.css      # 用户故事样式
│   └── js/
│       ├── main.js
│       ├── timeline.js           # 时间轴交互
│       ├── roadmap.js            # 路线图交互
│       └── user-stories.js       # 用户故事交互
├── data/                         # 数据文件目录
│   ├── releases.json             # Release 数据
│   ├── timeline-data.json        # 时间轴数据
│   ├── roadmap-data.json         # 路线图数据
│   └── user-stories.json         # 用户故事数据
├── images/
│   ├── timeline/                 # 时间轴截图
│   ├── roadmap/                  # 路线图图标
│   └── user-stories/             # 用户故事配图
└── .github/
    └── workflows/
        ├── auto-sync.yml         # 现有同步工作流
        └── update-website.yml    # 新工作流：更新网站
```

### 5.2 数据同步脚本

```javascript
// scripts/sync-all-data.js
const syncScripts = {
  // 同步时间轴数据
  syncTimeline: async () => {
    const releases = await fetchGitHubReleases();
    const timelineEvents = releases.map(release => ({
      id: release.id,
      date: release.published_at,
      version: release.tag_name,
      type: classifyEventType(release),
      title: release.name,
      description: release.body,
      // ...
    }));
    fs.writeFileSync('data/timeline-data.json', JSON.stringify(timelineEvents));
  },
  
  // 同步路线图数据
  syncRoadmap: async () => {
    const [issues, milestones, projects] = await Promise.all([
      fetchGitHubIssues({ labels: 'roadmap' }),
      fetchGitHubMilestones(),
      fetchGitHubProjects()
    ]);
    const roadmapItems = [...parseIssues(issues), ...parseMilestones(milestones)];
    fs.writeFileSync('data/roadmap-data.json', JSON.stringify(roadmapItems));
  },
  
  // 同步用户故事
  syncUserStories: async () => {
    // 用户故事以手动维护为主
    // 这里可以添加 AI 辅助生成功能
  }
};
```

### 5.3 页面组件设计

#### 时间轴组件
```javascript
// 垂直时间轴组件
class TimelineComponent {
  constructor(data) {
    this.data = data;
    this.filter = { year: 'all', category: 'all', type: 'all' };
  }
  
  render() {
    return `
      <div class="timeline">
        ${this.groupByYear().map(year => `
          <div class="timeline-year">
            <h3 class="year-label">${year.year}年</h3>
            <div class="timeline-events">
              ${year.events.map(event => this.renderEvent(event)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  renderEvent(event) {
    return `
      <div class="timeline-event" data-category="${event.category}">
        <div class="event-marker event-type-${event.type}"></div>
        <div class="event-card">
          <span class="event-version">${event.version}</span>
          <h4 class="event-title">${event.title}</h4>
          <p class="event-date">${formatDate(event.date)}</p>
          <div class="event-highlights">
            ${event.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }
}
```

#### 路线图组件
```javascript
// 路线图看板组件
class RoadmapComponent {
  constructor(data) {
    this.data = data;
    this.viewMode = 'list'; // list | kanban | gantt
  }
  
  renderKanban() {
    const columns = ['planning', 'in_progress', 'testing', 'ready'];
    return `
      <div class="roadmap-kanban">
        ${columns.map(status => `
          <div class="kanban-column" data-status="${status}">
            <h4>${this.getStatusLabel(status)}</h4>
            <div class="kanban-items">
              ${this.getItemsByStatus(status).map(item => `
                <div class="roadmap-card" data-priority="${item.priority}">
                  <span class="item-category">${item.category}</span>
                  <h5>${item.title}</h5>
                  <div class="progress-bar">
                    <div class="progress" style="width: ${item.progress}%"></div>
                  </div>
                  <span class="target-date">${item.targetDate || item.quarter}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}
```

---

## 六、实施路线图

### 6.1 开发阶段规划

```
Phase 1: 基础架构 (Week 1-2)
├── 创建数据结构和 JSON Schema
├── 开发数据同步脚本
├── 设置 GitHub Actions 工作流
└── 基础页面框架搭建

Phase 2: 时间轴模块 (Week 3-4)
├── 开发时间轴数据转换逻辑
├── 实现垂直时间轴 UI
├── 添加筛选和搜索功能
├── 响应式适配
└── 集成截图展示

Phase 3: 路线图模块 (Week 5-6)
├── 开发 GitHub Issues/Milestones 同步
├── 实现路线图看板 UI
├── 添加多视图切换 (列表/看板/甘特图)
├── 进度计算和展示
└── 与 GitHub 双向链接

Phase 4: 用户故事模块 (Week 7-8)
├── 设计用户故事数据结构
├── 开发故事卡片 UI
├── 实现角色/行业筛选
├── 添加效果指标可视化
└── AI 辅助生成 POC

Phase 5: 集成与优化 (Week 9-10)
├── 导航栏整合新模块
├── 统一视觉风格
├── 性能优化 (懒加载、缓存)
├── 移动端适配优化
└── 文档编写

Phase 6: 上线与迭代 (Week 11+)
├── 正式上线
├── 监控和数据分析
└── 持续迭代优化
```

### 6.2 优先级划分

| 优先级 | 功能 | 原因 |
|--------|------|------|
| **P0** | 时间轴基础功能 | 直接使用现有 Release 数据，实现成本低 |
| **P0** | 自动更新机制 | 确保数据实时性，是核心基础设施 |
| **P1** | 路线图基础功能 | 需要扩展 GitHub API 调用，依赖 Issue/Milestone 规范 |
| **P1** | 用户故事基础功能 | 需要人工编写内容，可先做少量示例 |
| **P2** | 高级筛选和搜索 | 提升用户体验，非核心功能 |
| **P2** | AI 辅助生成 | 长期优化方向 |

---

## 七、GitHub 集成详细配置

### 7.1 需要的 GitHub Token 权限

```
Token 名称: KIRA_WEBSITE_SYNC_TOKEN
权限范围:
- repo (读取 Releases、Issues、Projects)
- read:project (读取 Projects)
```

### 7.2 GitHub Issues 标签规范

为支持路线图功能，需要在 `kira-cloudflare` 仓库建立标签规范：

| 标签 | 用途 | 颜色 |
|------|------|------|
| `roadmap` | 标记纳入路线图的功能 | #0052CC |
| `status/planning` | 规划阶段 | #FEF2C0 |
| `status/in-progress` | 开发中 | #0E8A16 |
| `status/testing` | 测试中 | #F9D0C4 |
| `status/ready` | 待发布 | #C5DEF5 |
| `priority/high` | 高优先级 | #B60205 |
| `priority/medium` | 中优先级 | #FBCA04 |
| `priority/low` | 低优先级 | #0E8A16 |
| `quarter/Q1-2026` | Q1 2026 目标 | #666666 |
| `quarter/Q2-2026` | Q2 2026 目标 | #666666 |

### 7.3 GitHub Projects 看板结构

建议创建 "Kira Roadmap" Project，包含以下列：

1. 📋 Backlog - 待规划
2. 🎯 Planned - 已规划 (当前季度)
3. 🚀 In Progress - 开发中
4. 🧪 Testing - 测试中
5. ✅ Ready - 待发布
6. 🎉 Released - 已发布

---

## 八、UI/UX 设计规范

### 8.1 视觉风格延续

延续现有网站的深色科技风格：

```css
:root {
  /* 现有变量 */
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --bg-card: #1a1f2e;
  --accent-blue: #3b82f6;
  --accent-cyan: #06b6d4;
  --accent-purple: #8b5cf6;
  
  /* 新增状态色 */
  --status-planning: #64748b;
  --status-progress: #3b82f6;
  --status-testing: #f59e0b;
  --status-ready: #10b981;
  
  /* 优先级色 */
  --priority-high: #ef4444;
  --priority-medium: #f59e0b;
  --priority-low: #10b981;
}
```

### 8.2 导航栏更新

```
┌─────────────────────────────────────────────────────────────────┐
│  🔷 Kira      功能特性    产品时间轴    路线图    用户故事    [开始使用] │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 响应式断点

| 断点 | 宽度 | 布局调整 |
|------|------|----------|
| Desktop XL | ≥1440px | 完整三栏布局 |
| Desktop | ≥1024px | 双栏布局 |
| Tablet | ≥768px | 单栏 + 侧边筛选 |
| Mobile | <768px | 单栏 + 底部导航 |

---

## 九、成功指标

### 9.1 技术指标
- [ ] 自动更新成功率 > 95%
- [ ] 页面加载时间 < 3s
- [ ] 数据同步延迟 < 1小时
- [ ] 移动端兼容性 > 98%

### 9.2 业务指标
- [ ] 内部团队满意度 > 4.5/5
- [ ] 路线图信息查询频次
- [ ] 用户故事页面停留时间
- [ ] 新功能发现率提升

---

## 十、风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| GitHub API 限流 | 高 | 实现缓存机制，错峰调用 |
| 数据格式变更 | 中 | 版本化数据 Schema，向后兼容 |
| 用户故事内容不足 | 中 | 分阶段上线，先技术功能后内容 |
| 截图捕获失败 | 低 | 添加重试机制和默认占位图 |

---

## 附录

### A. 参考链接
- GitHub REST API: https://docs.github.com/en/rest
- GitHub Projects API: https://docs.github.com/en/rest/projects
- GitHub Actions: https://docs.github.com/en/actions

### B. 相关文件
- 现有同步脚本: `github-sync/scripts/smart-sync.js`
- Release 数据: `github-sync/releases/`
- 更新中心: `src/updates/`

### C. 待确认事项
1. GitHub 仓库是否有 Issues/Projects 可供路线图使用？
2. 用户故事是否已有客户访谈素材？
3. 路线图是否包含敏感信息需要权限控制？
