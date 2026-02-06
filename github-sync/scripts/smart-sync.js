#!/usr/bin/env node
/**
 * 智能同步脚本
 * 当 kira-cloudflare 有 Release 更新时：
 * 1. 分析 Release 内容提取新功能
 * 2. 访问 kira.keyreply.com 找到对应功能界面
 * 3. 自动截图并更新网站
 */

const { chromium } = require('playwright');
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

// 功能映射配置 - Release 关键词对应 kira.keyreply.com 页面路由
const FEATURE_ROUTES = {
  // Campaign 相关
  'campaign': { path: '/campaigns', selector: '[data-testid="campaigns-page"], .campaigns-container, main' },
  'wizard': { path: '/campaigns', selector: '.wizard, [class*="wizard"], [class*="Wizard"]' },
  
  // Agent 相关
  'agent': { path: '/agent-builder', selector: '[data-testid="agent-builder"], .agent-builder, main' },
  'agent builder': { path: '/agent-builder', selector: '.agent-builder' },
  'skill': { path: '/agent-builder', selector: '[class*="skill"], [class*="Skill"]' },
  
  // Contact 相关
  'contact': { path: '/contacts', selector: '[data-testid="contacts"], .contacts-page, main' },
  'disc': { path: '/contacts', selector: '[class*="disc"], [class*="DISC"]' },
  
  // MCP 相关
  'mcp': { path: '/mcp-store', selector: '[data-testid="mcp-store"], .mcp-store, main' },
  'mcp store': { path: '/mcp-store', selector: '.mcp-store' },
  
  // Voice 相关
  'voice': { path: '/testing', selector: '[data-testid="testing"], .testing-page, main' },
  'template': { path: '/templates', selector: '[data-testid="templates"], .templates-page' },
  
  // Workflow 相关
  'workflow': { path: '/workflows', selector: '[data-testid="workflows"], .workflows-page, main' },
  
  // Inbox 相关
  'inbox': { path: '/inbox', selector: '[data-testid="inbox"], .inbox-page, main' },
  
  // Knowledge 相关
  'knowledge': { path: '/knowledge-base', selector: '[data-testid="knowledge"], .knowledge-page, main' },
  
  // Settings 相关
  'setting': { path: '/settings', selector: '[data-testid="settings"], .settings-page, main' },
  
  // Synapse 相关
  'synapse': { path: '/synapse', selector: '[data-testid="synapse"], .synapse-page, main' },
  
  // Dashboard 相关
  'dashboard': { path: '/dashboard', selector: '[data-testid="dashboard"], .dashboard-page, main' },
  
  // Call Script 相关 (v0.8.0)
  'call script': { path: '/campaigns', selector: '[class*="script"], [class*="Script"]' },
  'optimizer': { path: '/campaigns', selector: '[class*="optimize"], [class*="Optimize"]' },
  'a/b test': { path: '/campaigns', selector: '[class*="experiment"], [class*="test"]' },
  'bandit': { path: '/campaigns', selector: '[class*="bandit"], [class*="Bandit"]' },
  'canary': { path: '/campaigns', selector: '[class*="canary"], [class*="Canary"]' },
};

const CONFIG = {
  targetUrl: 'https://kira.keyreply.com',
  owner: process.env.GITHUB_OWNER || 'keyreply',
  repo: process.env.GITHUB_REPO || 'kira-cloudflare',
  token: process.env.GITHUB_TOKEN,
  outputDir: path.join(__dirname, '..', 'screenshots'),
  releasesDir: path.join(__dirname, '..', 'releases'),
  websiteUpdatesDir: path.join(__dirname, '..', '..', 'src', 'updates'),
};

