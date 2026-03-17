# 🔐 私有仓库配置指南

## 目标仓库
- **Owner**: `keyreply`
- **Repo**: `kira-cloudflare` (私有)
- **用途**: 同步 Releases 作为网站更新来源

---

## 配置步骤

### 1. 获取 GitHub Token

1. 登录 GitHub 账号
2. 访问: https://github.com/settings/tokens
3. 点击 **"Generate new token (classic)"**
4. 配置 Token:
   - **Note**: `Kira Cloudflare Website Sync`
   - **Expiration**: 选择过期时间 (建议 90 days)
   - **Scopes**: 勾选 ☑️ `repo` (Full control of private repositories)
   
   ![Token Scopes](https://docs.github.com/assets/cb-60049/images/help/settings/token_scopes.png)

5. 点击 **Generate token**
6. **立即复制 Token** (页面关闭后无法再次查看)

### 2. 配置 Token

#### 方式 A: 使用配置脚本 (推荐)
```bash
cd /Users/sissi/ai-platform-website
./setup-github-token.sh
# 按提示粘贴 Token
```

#### 方式 B: 手动编辑 .env
```bash
# 编辑 .env 文件
vim .env

# 填入以下内容
GITHUB_OWNER=keyreply
GITHUB_REPO=kira-cloudflare
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx  # 你的 Token
```

#### 方式 C: 环境变量 (临时)
```bash
export GITHUB_OWNER=keyreply
export GITHUB_REPO=kira-cloudflare
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### 3. 验证配置

```bash
# 检查权限
node github-sync/scripts/check-access.js

# 预期输出:
# ✅ GITHUB_OWNER: keyreply
# ✅ GITHUB_REPO: kira-cloudflare
# ✅ GITHUB_TOKEN: ghp_...xxxx
# ✅ GitHub API 访问成功
```

### 4. 同步 Releases

```bash
# 同步私有仓库的 Releases
node github-sync/scripts/sync-releases.js

# 预期输出:
# 🔄 Syncing GitHub Releases...
#    Repository: keyreply/kira-cloudflare
# ✅ Found X releases
# ✅ Sync completed successfully!
```

---

## 安全注意事项

⚠️ **重要**
- `.env` 文件已添加到 `.gitignore`，不会提交到 Git
- 切勿将 Token 硬编码到代码中
- Token 具有私有仓库访问权限，请妥善保管
- 建议设置 Token 过期时间，定期轮换

---

## 故障排除

### 403 Forbidden / Bad credentials
```
原因: Token 无效或过期
解决: 重新生成 Token 并更新配置
```

### 404 Not Found
```
原因: 
- Token 没有 repo 权限
- 您不是 keyreply 组织成员
- 仓库不存在

解决: 
1. 确认 Token 勾选了 repo 权限
2. 联系 keyreply 管理员确认仓库访问权限
```

### 无法访问 keyreply 组织
```
原因: 需要加入 keyreply 组织
解决: 联系 keyreply 管理员邀请您加入组织
```

---

## 当前配置状态

```bash
# 运行检查
node github-sync/scripts/check-access.js
```

---

## 下一步

配置完成后，系统会自动：
1. ✅ 从 `keyreply/kira-cloudflare` 获取 Releases
2. ✅ 同步到网站更新中心
3. ✅ 保持与 kira.keyreply.com 截图的关联

请运行 `./setup-github-token.sh` 或手动编辑 `.env` 文件完成配置。
