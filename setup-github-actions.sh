#!/bin/bash
# GitHub Actions 配置指南

clear
echo "☁️  GitHub Actions 自动同步配置"
echo "================================="
echo ""
echo "此方案将完全自动化同步流程："
echo "  • 每小时自动检查 keyreply/kira-cloudflare Releases"
echo "  • 自动分析新功能并截图"
echo "  • 自动提交更新到网站"
echo "  • 自动部署到 GitHub Pages"
echo ""
echo "================================="
echo ""

# 检查 gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ 需要安装 GitHub CLI"
    echo ""
    echo "安装方法:"
    echo "  macOS:   brew install gh"
    echo "  Linux:   sudo apt install gh"
    echo "  其他:    https://cli.github.com/"
    exit 1
fi

# 检查登录状态
if ! gh auth status &> /dev/null; then
    echo "❌ 请先登录 GitHub CLI"
    echo "   运行: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI 已安装并登录"
echo ""

# 读取 Token
TOKEN=$(cat .env 2>/dev/null | grep GITHUB_TOKEN | cut -d'=' -f2)

if [ -z "$TOKEN" ]; then
    echo "⚠️  未在 .env 文件中找到 GitHub Token"
    echo ""
    read -p "请输入您的 GitHub Personal Access Token: " TOKEN
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Token 不能为空"
        exit 1
    fi
else
    echo "📝 从 .env 文件读取到 Token"
    MASKED_TOKEN="${TOKEN:0:4}****${TOKEN: -4}"
    echo "   Token: $MASKED_TOKEN"
    echo ""
    read -p "是否使用该 Token? [Y/n]: " confirm
    if [[ $confirm == "n" || $confirm == "N" ]]; then
        read -p "请输入新的 GitHub Token: " TOKEN
    fi
fi

echo ""
echo "🔐 设置 GitHub Secret..."
echo ""

# 设置 Secret
REPO="yansissi88-cyber/ai-platform-website"

if gh secret set KIRA_CLOUDFLARE_TOKEN -b"$TOKEN" -R "$REPO" 2>/dev/null; then
    echo "✅ Secret 设置成功!"
else
    echo "❌ Secret 设置失败"
    echo ""
    echo "请手动设置:"
    echo "  1. 访问: https://github.com/$REPO/settings/secrets/actions"
    echo "  2. 点击 'New repository secret'"
    echo "  3. Name: KIRA_CLOUDFLARE_TOKEN"
    echo "  4. Value: 您的 GitHub Token"
    echo "  5. 点击 'Add secret'"
    exit 1
fi

echo ""
echo "🚀 启动 GitHub Actions..."
echo ""

# 推送 workflow 文件
if [ -f .github/workflows/auto-sync.yml ]; then
    git add .github/workflows/auto-sync.yml
    git commit -m "启用 GitHub Actions 自动同步" 2>/dev/null || true
    git push origin main
    echo "✅ Workflow 文件已推送"
fi

echo ""
echo "================================="
echo "✅ GitHub Actions 配置完成!"
echo "================================="
echo ""
echo "现在系统将自动:"
echo "  ⏰ 每小时检查一次 Releases"
echo "  📸 自动截图新功能"
echo "  📝 自动提交更新"
echo "  🌐 自动部署网站"
echo ""
echo "查看 Actions:"
echo "  https://github.com/$REPO/actions"
echo ""
echo "手动触发:"
echo "  gh workflow run auto-sync.yml -R $REPO"
echo ""
echo "查看日志:"
echo "  gh run list -R $REPO"
echo ""
