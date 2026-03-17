#!/usr/bin/env node
/**
 * 统一数据同步脚本
 * 从 GitHub 获取数据并生成 timeline, roadmap, user-stories 的数据文件
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  owner: process.env.GITHUB_OWNER || 'keyreply',
  repo: process.env.GITHUB_REPO || 'kira-cloudflare',
  token: process.env.GITHUB_TOKEN,
  dataDir: path.join(__dirname, '..', 'data'),
  releasesDir: path.join(__dirname, '..', 'github-sync', 'releases')
};

// 功能分类映射
const CATEGORY_MAP = {
  'livechat': ['livechat', 'inbox', 'chat', 'contact center'],
  'voice': ['voice', 'call', 'phone', 'tts', 'sip', 'telnyx'],
  'campaign': ['campaign', 'script', 'optimizer', 'outbound'],
  'agent': ['agent', 'builder', 'skill', 'persona'],
  'platform': ['platform', 'mcp', 'integration', 'api', 'cli'],
  'analytics': ['analytics', 'dashboard', 'report', 'metrics'],
  'security': ['security', 'auth', 'sso', 'compliance'],
  'workflow': ['workflow', 'automation']
};

// 分类事件类型
function classifyEventType(release) {
  const body = (release.body || '').toLowerCase();
  
  if (body.includes('security') || body.includes('fix') || body.includes('bypass')) {
    return 'fix';
  }
  if (body.includes('improvement') || body.includes('enhance') || body.includes('optimize')) {
    return 'improvement';
  }
  if (body.includes('release') || body.includes('announcement')) {
    return 'announcement';
  }
  return 'feature';
}

// 识别功能分类
function classifyCategory(release) {
  const body = (release.body || '').toLowerCase();
  const title = (release.name || '').toLowerCase();
  const text = body + ' ' + title;
  
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(kw => text.includes(kw))) {
      return category;
    }
  }
  return 'platform';
}

// 提取亮点
function extractHighlights(release) {
  const body = release.body || '';
  const highlights = [];
  
  // 匹配 Markdown 列表项
  const listRegex = /^[-*]\s+(.+)$/gm;
  let match;
  while ((match = listRegex.exec(body)) !== null && highlights.length < 5) {
    const item = match[1].trim();
    if (item.length > 10 && item.length < 150) {
      highlights.push(item.replace(/[#*`]/g, ''));
    }
  }
  
  return highlights.slice(0, 5);
}

// GitHub API 请求
function fetchGitHubAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}${endpoint}`;
    const options = {
      headers: {
        'User-Agent': 'Kira-Website-Sync',
        'Accept': 'application/vnd.github.v3+json',
        ...(CONFIG.token && { 'Authorization': `token ${CONFIG.token}` })
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// 同步时间轴数据
async function syncTimeline() {
  console.log('📅 同步时间轴数据...');
  
  try {
    // 从 GitHub 获取 Releases
    const releases = await fetchGitHubAPI('/releases');
    
    const events = releases.map(release => ({
      id: `evt-${release.tag_name}`,
      date: release.published_at,
      version: release.tag_name,
      type: classifyEventType(release),
      category: classifyCategory(release),
      title: release.name || release.tag_name,
      description: release.body?.substring(0, 500) + '...' || '',
      highlights: extractHighlights(release),
      screenshot: null, // 可由其他脚本补充
      releaseUrl: release.html_url,
      tags: release.tag_name.startsWith('v0.12') ? ['AI', 'Livechat', 'Voice'] : 
            release.tag_name.startsWith('v0.11') ? ['Campaign', 'Voice'] :
            release.tag_name.startsWith('v0.10') ? ['Voice', 'AMD', 'SIP'] :
            release.tag_name.startsWith('v0.9') ? ['Omni-channel', 'Healthcare'] :
            release.tag_name.startsWith('v0.8') ? ['AI', 'Optimizer'] :
            release.tag_name.startsWith('v0.5') ? ['MCP', 'Integration'] :
            ['Platform']
    }));

    const timelineData = {
      lastUpdated: new Date().toISOString(),
      events: events
    };

    fs.writeFileSync(
      path.join(CONFIG.dataDir, 'timeline-data.json'),
      JSON.stringify(timelineData, null, 2)
    );

    console.log(`✅ 时间轴数据已更新 (${events.length} 个事件)`);
    return events;
  } catch (error) {
    console.error('❌ 时间轴同步失败:', error.message);
    return [];
  }
}

// 同步路线图数据
async function syncRoadmap() {
  console.log('🗺️  同步路线图数据...');
  
  try {
    // 并行获取 Issues, Milestones, Projects
    const [issues, milestones] = await Promise.all([
      fetchGitHubAPI('/issues?state=all&labels=roadmap&per_page=100'),
      fetchGitHubAPI('/milestones?state=all&per_page=100')
    ]);

    const roadmapItems = [];
    let idCounter = 1;

    // 处理 Issues
    if (Array.isArray(issues)) {
      issues.forEach(issue => {
        const labels = issue.labels?.map(l => l.name) || [];
        
        // 确定状态
        let status = 'planning';
        if (issue.state === 'closed') {
          status = 'ready';
        } else if (labels.includes('status/in-progress')) {
          status = 'in_progress';
        } else if (labels.includes('status/testing')) {
          status = 'testing';
        }

        // 确定优先级
        let priority = 'medium';
        if (labels.includes('priority/high')) priority = 'high';
        else if (labels.includes('priority/low')) priority = 'low';

        // 确定季度
        let quarter = 'Q2 2026';
        const quarterLabel = labels.find(l => l.startsWith('quarter/'));
        if (quarterLabel) {
          quarter = quarterLabel.replace('quarter/', '').replace('-', ' ');
        }

        // 确定分类
        let category = 'Platform';
        for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
          if (keywords.some(kw => issue.title.toLowerCase().includes(kw))) {
            category = cat.charAt(0).toUpperCase() + cat.slice(1);
            break;
          }
        }

        roadmapItems.push({
          id: `roadmap-${String(idCounter++).padStart(3, '0')}`,
          title: issue.title,
          description: issue.body?.substring(0, 200) || '',
          category,
          status,
          priority,
          quarter,
          progress: status === 'ready' ? 100 : status === 'testing' ? 90 : status === 'in_progress' ? 50 : 10,
          source: {
            type: 'issue',
            url: issue.html_url,
            number: issue.number
          },
          assignees: issue.assignees?.map(a => a.login) || [],
          labels,
          dependencies: [],
          targetDate: issue.milestone?.due_on?.split('T')[0] || null,
          userStory: null
        });
      });
    }

    // 处理 Milestones
    if (Array.isArray(milestones)) {
      milestones.forEach(milestone => {
        if (!roadmapItems.some(item => item.title === milestone.title)) {
          roadmapItems.push({
            id: `roadmap-${String(idCounter++).padStart(3, '0')}`,
            title: milestone.title,
            description: milestone.description || '',
            category: 'Platform',
            status: new Date(milestone.due_on) < new Date() ? 'ready' : 'in_progress',
            priority: 'high',
            quarter: 'Q2 2026',
            progress: milestone.closed_issues / (milestone.open_issues + milestone.closed_issues) * 100 || 0,
            source: {
              type: 'milestone',
              url: milestone.html_url,
              number: milestone.number
            },
            assignees: [],
            labels: ['roadmap', 'milestone'],
            dependencies: [],
            targetDate: milestone.due_on?.split('T')[0] || null,
            userStory: null
          });
        }
      });
    }

    const roadmapData = {
      lastUpdated: new Date().toISOString(),
      currentQuarter: 'Q1 2026',
      categories: [...new Set(roadmapItems.map(i => i.category))],
      items: roadmapItems
    };

    fs.writeFileSync(
      path.join(CONFIG.dataDir, 'roadmap-data.json'),
      JSON.stringify(roadmapData, null, 2)
    );

    console.log(`✅ 路线图数据已更新 (${roadmapItems.length} 个项目)`);
    return roadmapItems;
  } catch (error) {
    console.error('❌ 路线图同步失败:', error.message);
    return [];
  }
}

// 主函数
async function main() {
  console.log('🚀 开始同步 Kira 网站数据...\n');

  // 确保数据目录存在
  if (!fs.existsSync(CONFIG.dataDir)) {
    fs.mkdirSync(CONFIG.dataDir, { recursive: true });
  }

  // 并行执行同步
  await Promise.all([
    syncTimeline(),
    syncRoadmap()
  ]);

  console.log('\n✨ 所有数据同步完成！');
  console.log(`📁 数据文件位置: ${CONFIG.dataDir}`);
}

// 运行
main().catch(console.error);
