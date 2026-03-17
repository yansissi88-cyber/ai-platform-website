/**
 * Global Search Module
 * Unified search across all content
 */

class GlobalSearch {
  constructor() {
    this.index = null;
    this.modal = null;
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.buildIndex();
    this.createModal();
    this.bindEvents();
    console.log('🔍 Global Search initialized');
  }

  async buildIndex() {
    try {
      const [timeline, roadmap, stories] = await Promise.all([
        fetch('data/timeline-data.json').then(r => r.json()).catch(() => ({ events: [] })),
        fetch('data/roadmap-data.json').then(r => r.json()).catch(() => ({ items: [] })),
        fetch('data/user-stories.json').then(r => r.json()).catch(() => ({ stories: [] }))
      ]);

      this.index = [
        ...(timeline.events || []).map(e => ({
          type: 'release',
          id: e.id,
          title: e.title,
          version: e.version,
          description: e.description || e.valueProposition || '',
          url: `timeline.html#${e.id}`,
          externalUrl: e.releaseUrl,
          tags: e.tags || [],
          date: e.date,
          category: e.category
        })),
        ...(roadmap.items || []).map(i => ({
          type: 'roadmap',
          id: i.id,
          title: i.title,
          description: i.description || '',
          status: i.status,
          category: i.category,
          quarter: i.quarter,
          progress: i.progress,
          url: `roadmap.html#${i.id}`,
          externalUrl: i.source?.url
        })),
        ...(stories.stories || []).map(s => ({
          type: 'story',
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          industry: s.industry,
          company: s.company?.name,
          feature: s.feature,
          url: `user-stories.html#${s.id}`
        }))
      ];

      console.log(`✅ Search index built with ${this.index.length} items`);
    } catch (error) {
      console.error('❌ Failed to build search index:', error);
      this.index = [];
    }
  }

