# 🚀 下一步操作步骤（精细版）

> 预计总耗时: 30-45 分钟

---

## Phase 1: 本地测试验证 (5分钟)

### Step 1.1: 启动本地服务器

**操作**: 在终端执行以下命令

```bash
# 进入项目目录
cd /Users/sissi/ai-platform-website

# 使用 Python 启动 HTTP 服务器（推荐）
python3 -m http.server 8080
```

**预期输出**:
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

**或者使用 Node.js**:
```bash
# 如果没有 serve 工具，先安装
npm install -g serve

# 启动服务器
serve -l 8080
```

---

### Step 1.2: 浏览器验证页面

**操作**: 打开浏览器，依次访问以下 URL

| 顺序 | URL | 验证内容 |
|------|-----|----------|
| 1 | http://localhost:8080 | 首页导航栏应显示"产品时间轴/路线图/用户故事" |
| 2 | http://localhost:8080/timeline.html | 时间轴页面，应显示8个版本卡片 |
| 3 | http://localhost:8080/roadmap.html | 路线图页面，应显示3种视图切换按钮 |
| 4 | http://localhost:8080/user-stories.html | 用户故事页面，应显示6个故事卡片 |

**验证检查清单**:
- [ ] 页面能正常加载，没有 404 错误
- [ ] 导航栏样式正确，有渐变色效果
- [ ] 时间轴页面有过滤器下拉菜单
- [ ] 路线图页面有"列表/看板/季度"视图切换
- [ ] 用户故事页面有统计数据(6个故事/6个行业)

---

### Step 1.3: 功能交互测试

**时间轴页面测试**:
1. 点击任意版本卡片 → 应弹出详情模态框
2. 选择年份筛选器 → 页面应过滤显示对应年份内容
3. 点击"查看 GitHub Release"链接 → 应跳转到 GitHub

**路线图页面测试**:
1. 点击视图切换按钮(列表/看板/季度) → 布局应改变
2. 点击任意路线图卡片 → 应弹出详情模态框
3. 筛选"高优先级" → 只显示红色标签项目

**用户故事页面测试**:
1. 点击任意故事卡片 → 应弹出完整故事详情
2. 查看"效果对比"区域 → 应显示改进前后数据
3. 筛选"电商"行业 → 只显示电商相关故事

---

## Phase 2: GitHub Token 配置 (10分钟)

### Step 2.1: 生成 Personal Access Token

**操作步骤**:

1. **打开 GitHub Token 页面**:
   - 浏览器访问: https://github.com/settings/tokens
   - 或使用快捷链接: 点击右上角头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **生成新 Token**:
   - 点击 "Generate new token (classic)"
   - 输入 Note: `Kira Website Sync`
   - 选择 Expiration: `No expiration` (或 90 days)
   - 勾选以下权限:
     ```
     ☑️ repo (Full control of private repositories)
        ├── ☑️ repo:status
        ├── ☑️ repo_deployment
        ├── ☑️ public_repo
        └── ☑️ repo:invite
     ☑️ read:project (Read access of Projects)
     ```

3. **保存 Token**:
   - 点击 "Generate token"
   - **重要**: 立即复制生成的 token（只显示一次！）
   - 保存到临时位置，如:
     ```
     ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```

---

### Step 2.2: 添加到仓库 Secrets

**操作步骤**:

1. **打开仓库 Settings**:
   - 浏览器访问: https://github.com/yansissi88-cyber/ai-platform-website/settings
   - 点击 "Settings" 标签

2. **进入 Secrets 页面**:
   - 左侧菜单: Secrets and variables → Actions
   - 或直接访问: /settings/secrets/actions

3. **新建 Secret**:
   - 点击 "New repository secret"
   - Name: `KIRA_CLOUDFLARE_TOKEN`
   - Secret: 粘贴刚才复制的 Token
   - 点击 "Add secret"

**验证**:
- [ ] Secrets 列表中显示 `KIRA_CLOUDFLARE_TOKEN`

---

## Phase 3: 数据同步测试 (10分钟)

### Step 3.1: 本地测试同步脚本

**操作**: 在新的终端窗口执行

```bash
# 进入项目目录
cd /Users/sissi/ai-platform-website

# 设置环境变量
export GITHUB_OWNER=keyreply
export GITHUB_REPO=kira-cloudflare
export GITHUB_TOKEN=ghp_你的token这里

# 运行同步脚本
node scripts/sync-all-data.js
```

**预期输出**:
```
🚀 开始同步 Kira 网站数据...

📅 同步时间轴数据...
✅ 时间轴数据已更新 (X 个事件)

🗺️  同步路线图数据...
✅ 路线图数据已更新 (X 个项目)

✨ 所有数据同步完成！
📁 数据文件位置: /Users/sissi/ai-platform-website/data
```

---

### Step 3.2: 验证数据更新

**操作**: 检查数据文件是否有变化

```bash
# 查看 timeline-data.json 的更新时间
ls -la data/timeline-data.json

# 查看文件内容（检查 lastUpdated 字段）
head -5 data/timeline-data.json
```

**预期输出**:
```json
{
  "lastUpdated": "2026-03-16Txx:xx:xx.xxxZ",
  ...
}
```

---

### Step 3.3: 刷新浏览器查看更新

