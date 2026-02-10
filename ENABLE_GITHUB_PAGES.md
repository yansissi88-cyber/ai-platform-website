# 🌐 启用 GitHub Pages 公开访问

## 快速启用步骤

### 方法 1：通过 GitHub 网站设置（推荐）

1. **访问仓库设置**
   - 打开: https://github.com/yansissi88-cyber/ai-platform-website/settings/pages

2. **配置 GitHub Pages**
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/src/updates`
   - 点击 **Save**

3. **等待部署**
   - 约 1-2 分钟后，网站将上线
   - 访问地址: https://yansissi88-cyber.github.io/ai-platform-website/

### 方法 2：通过 GitHub CLI

```bash
# 启用 GitHub Pages
gh api --method POST repos/yansissi88-cyber/ai-platform-website/pages \
  -f source[branch]=main \
  -f source[path]=/src/updates
```

---

## 🔗 部署后的访问地址

启用后，您可以通过以下地址访问：

| 页面 | 链接 |
|------|------|
| **更新中心** | https://yansissi88-cyber.github.io/ai-platform-website/smart-update.html |
| **Releases** | https://yansissi88-cyber.github.io/ai-platform-website/ |

---

## ☁️ 备选方案：Cloudflare Pages

由于您的项目关联 `keyreply/kira-cloudflare`，也可以部署到 Cloudflare Pages：

1. 访问 https://dash.cloudflare.com/
2. 进入 Pages > Create a project
3. 连接 GitHub 仓库 `yansissi88-cyber/ai-platform-website`
4. 构建设置：
   - Build command: `echo "No build needed"`
   - Build output directory: `src/updates`

---

## 🚀 部署状态检查

启用后，检查部署状态：

```bash
# 查看 GitHub Pages 状态
gh api repos/yansissi88-cyber/ai-platform-website/pages
```

---

## ✅ 完成后的官网链接

**主站**: https://yansissi88-cyber.github.io/ai-platform-website/

**注意**: 启用后首次部署可能需要 1-2 分钟。