  search(query) {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    let results = this.index.filter(item => {
      // 类别过滤
      if (this.currentFilter !== 'all' && item.type !== this.currentFilter) {
        return false;
      }
      
      // 搜索匹配
      const searchable = [
        item.title,
        item.description,
        item.subtitle,
        item.company,
        item.feature,
        item.version,
        ...(item.tags || [])
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchable.includes(q);
    });

    // 排序：标题匹配优先
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(q);
      const bTitleMatch = b.title.toLowerCase().includes(q);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    return results.slice(0, 15);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
      <div class="search-overlay"></div>
      <div class="search-container">
        <div class="search-input-wrapper">
          <input type="text" placeholder="Search releases, roadmap, stories..." autocomplete="off">
          <kbd>${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+K</kbd>
        </div>
        <div class="search-categories">
          <button class="category-filter active" data-filter="all">All</button>
          <button class="category-filter" data-filter="release">📦 Releases</button>
          <button class="category-filter" data-filter="roadmap">🗺️ Roadmap</button>
          <button class="category-filter" data-filter="story">⭐ Stories</button>
        </div>
        <div class="search-results"></div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;

    // 添加到导航栏
    this.addSearchButton();
  }

  addSearchButton() {
    const nav = document.querySelector('.nav-container');
    if (!nav) return;

    // 检查是否已存在
    if (nav.querySelector('.search-trigger')) return;

    const searchBtn = document.createElement('button');
    searchBtn.className = 'search-trigger';
    searchBtn.innerHTML = '🔍';
    searchBtn.title = 'Search (Cmd+K)';
    searchBtn.onclick = () => this.open();
    
    // 插入到导航链接后面
    const navLinks = nav.querySelector('.nav-links');
    if (navLinks) {
      nav.insertBefore(searchBtn, navLinks.nextSibling);
    } else {
      nav.appendChild(searchBtn);
    }
  }

  bindEvents() {
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
      // ESC 关闭
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
      // / 键打开搜索
      if (e.key === '/' && !this.isInputFocused()) {
        e.preventDefault();
        this.open();
      }
    });

    // 输入搜索
    const input = this.modal.querySelector('input');
    input.addEventListener('input', (e) => {
      const results = this.search(e.target.value);
      this.renderResults(results);
    });

    // 点击遮罩关闭
    this.modal.querySelector('.search-overlay').addEventListener('click', () => {
      this.close();
    });

    // 类别过滤
    const categoryBtns = this.modal.querySelectorAll('.category-filter');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        
        // 重新搜索
        const input = this.modal.querySelector('input');
        if (input.value) {
          const results = this.search(input.value);
          this.renderResults(results);
        }
      });
    });

    // 键盘导航
    input.addEventListener('keydown', (e) => {
      const results = this.modal.querySelectorAll('.search-result');
      const active = this.modal.querySelector('.search-result.active');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!active) {
          results[0]?.classList.add('active');
        } else {
          active.classList.remove('active');
          const next = active.nextElementSibling;
          if (next && next.classList.contains('search-result')) {
            next.classList.add('active');
          } else {
            results[0]?.classList.add('active');
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (active) {
          active.classList.remove('active');
          const prev = active.previousElementSibling;
          if (prev && prev.classList.contains('search-result')) {
            prev.classList.add('active');
          } else {
            results[results.length - 1]?.classList.add('active');
          }
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (active) {
          active.click();
        } else if (results[0]) {
          results[0].click();
        }
      }
    });
  }

  isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
  }

  renderResults(results) {
    const container = this.modal.querySelector('.search-results');
    
    if (!results.length) {
      container.innerHTML = `
        <div class="no-results">
          <p>No results found</p>
          <p style="font-size: 0.85rem; margin-top: 8px;">Try different keywords or check spelling</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map((r, index) => `
      <a href="${r.url}" 
         class="search-result ${index === 0 ? 'active' : ''}" 
         data-type="${r.type}"
         onclick="globalSearch.handleResultClick(event, '${r.type}', '${r.externalUrl || ''}')">
        <div class="result-icon">${this.getIcon(r.type)}</div>
        <div class="result-content">
          <div class="result-title">${this.highlightMatch(r.title)}</div>
          <div class="result-meta">
            ${r.version ? `<span class="badge">${r.version}</span>` : ''}
            ${r.status ? `<span class="badge">${r.status}</span>` : ''}
            ${r.industry ? `<span class="badge">${r.industry}</span>` : ''}
            ${r.quarter ? `<span class="badge">${r.quarter}</span>` : ''}
            ${r.category ? `<span class="badge">${r.category}</span>` : ''}
          </div>
          ${r.description ? `<div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.description.substring(0, 80)}...</div>` : ''}
        </div>
      </a>
    `).join('');
  }

  highlightMatch(text) {
    const input = this.modal.querySelector('input');
    const query = input?.value?.trim();
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(59, 130, 246, 0.3); color: #fff; padding: 0 2px; border-radius: 2px;">$1</mark>');
  }

  handleResultClick(e, type, externalUrl) {
    // 如果是 release 类型且有外部链接，询问用户
    if (type === 'release' && externalUrl) {
      const openExternal = confirm('Open GitHub release page?\n\nClick OK for GitHub, Cancel for local timeline.');
      if (openExternal) {
        e.preventDefault();
        window.open(externalUrl, '_blank');
      }
    }
    this.close();
  }

  getIcon(type) {
    const icons = {
      release: '📦',
      roadmap: '🗺️',
      story: '⭐'
    };
    return icons[type] || '📄';
  }

  toggle() {
    if (this.modal.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.modal.classList.add('active');
    const input = this.modal.querySelector('input');
    input.value = '';
    input.focus();
    this.renderResults([]);
  }

  close() {
    this.modal.classList.remove('active');
    // 清除输入
    const input = this.modal.querySelector('input');
    if (input) input.value = '';
  }
}

// 初始化
let globalSearch;
document.addEventListener('DOMContentLoaded', () => {
  globalSearch = new GlobalSearch();
});

// 暴露到全局
window.GlobalSearch = GlobalSearch;
