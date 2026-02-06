#!/bin/bash
# GitHub Token 配置脚本 - 用于访问私有仓库 keyreply/kira-cloudflare

echo "🔐 GitHub Token 配置"
echo "===================="
echo ""
echo "要访问私有仓库 keyreply/kira-cloudflare，需要配置 GitHub Token"
echo ""
echo "请按以下步骤操作："
echo ""
echo "1. 访问 https://github.com/settings/tokens"
echo "2. 点击 'Generate new token (classic)'"
echo "3. 填写信息："
echo "   - Note: Kira Cloudflare Sync"
echo "   - Expiration: 90 days"
echo "   - Scopes: 勾选 'repo' (完整仓库访问)"
echo "4. 生成后复制 Token"
echo ""
read -p "请输入 GitHub Token: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ Token 不能为空"
    exit 1
fi

# 测试 Token
echo ""
echo "🧪 测试 Token..."
RESPONSE=$(curl -s -H "Authorization: token $TOKEN" \
    https://api.github.com/repos/keyreply/kira-cloudflare/releases)

if echo "$RESPONSE" | grep -q "Not Found"; then
    echo "❌ 无法访问仓库，可能原因："
    echo "   - Token 没有 repo 权限"
    echo "   - 您不是 keyreply 组织成员"
    echo "   - 仓库名称不正确"
    exit 1
fi

if echo "$RESPONSE" | grep -q "Bad credentials"; then
    echo "❌ Token 无效"
    exit 1
fi

echo "✅ Token 有效！"
echo ""

# 保存到 .env
echo "GITHUB_OWNER=keyreply" > .env
echo "GITHUB_REPO=kira-cloudflare" >> .env
echo "GITHUB_TOKEN=$TOKEN" >> .env

echo "💾 已保存到 .env 文件"
echo ""
echo "🎉 配置完成！现在可以运行："
echo "   node github-sync/scripts/sync-releases.js"
echo ""
