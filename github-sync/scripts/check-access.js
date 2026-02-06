#!/usr/bin/env node
/**
 * 权限检查脚本
 * 验证 GitHub 访问权限和文件系统权限
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG = {
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  token: process.env.GITHUB_TOKEN,
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(type, message) {
  const color = colors[type] || colors.reset;
  console.log(`${color}${message}${colors.reset}`);
}

// 检查环境变量
function checkEnv() {
  log('blue', '\n📋 检查环境变量...');
  
  let allSet = true;
  
  if (!CONFIG.owner) {
    log('red', '❌ GITHUB_OWNER 未设置');
    allSet = false;
  } else {
    log('green', `✅ GITHUB_OWNER: ${CONFIG.owner}`);
  }
  
  if (!CONFIG.repo) {
    log('red', '❌ GITHUB_REPO 未设置');
    allSet = false;
  } else {
    log('green', `✅ GITHUB_REPO: ${CONFIG.repo}`);
  }
  
  if (!CONFIG.token) {
    log('yellow', '⚠️  GITHUB_TOKEN 未设置（公开仓库可跳过）');
  } else {
    const masked = CONFIG.token.substring(0, 4) + '...' + CONFIG.token.substring(CONFIG.token.length - 4);
    log('green', `✅ GITHUB_TOKEN: ${masked}`);
  }
  
  return allSet;
}

// 检查文件权限
function checkFilePermissions() {
  log('blue', '\n📁 检查文件权限...');
  
  const checks = [
    { path: '../screenshots', name: '截图目录', needWrite: false },
    { path: '../releases', name: 'Releases目录', needWrite: true },
    { path: '../../src/updates', name: '更新中心目录', needWrite: true },
  ];
  
  let allGood = true;
  
  for (const check of checks) {
    const fullPath = path.join(__dirname, check.path);
    try {
      fs.accessSync(fullPath, fs.constants.R_OK);
      if (check.needWrite) {
        fs.accessSync(fullPath, fs.constants.W_OK);
      }
      log('green', `✅ ${check.name}: 可访问`);
    } catch (err) {
      log('red', `❌ ${check.name}: ${err.message}`);
      allGood = false;
    }
  }
  
  // 检查截图文件
  const screenshotsDir = path.join(__dirname, '../screenshots');
  try {
    const files = fs.readdirSync(screenshotsDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));
    log('green', `✅ 找到 ${pngFiles.length} 个截图文件`);
  } catch (err) {
    log('red', `❌ 无法读取截图目录: ${err.message}`);
    allGood = false;
  }
  
  return allGood;
}

// 检查 GitHub API 访问
function checkGitHubAccess() {
  return new Promise((resolve) => {
    log('blue', '\n🌐 检查 GitHub API 访问...');
    
    if (!CONFIG.owner || !CONFIG.repo) {
      log('yellow', '⚠️  跳过 GitHub 检查（环境变量未设置）');
      resolve(false);
      return;
    }
    
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/releases`;
    const options = {
      headers: {
        'User-Agent': 'Website-Updater',
        'Accept': 'application/vnd.github.v3+json',
        ...(CONFIG.token && { 'Authorization': `token ${CONFIG.token}` })
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200) {
            log('green', `✅ GitHub API 访问成功（${result.length} 个 releases）`);
            resolve(true);
          } else if (res.statusCode === 404) {
            log('red', '❌ 仓库不存在或不可访问');
            resolve(false);
          } else if (res.statusCode === 403) {
            log('red', '❌ API 限制或权限不足');
            log('yellow', '💡 提示：设置 GITHUB_TOKEN 提高限制');
            resolve(false);
          } else {
            log('red', `❌ HTTP ${res.statusCode}: ${result.message}`);
            resolve(false);
          }
        } catch (e) {
          log('red', `❌ 解析响应失败: ${e.message}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      log('red', `❌ 网络错误: ${err.message}`);
      resolve(false);
    });
  });
}

// 主函数
async function main() {
  console.log('🔐 权限检查工具');
  console.log('================');
  
  const envOk = checkEnv();
  const filesOk = checkFilePermissions();
  const githubOk = await checkGitHubAccess();
  
  console.log('\n================');
  if (envOk && filesOk && githubOk) {
    log('green', '✅ 所有检查通过！权限已开放。');
    process.exit(0);
  } else if (envOk && filesOk && !githubOk) {
    log('yellow', '⚠️  文件权限 OK，但 GitHub 访问需要配置');
    log('blue', '💡 请阅读 ACCESS_SETUP.md 配置 GitHub Token');
    process.exit(1);
  } else {
    log('red', '❌ 部分检查失败，请修复上述问题');
    process.exit(1);
  }
}

main();