// 获取 GitHub Releases
function fetchReleases() {
  return new Promise((resolve, reject) => {
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
          const releases = JSON.parse(data);
          if (releases.message) reject(new Error(releases.message));
          else resolve(releases);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 分析 Release 内容提取功能关键词
function extractFeatures(release) {
  const features = [];
  const text = `${release.name} ${release.body}`.toLowerCase();
  
  for (const [keyword, route] of Object.entries(FEATURE_ROUTES)) {
    if (text.includes(keyword.toLowerCase())) {
      features.push({
        keyword,
        path: route.path,
        selector: route.selector,
        release: release.tag_name
      });
    }
  }
  
  // 去重
  const unique = [];
  const seen = new Set();
  for (const f of features) {
    if (!seen.has(f.path)) {
      seen.add(f.path);
      unique.push(f);
    }
  }
  
  return unique;
}

// 智能截图
async function captureFeatureScreenshots(features) {
  if (features.length === 0) {
    console.log('⚠️  未检测到新功能，执行默认截图');
    return captureDefaultScreenshots();
  }
  
  console.log(`🎯 检测到 ${features.length} 个新功能需要截图`);
  
  const browser = await chromium.launch({ headless: true });
  const screenshots = [];
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();
    
    // 访问主页并等待加载
    console.log('🌐 访问 kira.keyreply.com...');
    await page.goto(CONFIG.targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    for (const feature of features) {
      try {
        console.log(`📸 截图: ${feature.keyword} (${feature.path})`);
        
        // 尝试点击导航到对应页面
        const navSelector = `a[href*="${feature.path}"], nav a:has-text("${feature.keyword}"), [class*="nav"] a:has-text("${feature.keyword}")`;
        try {
          await page.click(navSelector, { timeout: 5000 });
          await page.waitForTimeout(2000);
        } catch (e) {
          // 直接访问 URL
          await page.goto(`${CONFIG.targetUrl}${feature.path}`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(2000);
        }
        
        // 截图
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `feature_${feature.keyword.replace(/\s+/g, '_')}_${feature.release}_${timestamp}.png`;
        const filepath = path.join(CONFIG.outputDir, filename);
        
        // 尝试截取特定元素，失败则截全页
        try {
          const element = await page.$(feature.selector);
          if (element) {
            await element.screenshot({ path: filepath });
          } else {
            await page.screenshot({ path: filepath, fullPage: true });
          }
        } catch (e) {
          await page.screenshot({ path: filepath, fullPage: true });
        }
        
        screenshots.push({
          feature: feature.keyword,
          release: feature.release,
          path: filepath,
          filename
        });
        
        console.log(`✅ 已保存: ${filename}`);
        
      } catch (error) {
        console.error(`❌ 截图失败 ${feature.keyword}:`, error.message);
      }
    }
    
    await context.close();
    
  } finally {
    await browser.close();
  }
  
  return screenshots;
}

// 默认截图（首页等）
async function captureDefaultScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const screenshots = [];
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    
    await page.goto(CONFIG.targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `auto_update_${timestamp}.png`;
    const filepath = path.join(CONFIG.outputDir, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    screenshots.push({ filename, path: filepath });
    
    await context.close();
  } finally {
    await browser.close();
  }
  
  return screenshots;
}

// 更新网站数据
function updateWebsite(releases, newScreenshots) {
  // 更新 releases.json
  const releasesData = {
    last_updated: new Date().toISOString(),
    releases: releases.map(r => ({
      version: r.tag_name,
      title: r.name,
      date: r.published_at,
      content: r.body,
      url: r.html_url
    }))
  };
  
  fs.writeFileSync(
    path.join(CONFIG.websiteUpdatesDir, 'releases.json'),
    JSON.stringify(releasesData, null, 2)
  );
  
  // 更新功能截图映射
  const screenshotsMap = {
    last_updated: new Date().toISOString(),
    screenshots: newScreenshots.map(s => ({
      feature: s.feature || 'default',
      release: s.release || 'latest',
      path: s.path.replace(path.join(__dirname, '../..'), ''),
      filename: s.filename
    }))
  };
  
  fs.writeFileSync(
    path.join(CONFIG.websiteUpdatesDir, 'feature-screenshots.json'),
    JSON.stringify(screenshotsMap, null, 2)
  );
  
  console.log('✅ 网站数据已更新');
}

// 保存 release 数据
function saveRelease(release) {
  const filename = `release-${release.tag_name.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`;
  const filepath = path.join(CONFIG.releasesDir, filename);
  
  const releaseData = {
    id: release.id,
    tag_name: release.tag_name,
    name: release.name,
    body: release.body,
    published_at: release.published_at,
    html_url: release.html_url,
    features: extractFeatures(release)
  };
  
  fs.writeFileSync(filepath, JSON.stringify(releaseData, null, 2));
  return releaseData;
}

// 检查是否有新 releases
function checkForNewReleases(releases) {
  const lastSyncFile = path.join(CONFIG.releasesDir, '.last-sync');
  let lastSync = '1970-01-01';
  
  if (fs.existsSync(lastSyncFile)) {
    lastSync = fs.readFileSync(lastSyncFile, 'utf-8').trim();
  }
  
  const newReleases = releases.filter(r => {
    const releaseDate = new Date(r.published_at);
    const syncDate = new Date(lastSync);
    return releaseDate > syncDate;
  });
  
  return {
    newReleases,
    hasNew: newReleases.length > 0
  };
}

// 主函数
async function main() {
  console.log('🚀 智能同步系统启动');
  console.log('====================');
  console.log(`📦 监控仓库: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`🌐 截图来源: ${CONFIG.targetUrl}`);
  console.log('');
  
  // 确保目录存在
  [CONFIG.outputDir, CONFIG.releasesDir, CONFIG.websiteUpdatesDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
  
  try {
    // 1. 获取 Releases
    console.log('📡 获取 GitHub Releases...');
    const releases = await fetchReleases();
    console.log(`✅ 找到 ${releases.length} 个 releases`);
    
    // 2. 检查是否有新 releases
    const { newReleases, hasNew } = checkForNewReleases(releases);
    
    if (!hasNew) {
      console.log('ℹ️  没有新的 releases，执行常规同步');
    } else {
      console.log(`🎉 发现 ${newReleases.length} 个新 releases!`);
    }
    
    // 3. 分析新功能并截图
    const allScreenshots = [];
    const releasesToProcess = hasNew ? newReleases : releases.slice(0, 1);
    
    for (const release of releasesToProcess) {
      console.log(`\n📋 分析 Release: ${release.tag_name}`);
      
      // 保存 release 数据
      const releaseData = saveRelease(release);
      
      // 提取功能并截图
      if (releaseData.features.length > 0) {
        console.log(`🔍 检测到功能: ${releaseData.features.map(f => f.keyword).join(', ')}`);
        const screenshots = await captureFeatureScreenshots(releaseData.features);
        allScreenshots.push(...screenshots);
      }
    }
    
    // 4. 更新网站
    updateWebsite(releases, allScreenshots);
    
    // 5. 记录同步时间
    fs.writeFileSync(path.join(CONFIG.releasesDir, '.last-sync'), new Date().toISOString());
    
    console.log('\n✅ 同步完成!');
    console.log(`📸 新增截图: ${allScreenshots.length} 张`);
    
  } catch (error) {
    console.error('\n❌ 同步失败:', error.message);
    process.exit(1);
  }
}

// 运行
main();
