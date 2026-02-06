#!/bin/bash
# 启动网站服务器脚本

PORT=${1:-3456}

echo "🚀 启动 KeyReply Kira 网站服务器..."
echo "================================"
echo ""

# 检查是否安装了 npx
if ! command -v npx &> /dev/null; then
    echo "❌ 错误：需要 Node.js 和 npx"
    echo "💡 请安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "📂 网站根目录: $(pwd)"
echo "🌐 访问地址:"
echo "   - 主站:      http://localhost:$PORT/"
echo "   - 更新中心:  http://localhost:$PORT/src/updates/"
echo "   - 截图:      http://localhost:$PORT/github-sync/screenshots/"
echo ""
echo "⚙️  按 Ctrl+C 停止服务器"
echo "================================"
echo ""

# 使用 http-server（如果没有会提示安装）
if npx http-server --version &> /dev/null; then
    npx http-server . -p $PORT -c-1 --cors
else
    echo "首次运行，安装 http-server..."
    npm install -g http-server
    npx http-server . -p $PORT -c-1 --cors
fi
