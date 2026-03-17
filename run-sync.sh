#!/bin/bash
# 智能同步启动器

cd /Users/sissi/ai-platform-website

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "🚀 Kira 智能同步系统"
echo "===================="
echo ""
echo "请选择运行模式:"
echo ""
echo "1) 🔄 立即同步一次 (手动)"
echo "2) 👁️  启动监控服务 (后台自动)"
echo "3) ⏰ 设置定时任务 (每小时自动)"
echo "4) ☁️  配置 GitHub Actions (云端自动)"
echo "5) 📊 查看同步状态"
echo "6) ❌ 退出"
echo ""
read -p "请输入选项 [1-6]: " choice

case $choice in
    1)
        echo ""
        echo "🔄 执行智能同步..."
        node github-sync/scripts/smart-sync.js
        echo ""
        echo "✅ 同步完成！"
        echo "查看更新: http://localhost:3456/src/updates/smart-update.html"
        ;;
        
    2)
        echo ""
        echo "👁️  启动后台监控服务..."
        echo "按 Ctrl+C 停止"
        echo ""
        node github-sync/scripts/sync-watcher.js
        ;;
        
    3)
        echo ""
        echo "⏰ 设置定时任务..."
        ./setup-auto-sync.sh
        ;;
        
    4)
        echo ""
        echo "☁️  GitHub Actions 配置说明:"
        echo ""
        echo "1. 在 GitHub 仓库设置中添加 Secret:"
        echo "   名称: KIRA_CLOUDFLARE_TOKEN"
        echo "   值: 您的 GitHub Personal Access Token"
        echo ""
        echo "2. 推送后 GitHub Actions 将自动:"
        echo "   - 每小时检查 Releases"
        echo "   - 自动同步并截图"
        echo "   - 自动推送到网站"
        echo ""
        echo "工作流文件: .github/workflows/auto-sync.yml"
        ;;
        
    5)
        echo ""
        echo "📊 同步状态"
        echo "==========="
        echo ""
        
        # 检查上次同步时间
        if [ -f github-sync/releases/.last-sync ]; then
            LAST_SYNC=$(cat github-sync/releases/.last-sync)
            echo "🕐 上次同步: $LAST_SYNC"
        else
            echo "🕐 上次同步: 从未"
        fi
        
        # 检查最新版本
        if [ -f github-sync/releases/.latest-release ]; then
            LATEST=$(cat github-sync/releases/.latest-release)
            echo "📦 最新版本: $LATEST"
        fi
        
        # 统计截图数量
        SCREENSHOT_COUNT=$(ls -1 github-sync/screenshots/*.png 2>/dev/null | wc -l)
        echo "📸 截图数量: $SCREENSHOT_COUNT"
        
        # 统计 releases
        RELEASE_COUNT=$(ls -1 github-sync/releases/release-*.json 2>/dev/null | wc -l)
        echo "📝 Releases: $RELEASE_COUNT"
        
        echo ""
        echo "📁 截图文件:"
        ls -1 github-sync/screenshots/*.png 2>/dev/null | while read file; do
            echo "   - $(basename $file)"
        done
        ;;
        
    6)
        echo ""
        echo "👋 再见！"
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ 无效选项"
        exit 1
        ;;
esac
