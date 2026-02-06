#!/usr/bin/env node
/**
 * 网站截图脚本
 * 捕获 https://kira.keyreply.com/ 的截图用于更新网站
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  targetUrl: 'https://kira.keyreply.com/',
  outputDir: path.join(__dirname, '..', 'screenshots'),
  viewport: { width: 1920, height: 1080 },
  mobileViewport: { width: 375, height: 812 },
  tabletViewport: { width: 768, height: 1024 },
};

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 格式化日期
function formatDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 截图函数
async function captureScreenshot(page, name, fullPage = false) {
  const timestamp = formatDate();
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(CONFIG.outputDir, filename);
  
  await page.screenshot({ 
    path: filepath, 
    fullPage,
    type: 'png'
  });
  
  console.log(`✓ Captured: ${filename}`);
  return filepath;
}

// 主函数
async function main() {
  console.log('📸 Capturing screenshots of Kira website...');
  console.log(`   Target: ${CONFIG.targetUrl}`);
  
  ensureDir(CONFIG.outputDir);
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // 1. 桌面端首页截图
    console.log('\n🖥️  Desktop viewport...');
    const desktopContext = await browser.newContext({
      viewport: CONFIG.viewport,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const desktopPage = await desktopContext.newPage();
    
    await desktopPage.goto(CONFIG.targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000); // 等待动画完成
    
    // 首页 Hero 区域
    await captureScreenshot(desktopPage, 'desktop_hero');
    
    // 全页面截图
    await captureScreenshot(desktopPage, 'desktop_full', true);
    
    await desktopContext.close();
    
    // 2. 平板端截图
    console.log('\n📱 Tablet viewport...');
    const tabletContext = await browser.newContext({
      viewport: CONFIG.tabletViewport,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });
    const tabletPage = await tabletContext.newPage();
    
    await tabletPage.goto(CONFIG.targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000);
    await captureScreenshot(tabletPage, 'tablet_hero');
    await captureScreenshot(tabletPage, 'tablet_full', true);
    
    await tabletContext.close();
    
    // 3. 移动端截图
    console.log('\n📲 Mobile viewport...');
    const mobileContext = await browser.newContext({
      viewport: CONFIG.mobileViewport,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();
    
    await mobilePage.goto(CONFIG.targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000);
    await captureScreenshot(mobilePage, 'mobile_hero');
    await captureScreenshot(mobilePage, 'mobile_full', true);
    
    await mobileContext.close();
    
    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Output directory: ${CONFIG.outputDir}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// 特殊功能截图 - 用于捕获特定区域
async function captureFeature(page, selector, name) {
  const element = await page.$(selector);
  if (element) {
    const timestamp = formatDate();
    const filename = `feature_${name}_${timestamp}.png`;
    const filepath = path.join(CONFIG.outputDir, filename);
    
    await element.screenshot({ path: filepath });
    console.log(`✓ Captured feature: ${filename}`);
    return filepath;
  } else {
    console.log(`⚠️ Element not found: ${selector}`);
    return null;
  }
}

// 如果直接运行
if (require.main === module) {
  main();
}

module.exports = { captureScreenshot, captureFeature };
