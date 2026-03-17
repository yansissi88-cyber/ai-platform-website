# 开放权限配置指南

本指南说明如何开放 GitHub 访问权限，以便同步 Releases 数据。

## 1. GitHub Token 权限配置

### 创建 Personal Access Token

1. 登录 GitHub，点击右上角头像 → **Settings**
2. 左侧菜单选择 **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. 点击 **Generate new token (classic)**
4. 填写信息：
   - **Note**: `AI Platform Website Sync`
   - **Expiration**: 选择过期时间（建议 90 天或更久）
   - **Scopes**: 勾选 `repo`（完整仓库访问）

### 设置 Token 环境变量

```bash
# 临时设置（当前终端会话）
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 永久设置（添加到 ~/.zshrc 或 ~/.bash_profile）
echo 'export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx' >> ~/.zshrc
source ~/.zshrc
```

### 配置仓库信息

```bash
# 设置目标仓库
export GITHUB_OWNER=your-github-username    # 例如：KiraGPT
export GITHUB_REPO=your-repo-name           # 例如：ai-platform-website
```

## 2. GitHub 仓库公开设置

### 将仓库设为公开

1. 在 GitHub 上打开仓库页面
2. 点击 **Settings** → **General**
3. 找到 **Danger Zone** 区域
4. 点击 **Change visibility** → **Make public**
5. 确认仓库名称并点击确认

### 公开仓库的优势

- ✅ 无需 Token 即可访问 Releases
- ✅ 便于团队协作
- ✅ 支持 GitHub Pages 托管

## 3. 私有仓库访问（如需保持私有）

如果必须保持仓库私有：

1. 创建具有 `repo` 权限的 Token（如上）
2. 确保所有协作者都有自己的 Token
3. 切勿将 Token 提交到 Git！

## 4. 验证权限设置

```bash
# 测试 GitHub API 访问
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user

# 测试 Releases 访问
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/releases
```

## 5. 网站资源访问权限

### 本地开发

所有资源文件已设置权限：
```bash
chmod -R 755 github-sync/ src/
chmod 644 github-sync/screenshots/*.png
```

### 生产环境

如果使用静态服务器（如 Nginx），确保配置：

```nginx
location /github-sync/ {
    alias /path/to/ai-platform-website/github-sync/;
    autoindex on;
}

location /src/updates/ {
    alias /path/to/ai-platform-website/src/updates/;
    index index.html;
}
```

## 6. 快速启动脚本

创建 `.env` 文件（已添加到 .gitignore）：

```bash
# github-sync/.env
github-sync/.env
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

加载环境变量：

```bash
# 在脚本开头添加
require('dotenv').config({ path: '../.env' });
```

## 7. 权限检查清单

- [ ] GitHub Token 已创建且有 `repo` 权限
- [ ] 环境变量已正确设置
- [ ] 文件系统权限已开放 (755/644)
- [ ] 截图路径正确（以 `../../` 开头）
- [ ] 网站可以访问 `github-sync/` 目录
- [ ] Releases 同步脚本可以正常运行

## 故障排除

### 403 Forbidden
- Token 权限不足，检查 Scopes
- Token 已过期，重新生成

### 404 Not Found
- 仓库名称或所有者错误
- 仓库不存在或已删除

### 无法访问截图
- 检查文件权限 `ls -la github-sync/screenshots/`
- 检查路径是否正确
- 确认 web 服务器配置允许访问
