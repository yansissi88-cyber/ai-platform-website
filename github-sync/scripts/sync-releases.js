#!/usr/bin/env node
/**
 * GitHub Releases 同步脚本
 * 从 GitHub 获取 Releases 内容并更新到网站
 * 
 * 私有仓库访问需要设置 GITHUB_TOKEN
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 加载 .env 文件
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

// 配置
const CONFIG = {
  // GitHub 仓库信息 - keyreply/kira-cloudflare (私有仓库)
  owner: process.env.GITHUB_OWNER || 'keyreply',
  repo: process.env.GITHUB_REPO || 'kira-cloudflare',
  
  // 输出路径
  outputDir: path.join(__dirname, '..', 'releases'),
  websiteUpdatesDir: path.join(__dirname, '..', '..', 'src', 'updates'),
};

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 获取 GitHub Releases
function fetchReleases() {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/releases`;
    const options = {
      headers: {
        'User-Agent': 'Website-Updater',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const releases = JSON.parse(data);
          if (releases.message) {
            reject(new Error(releases.message));
          } else {
            resolve(releases);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 保存 release 到文件
function saveRelease(release) {
  const filename = `release-${release.tag_name.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);
  
  const releaseData = {
    id: release.id,
    tag_name: release.tag_name,
    name: release.name,
    body: release.body,
    published_at: release.published_at,
    html_url: release.html_url,
    assets: release.assets.map(a => ({
      name: a.name,
      download_url: a.browser_download_url,
      size: a.size
    }))
  };
  
  fs.writeFileSync(filepath, JSON.stringify(releaseData, null, 2));
  console.log(`✓ Saved: ${filename}`);
  return releaseData;
}

// 生成网站更新内容
function generateWebsiteUpdates(releases) {
  ensureDir(CONFIG.websiteUpdatesDir);
  
  const updates = releases.map(r => ({
    version: r.tag_name,
    title: r.name,
    date: r.published_at,
    content: r.body,
    url: r.html_url
  }));
  
  const updatesFile = path.join(CONFIG.websiteUpdatesDir, 'releases.json');
  fs.writeFileSync(updatesFile, JSON.stringify({
    last_updated: new Date().toISOString(),
    releases: updates
  }, null, 2));
  
  console.log(`✓ Generated website updates: ${updatesFile}`);
}

// 主函数
async function main() {
  console.log('🔄 Syncing GitHub Releases...');
  console.log(`   Repository: ${CONFIG.owner}/${CONFIG.repo}`);
  
  ensureDir(CONFIG.outputDir);
  ensureDir(CONFIG.websiteUpdatesDir);
  
  try {
    const releases = await fetchReleases();
    console.log(`✓ Found ${releases.length} releases`);
    
    const releaseData = releases.map(saveRelease);
    generateWebsiteUpdates(releaseData);
    
    console.log('\n✅ Sync completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('   1. Set GITHUB_OWNER and GITHUB_REPO environment variables');
    console.log('   2. For private repos, set GITHUB_TOKEN');
    console.log('   3. Edit this script to update the default CONFIG values');
    process.exit(1);
  }
}

main();