**操作**: 
1. 回到浏览器，刷新 http://localhost:8080/timeline.html
2. 检查页面顶部"更新于"时间是否变化

---

## Phase 4: 部署到 GitHub Pages (10分钟)

### Step 4.1: 提交代码到仓库

**操作**: 在终端执行

```bash
# 进入项目目录
cd /Users/sissi/ai-platform-website

# 添加所有新文件
git add timeline.html roadmap.html user-stories.html
git add assets/css/ assets/js/
git add data/ scripts/
git add .github/workflows/update-website.yml

# 提交更改
git commit -m "✨ Add Timeline, Roadmap, and User Stories modules

- Add product timeline page with 8 release events
- Add roadmap page with list/kanban/quarter views
- Add user stories page with 6 customer stories
- Add automated sync from GitHub Releases/Issues
- Update navigation bar with new modules"

# 推送到远程仓库
git push origin main
```

**预期输出**:
```
[main xxxxxxx] ✨ Add Timeline, Roadmap, and User Stories modules
 x files changed, x insertions(+)
 ...
```

---

### Step 4.2: 启用 GitHub Pages

**操作步骤**:

1. **打开 Pages 设置**:
   - 访问: https://github.com/yansissi88-cyber/ai-platform-website/settings/pages
   - 或点击 Settings → Pages

2. **配置 Source**:
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - 点击 "Save"

3. **等待部署**:
   - 页面会显示 "Your site is ready to be published at ..."
   - 等待 2-3 分钟
   - 刷新页面，看到 "Your site is published at https://yansissi88-cyber.github.io/ai-platform-website/"

**验证**:
- [ ] 访问 https://yansissi88-cyber.github.io/ai-platform-website/timeline.html
- [ ] 页面正常显示

---

## Phase 5: 配置自动化更新 (5分钟)

### Step 5.1: 验证 GitHub Actions 工作流

**操作步骤**:

1. **打开 Actions 页面**:
   - 访问: https://github.com/yansissi88-cyber/ai-platform-website/actions

2. **查看工作流**:
   - 应该看到 "Update Website Data & Deploy" 工作流
   - 状态应为绿色 ✅

3. **手动触发测试**:
   - 点击 "Update Website Data & Deploy"
   - 点击 "Run workflow" → "Run workflow"
   - 等待执行完成（约 2-3 分钟）

---

### Step 5.2: 配置 Release Webhook（可选高级配置）

如果想在 Release 发布时立即触发更新：

1. 在 kira-cloudflare 仓库设置 Webhook
2. Payload URL: `https://api.github.com/repos/yansissi88-cyber/ai-platform-website/dispatches`
3. Content type: `application/json`
4. Events: Releases
5. Secret: 与仓库 Secret 一致

---

## Phase 6: 数据维护（持续）

### Step 6.1: 添加新用户故事

**操作**: 编辑 `data/user-stories.json`

```bash
# 使用 VS Code 打开
open -a "Visual Studio Code" data/user-stories.json

# 或使用其他编辑器
open data/user-stories.json
```

**添加新故事模板**:
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
    "background": "背景...",
    "goal": "目标...",
    "action": "行动...",
    "result": "结果..."
  },
  "quote": {
    "content": "客户证言...",
    "author": "姓名",
    "role": "职位"
  },
  "metrics": {
    "before": "改进前",
    "after": "改进后",
    "improvement": "提升 XX%"
  },
  "relatedFeatures": ["功能1"],
  "relatedReleases": ["v0.12.0"],
  "tags": ["标签1"],
  "createdAt": "2026-03-16T00:00:00Z",
  "updatedAt": "2026-03-16T00:00:00Z"
}
```

---

### Step 6.2: 提交更改

```bash
git add data/user-stories.json
git commit -m "📝 Add new user story: XXX"
git push
```

---

## 🎯 验证清单（全部完成）

- [ ] 本地服务器启动正常，无报错
- [ ] 三个新页面都能正常访问
- [ ] GitHub Token 已生成并添加到 Secrets
- [ ] 数据同步脚本本地测试成功
- [ ] 代码已推送到 GitHub
- [ ] GitHub Pages 已启用，网站可访问
- [ ] Actions 工作流执行成功
- [ ] 用户故事数据可正常编辑

---

## 🆘 故障排除

### 问题 1: 本地服务器启动失败

**症状**: `python3 -m http.server` 报错

**解决**:
```bash
# 检查端口是否被占用
lsof -i :8080

# 更换端口
python3 -m http.server 8081
```

---

### 问题 2: 同步脚本报错 401/403

**症状**: `Error: Failed to load data`

**解决**:
1. 检查 Token 是否正确复制
2. 确认 Token 有 `repo` 权限
3. 确认仓库名称正确（keyreply/kira-cloudflare）

---

### 问题 3: GitHub Pages 404

**症状**: 访问页面显示 404

**解决**:
1. 确认代码已 push 到 main 分支
2. 检查 Settings → Pages 配置是否正确
3. 等待 5 分钟后再刷新
4. 检查仓库是否为 Public（Private 仓库 Pages 有访问限制）

---

## 📞 需要帮助？

如果在执行过程中遇到任何问题，请告诉我：
1. 当前在哪一步
2. 遇到了什么错误（复制错误信息）
3. 已经尝试过什么解决方法

我会继续协助您完成配置！
