/**
 * Dashboard Module
 * Internal team dashboard with overview of all product data
 */

class Dashboard {
  constructor() {
    this.data = {
      timeline: null,
      roadmap: null,
      stories: null
    };
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Dashboard...');
    await this.loadData();
    this.renderStats();
    this.renderSyncInfo();
    this.renderRecentUpdates();
    this.renderUpcomingFeatures();
    this.updateWelcomeMessage();
  }

  async loadData() {
    try {
      const [timeline, roadmap, stories] = await Promise.all([
        fetch('data/timeline-data.json').then(r => r.json()).catch(() => ({ events: [] })),
        fetch('data/roadmap-data.json').then(r => r.json()).catch(() => ({ items: [] })),
        fetch('data/user-stories.json').then(r => r.json()).catch(() => ({ stories: [] }))
      ]);

      this.data.timeline = timeline;
      this.data.roadmap = roadmap;
      this.data.stories = stories;

      console.log('✅ Dashboard data loaded:', {
        releases: timeline.events?.length || 0,
        roadmap: roadmap.items?.length || 0,
        stories: stories.stories?.length || 0
      });
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
    }
  }

  renderStats() {
    // Latest Release
    const latestRelease = this.data.timeline?.events?.[0];
    if (latestRelease) {
      const versionEl = document.getElementById('latest-version');
      const dateEl = document.getElementById('release-date');
      if (versionEl) versionEl.textContent = latestRelease.version;
      if (dateEl) {
        const date = new Date(latestRelease.date);
        dateEl.textContent = `Released ${this.formatTimeAgo(date)}`;
      }
    }

    // In Progress Count
    const inProgress = this.data.roadmap?.items?.filter(i => i.status === 'in_progress') || [];
    const progressEl = document.getElementById('in-progress-count');
    if (progressEl) progressEl.textContent = inProgress.length;

    // This Quarter
    const currentQuarter = this.getCurrentQuarter();
    const quarterItems = this.data.roadmap?.items?.filter(i => 
      i.quarter === currentQuarter
    ) || [];
    const quarterEl = document.getElementById('quarter-target');
    if (quarterEl) quarterEl.textContent = quarterItems.length;

    // Stories Count
    const storiesCount = this.data.stories?.stories?.length || 0;
    const storiesEl = document.getElementById('stories-count');
    if (storiesEl) storiesEl.textContent = storiesCount;
  }

  renderRecentUpdates() {
    const container = document.getElementById('recent-updates');
    if (!container) return;

    const updates = [];

    // 添加最近的 releases
    (this.data.timeline?.events || []).slice(0, 3).forEach(e => {
      updates.push({
        type: 'release',
        title: e.title,
        version: e.version,
        date: new Date(e.date),
        url: `timeline.html#${e.id}`,
        tags: e.tags?.slice(0, 2) || []
      });
    });

    // 添加最近的 roadmap 更新
    (this.data.roadmap?.items || [])
      .filter(i => i.status === 'ready' || i.status === 'testing')
      .slice(0, 2)
      .forEach(i => {
        updates.push({
          type: 'roadmap',
          title: i.title,
          status: i.status,
          quarter: i.quarter,
          date: i.targetDate ? new Date(i.targetDate) : new Date(),
          url: `roadmap.html#${i.id}`
        });
      });

    // 按日期排序
    updates.sort((a, b) => b.date - a.date);

    container.innerHTML = updates.map(u => `
      <a href="${u.url}" class="update-item" data-type="${u.type}">
        <div class="update-icon">${this.getIcon(u.type)}</div>
        <div class="update-content">
          <div class="update-title">${u.title}</div>
          <div class="update-meta">
            ${u.version ? `<span>${u.version}</span>` : ''}
            ${u.status ? `<span>${u.status}</span>` : ''}
            ${u.quarter ? `<span>${u.quarter}</span>` : ''}
            ${u.tags?.map(t => `<span>${t}</span>`).join('') || ''}
          </div>
        </div>
        <div class="update-date">${this.formatTimeAgo(u.date)}</div>
      </a>
    `).join('') || '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">No recent updates</p>';
  }

  renderUpcomingFeatures() {
    const container = document.getElementById('upcoming-features');
    if (!container) return;

    const upcoming = (this.data.roadmap?.items || [])
      .filter(i => i.status === 'in_progress' || i.status === 'planning')
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 5);

    container.innerHTML = upcoming.map(f => `
      <a href="roadmap.html#${f.id}" class="feature-item">
        <div class="feature-progress" style="--progress: ${f.progress || 0}%">
          <span>${f.progress || 0}%</span>
        </div>
        <div class="feature-content">
          <div class="feature-title">${f.title}</div>
          <div class="feature-meta">
            ${f.quarter} • ${f.status} • ${f.category}
          </div>
        </div>
      </a>
    `).join('') || '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">No upcoming features</p>';
  }

  updateWelcomeMessage() {
    const timeEl = document.querySelector('.welcome-time');
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  getCurrentQuarter() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  getIcon(type) {
    const icons = {
      release: '📦',
      roadmap: '🗺️',
      story: '⭐'
    };
    return icons[type] || '📄';
  }

  renderSyncInfo() {
    // 获取最新版本信息
    const latestRelease = this.data.timeline?.events?.[0];
    const lastUpdated = this.data.timeline?.lastUpdated;
    
    const versionEl = document.getElementById('sync-version');
    const timeEl = document.getElementById('sync-time');
    
    if (versionEl && latestRelease) {
      versionEl.textContent = latestRelease.version;
    }
    
    if (timeEl && lastUpdated) {
      const syncDate = new Date(lastUpdated);
      timeEl.textContent = `Last synced: ${this.formatTimeAgo(syncDate)} (${syncDate.toLocaleString()})`;
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});
