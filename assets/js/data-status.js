/**
 * Data Status Monitor
 * Shows last sync time and data freshness
 */

class DataStatusMonitor {
  constructor() {
    this.dataFiles = [
      { name: 'timeline', url: 'data/timeline-data.json', label: 'Timeline' },
      { name: 'roadmap', url: 'data/roadmap-data.json', label: 'Roadmap' },
      { name: 'stories', url: 'data/user-stories.json', label: 'Stories' }
    ];
    this.init();
  }

  async init() {
    await this.checkDataStatus();
    this.renderStatusIndicator();
  }

  async checkDataStatus() {
    const statuses = await Promise.all(
      this.dataFiles.map(async file => {
        try {
          const response = await fetch(file.url, { method: 'HEAD' });
          const lastModified = response.headers.get('last-modified');
          
          // Also fetch to get content metadata
          const dataResponse = await fetch(file.url);
          const data = await dataResponse.json();
          
          return {
            ...file,
            lastModified: lastModified ? new Date(lastModified) : null,
            lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
            count: this.getItemCount(data, file.name),
            status: 'ok'
          };
        } catch (error) {
          return {
            ...file,
            status: 'error',
            error: error.message
          };
        }
      })
    );

    this.statuses = statuses;
    return statuses;
  }

  getItemCount(data, type) {
    switch (type) {
      case 'timeline':
        return data.events?.length || 0;
      case 'roadmap':
        return data.items?.length || 0;
      case 'stories':
        return data.stories?.length || 0;
      default:
        return 0;
    }
  }

  getLatestVersion() {
    // Try to get from timeline data
    const timeline = this.statuses?.find(s => s.name === 'timeline');
    if (timeline?.lastUpdated) {
      return timeline.lastUpdated;
    }
    return null;
  }

  formatTimeAgo(date) {
    if (!date) return 'Unknown';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  renderStatusIndicator() {
    // Find or create status container
    let container = document.getElementById('data-status-panel');
    
    if (!container) {
      // Add to footer or create floating panel
      container = document.createElement('div');
      container.id = 'data-status-panel';
      container.className = 'data-status-panel';
      document.body.appendChild(container);
    }

    const latestVersion = this.getLatestVersion();
    const overallStatus = this.statuses?.every(s => s.status === 'ok') ? 'ok' : 'error';

    container.innerHTML = `
      <div class="status-header">
        <span class="status-dot ${overallStatus}"></span>
        <span class="status-text">Data ${overallStatus === 'ok' ? 'Live' : 'Error'}</span>
        ${latestVersion ? `<span class="sync-time">Updated ${this.formatTimeAgo(latestVersion)}</span>` : ''}
      </div>
      <div class="status-details">
        ${this.statuses?.map(s => `
          <div class="status-item">
            <span class="item-name">${s.label}</span>
            <span class="item-count">${s.count || 0} items</span>
            <span class="item-time">${s.lastUpdated ? this.formatTimeAgo(s.lastUpdated) : 'N/A'}</span>
          </div>
        `).join('') || ''}
      </div>
    `;
  }
}

// Auto-initialize on dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('dashboard-page')) {
    new DataStatusMonitor();
  }
});

// Expose for manual use
window.DataStatusMonitor = DataStatusMonitor;
