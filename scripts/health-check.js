#!/usr/bin/env node
/**
 * Health Check Script
 * Monitors website availability and data freshness
 */

const https = require('https');

const CONFIG = {
  baseUrl: 'yansissi88-cyber.github.io',
  paths: [
    '/ai-platform-website/dashboard.html',
    '/ai-platform-website/timeline.html',
    '/ai-platform-website/roadmap.html',
    '/ai-platform-website/user-stories.html',
    '/ai-platform-website/data/timeline-data.json',
    '/ai-platform-website/data/roadmap-data.json'
  ]
};

function checkUrl(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: CONFIG.baseUrl,
      path: path,
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      resolve({
        path,
        status: res.statusCode,
        ok: res.statusCode === 200,
        lastModified: res.headers['last-modified']
      });
    });

    req.on('error', (err) => {
      resolve({
        path,
        status: 'ERROR',
        ok: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        path,
        status: 'TIMEOUT',
        ok: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function checkDataFreshness() {
  try {
    const data = await new Promise((resolve, reject) => {
      https.get(`https://${CONFIG.baseUrl}/ai-platform-website/data/timeline-data.json`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    const latestVersion = data.events?.[0]?.version || 'Unknown';
    const lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : null;
    const age = lastUpdated ? Date.now() - lastUpdated.getTime() : null;
    const hoursOld = age ? Math.floor(age / (1000 * 60 * 60)) : null;

    return {
      latestVersion,
      lastUpdated: lastUpdated?.toISOString() || 'Unknown',
      hoursOld,
      isStale: hoursOld > 1 // Consider stale if older than 1 hour
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 Kira Portal Health Check\n');
  console.log('Checking URLs...\n');

  const results = await Promise.all(CONFIG.paths.map(checkUrl));
  
  let allOk = true;
  results.forEach(result => {
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${result.path}`);
    console.log(`   Status: ${result.status}`);
    if (result.lastModified) {
      console.log(`   Last Modified: ${result.lastModified}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log();
    if (!result.ok) allOk = false;
  });

  console.log('\n📊 Data Freshness Check\n');
  const freshness = await checkDataFreshness();
  
  if (freshness.error) {
    console.log(`❌ Failed to check data: ${freshness.error}`);
    allOk = false;
  } else {
    console.log(`✅ Latest Version: ${freshness.latestVersion}`);
    console.log(`📅 Last Updated: ${freshness.lastUpdated}`);
    console.log(`⏰ Age: ${freshness.hoursOld} hours`);
    
    if (freshness.isStale) {
      console.log(`⚠️  WARNING: Data is stale (older than 1 hour)`);
      allOk = false;
    } else {
      console.log(`✅ Data is fresh`);
    }
  }

  console.log('\n─────────────────────────────────');
  if (allOk) {
    console.log('✅ All checks passed!');
    process.exit(0);
  } else {
    console.log('❌ Some checks failed!');
    process.exit(1);
  }
}

main().catch(console.error);
