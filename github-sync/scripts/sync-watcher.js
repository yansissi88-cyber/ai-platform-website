#!/usr/bin/env node
/**
 * 后台监控服务
 * 持续监控 GitHub Releases，有新内容时自动同步
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// 加载 .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

const CONFIG = {
  owner: process.env.GITHUB_OWNER || 'keyreply',
  repo: process.env.GITHUB_REPO || 'kira-cloudflare',
  token: process.env.GITHUB_TOKEN,
  checkInterval: 60 * 60 * 1000, // 默认 1 小时检查一次
  releasesFile: path.join(__dirname, '..', 'releases', '.latest-release'),
};

// 获取最新 Release
function fetchLatestRelease() {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/releases/latest`;
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
          const release = JSON.parse(data);
          if (release.message) reject(new Error(release.message));
          else resolve(release);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 读取上次检查的版本
function getLastCheckedVersion() {
  try {
    if (fs.existsSync(CONFIG.releasesFile)) {
      return fs.readFileSync(CONFIG.releasesFile, 'utf-8').trim();
    }
  } catch (e) {
    console.log('No previous check found');
  }
  return null;
}

// 保存检查的版本
function saveCheckedVersion(version) {
  fs.writeFileSync(CONFIG.releasesFile, version);
}

// 运行同步脚本
function runSync() {
  return new Promise((resolve, reject) => {
    console.log('🔄 运行智能同步脚本...');
    
    const scriptPath = path.join(__dirname, 'smart-sync.js');
    const child = exec(`node "${scriptPath}"`, {
      cwd: path.join(__dirname, '..', '..'),
      env: process.env
    }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 同步失败:', error);
        reject(error);
      } else {
        console.log('✅ 同步完成');
        console.log(stdout);
        resolve();
      }
    });
  });
}

// 检查更新
async function checkUpdate() {
  const now = new Date().toLocaleString('zh-CN');
  console.log(`\n[${now}] 🔍 检查更新...`);
  
  try {
    const latestRelease = await fetchLatestRelease();
    const currentVersion = latestRelease.tag_name;
    const lastChecked = getLastCheckedVersion();
    
    console.log(`   最新版本: ${currentVersion}`);
    console.log(`   上次检查: ${lastChecked || '无'}`);
    
    if (lastChecked !== currentVersion) {
      console.log(`🎉 发现新版本: ${currentVersion}`);
      
      // 运行同步
      await runSync();
      
      // 保存版本
      saveCheckedVersion(currentVersion);
      
      console.log(`✅ 已更新到 ${currentVersion}`);
      
      // 可选：发送通知
      // sendNotification(`Kira 网站已更新: ${currentVersion}`);
      
    } else {
      console.log('✓ 已是最新版本');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  }
}

// 主循环
async function startWatcher() {
  console.log('👁️  Kira 网站同步监控服务');
  console.log('========================');
  console.log(`监控仓库: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`检查间隔: ${CONFIG.checkInterval / 1000 / 60} 分钟`);
  console.log('按 Ctrl+C 停止\n');
  
  // 立即检查一次
  await checkUpdate();
  
  // 定时检查
  setInterval(checkUpdate, CONFIG.checkInterval);
}

// 启动
startWatcher();

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n👋 监控服务已停止');
  process.exit(0);
});
