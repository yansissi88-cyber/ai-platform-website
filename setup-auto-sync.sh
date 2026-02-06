#!/bin/bash
# 设置自动同步定时任务

echo "🔄 设置智能同步自动运行"
echo "========================"
echo ""

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "检测到 macOS 系统"
    
    # 创建 plist 文件用于 launchd
    PLIST_PATH="$HOME/Library/LaunchAgents/com.kira.smart-sync.plist"
    
    cat > "$PLIST_PATH" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.kira.smart-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>cd /Users/sissi/ai-platform-website && export $(cat .env | grep -v '^#' | xargs) && /usr/local/bin/node github-sync/scripts/smart-sync.js >> logs/sync.log 2>&1</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>StandardOutPath</key>
    <string>/Users/sissi/ai-platform-website/logs/sync.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/sissi/ai-platform-website/logs/sync-error.log</string>
</dict>
</plist>
EOF
    
    # 创建日志目录
    mkdir -p /Users/sissi/ai-platform-website/logs
    
    # 加载定时任务
    launchctl load "$PLIST_PATH"
    
    echo "✅ 自动同步已设置！"
    echo "   频率: 每 1 小时检查一次"
    echo "   日志: logs/sync.log"
    echo ""
    echo "管理命令:"
    echo "   启动: launchctl start com.kira.smart-sync"
    echo "   停止: launchctl stop com.kira.smart-sync"
    echo "   卸载: launchctl unload $PLIST_PATH"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "检测到 Linux 系统"
    
    # 创建 cron 任务
    CRON_JOB="0 * * * * cd /Users/sissi/ai-platform-website && export \$(cat .env | grep -v '^#' | xargs) && node github-sync/scripts/smart-sync.js >> logs/sync.log 2>&1"
    
    # 添加到 crontab
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    
    echo "✅ 自动同步已设置！"
    echo "   频率: 每 1 小时检查一次"
    echo "   日志: logs/sync.log"
    echo ""
    echo "查看任务: crontab -l"
    
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    exit 1
fi

echo ""
echo "测试运行:"
echo "   node github-sync/scripts/smart-sync.js"
