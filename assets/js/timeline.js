/**
 * Timeline Page JavaScript
 * Handles data loading, filtering, and rendering of timeline events
 */

// State management
let timelineData = { events: [] };
let filteredEvents = [];
let filters = {
  year: 'all',
  category: 'all',
  type: 'all'
};

// DOM Elements
const elements = {
  timelineContent: document.getElementById('timelineContent'),
  lastUpdated: document.getElementById('lastUpdated'),
  totalReleases: document.getElementById('totalReleases'),
  totalFeatures: document.getElementById('totalFeatures'),
  thisYear: document.getElementById('thisYear'),
  yearFilter: document.getElementById('yearFilter'),
  categoryFilter: document.getElementById('categoryFilter'),
  typeFilter: document.getElementById('typeFilter'),
  emptyState: document.getElementById('emptyState'),
  eventModal: document.getElementById('eventModal'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.querySelector('.modal-close'),
  modalOverlay: document.querySelector('.modal-overlay')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupEventListeners();
  updateStats();
});

// Load timeline data
async function loadData() {
  try {
    const response = await fetch('data/timeline-data.json');
    if (!response.ok) throw new Error('Failed to load timeline data');
    
    timelineData = await response.json();
    filteredEvents = [...timelineData.events];
    
    // Update last updated text
    const date = new Date(timelineData.lastUpdated);
    elements.lastUpdated.textContent = `更新于: ${date.toLocaleDateString('zh-CN')} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Populate year filter
    populateYearFilter();
    
    // Render timeline
    renderTimeline();
  } catch (error) {
    console.error('Error loading timeline data:', error);
    elements.timelineContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>数据加载失败</h3>
        <p>请刷新页面重试</p>
      </div>
    `;
  }
}

// Populate year filter options
function populateYearFilter() {
  const years = [...new Set(timelineData.events.map(e => new Date(e.date).getFullYear()))].sort((a, b) => b - a);
  
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = `${year}年`;
    elements.yearFilter.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Filter changes
  elements.yearFilter.addEventListener('change', (e) => {
    filters.year = e.target.value;
    applyFilters();
  });
  
  elements.categoryFilter.addEventListener('change', (e) => {
    filters.category = e.target.value;
    applyFilters();
  });
  
  elements.typeFilter.addEventListener('change', (e) => {
    filters.type = e.target.value;
    applyFilters();
  });
  
  // Modal close
  elements.modalClose.addEventListener('click', closeModal);
  elements.modalOverlay.addEventListener('click', closeModal);
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Apply filters
function applyFilters() {
  filteredEvents = timelineData.events.filter(event => {
    const eventDate = new Date(event.date);
    const eventYear = eventDate.getFullYear().toString();
    
    const yearMatch = filters.year === 'all' || eventYear === filters.year;
    const categoryMatch = filters.category === 'all' || event.category === filters.category;
    const typeMatch = filters.type === 'all' || event.type === filters.type;
    
    return yearMatch && categoryMatch && typeMatch;
  });
  
  renderTimeline();
}

// Group events by year
function groupByYear(events) {
  const groups = {};
  
  events.forEach(event => {
    const year = new Date(event.date).getFullYear();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(event);
  });
  
  // Sort years descending
  return Object.entries(groups)
    .sort(([a], [b]) => b - a)
    .map(([year, events]) => ({
      year: parseInt(year),
      events: events.sort((a, b) => new Date(b.date) - new Date(a.date))
    }));
}

// Render timeline
function renderTimeline() {
  if (filteredEvents.length === 0) {
    elements.timelineContent.innerHTML = '';
    elements.emptyState.style.display = 'block';
    return;
  }
  
  elements.emptyState.style.display = 'none';
  const grouped = groupByYear(filteredEvents);
  
  elements.timelineContent.innerHTML = grouped.map(({ year, events }) => `
    <div class="timeline-year">
      <h3 class="year-label">${year}年</h3>
      <div class="timeline-events">
        ${events.map(event => renderEventCard(event)).join('')}
      </div>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
      const eventId = card.dataset.eventId;
      const event = timelineData.events.find(e => e.id === eventId);
      if (event) openModal(event);
    });
  });
}

// Render single event card
function renderEventCard(event) {
  const date = new Date(event.date);
  const dateStr = date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const typeLabels = {
    feature: '✨ 新功能',
    improvement: '🔧 优化',
    fix: '🐛 修复',
    announcement: '📢 公告'
  };
  
  return `
    <div class="timeline-event" data-type="${event.type}" data-event-id="${event.id}">
      <div class="event-card">
        <div class="event-header">
          <span class="event-version">${event.version}</span>
          <span class="event-type ${event.type}">${typeLabels[event.type]}</span>
          <span class="event-category">${event.category}</span>
        </div>
        <h4 class="event-title">${event.title}</h4>
        <p class="event-date">${dateStr}</p>
        <p class="event-description">${event.description}</p>
        <div class="event-highlights">
          ${event.highlights.slice(0, 3).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
          ${event.highlights.length > 3 ? `<span class="highlight-tag">+${event.highlights.length - 3}</span>` : ''}
        </div>
        <div class="event-footer">
          <div class="event-tags">
            ${event.tags.slice(0, 3).map(tag => `<span class="event-tag">#${tag}</span>`).join('')}
          </div>
          <a href="${event.releaseUrl}" target="_blank" class="event-link" onclick="event.stopPropagation()">
            查看详情 →
          </a>
        </div>
      </div>
    </div>
  `;
}

// Open modal with event details
function openModal(event) {
  const date = new Date(event.date);
  const dateStr = date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const typeLabels = {
    feature: '✨ 新功能',
    improvement: '🔧 优化',
    fix: '🐛 修复',
    announcement: '📢 公告'
  };
  
  elements.modalBody.innerHTML = `
    <div class="modal-header">
      <span class="event-version">${event.version}</span>
      <h2>${event.title}</h2>
      <p class="event-date">${dateStr} · ${typeLabels[event.type]} · ${event.category}</p>
    </div>
    
    <div class="modal-description">
      ${formatDescription(event.description)}
    </div>
    
    <div class="modal-highlights">
      <h3>✨ 核心亮点</h3>
      <ul>
        ${event.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
    
    <div class="modal-actions">
      <a href="${event.releaseUrl}" target="_blank" class="btn btn-primary">
        查看 GitHub Release
      </a>
      <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
    </div>
  `;
  
  elements.eventModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  elements.eventModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Format description (simple markdown-like parsing)
function formatDescription(text) {
  // Convert URLs to links
  text = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color: var(--accent-blue);">$1</a>'
  );
  
  // Convert code blocks
  text = text.replace(/`([^`]+)`/g, '<code style="background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
  
  // Convert newlines to paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<p>${p}</p>`).join('');
}

// Update statistics
function updateStats() {
  elements.totalReleases.textContent = timelineData.events.length;
  elements.totalFeatures.textContent = timelineData.events.filter(e => e.type === 'feature').length;
  
  const currentYear = new Date().getFullYear();
  elements.thisYear.textContent = timelineData.events.filter(e => 
    new Date(e.date).getFullYear() === currentYear
  ).length;
}

// Expose closeModal globally
window.closeModal = closeModal;
