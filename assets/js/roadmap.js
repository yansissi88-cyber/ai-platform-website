/**
 * Roadmap Page JavaScript
 * Handles data loading, filtering, and rendering of roadmap items
 */

// State management
let roadmapData = { items: [], categories: [] };
let filteredItems = [];
let currentView = 'list';
let filters = {
  quarter: 'all',
  category: 'all',
  priority: 'all'
};

// Status labels
const STATUS_LABELS = {
  planning: '📋 Planning',
  in_progress: '🚀 In Progress',
  testing: '🧪 Testing',
  ready: '✅ Ready'
};

const STATUS_ORDER = ['ready', 'testing', 'in_progress', 'planning'];

// DOM Elements
const elements = {
  roadmapContent: document.getElementById('roadmapContent'),
  lastUpdated: document.getElementById('lastUpdated'),
  quarterFilter: document.getElementById('quarterFilter'),
  categoryFilter: document.getElementById('categoryFilter'),
  priorityFilter: document.getElementById('priorityFilter'),
  emptyState: document.getElementById('emptyState'),
  itemModal: document.getElementById('itemModal'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.querySelector('.modal-close'),
  modalOverlay: document.querySelector('.modal-overlay'),
  viewButtons: document.querySelectorAll('.view-btn')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupEventListeners();
});

// Load roadmap data
async function loadData() {
  try {
    const response = await fetch('data/roadmap-data.json');
    if (!response.ok) throw new Error('Failed to load roadmap data');
    
    roadmapData = await response.json();
    filteredItems = [...roadmapData.items];
    
    // Update last updated text
    const date = new Date(roadmapData.lastUpdated);
    elements.lastUpdated.textContent = `Updated: ${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Populate category filter
    populateCategoryFilter();
    
    // Render roadmap
    renderRoadmap();
  } catch (error) {
    console.error('Error loading roadmap data:', error);
    elements.roadmapContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Failed to load data</h3>
        <p>Please refresh the page to try again</p>
      </div>
    `;
  }
}

// Populate category filter
function populateCategoryFilter() {
  roadmapData.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.toLowerCase();
    option.textContent = category;
    elements.categoryFilter.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  // View toggle
  elements.viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      renderRoadmap();
    });
  });
  
  // Filter changes
  elements.quarterFilter.addEventListener('change', (e) => {
    filters.quarter = e.target.value;
    applyFilters();
  });
  
  elements.categoryFilter.addEventListener('change', (e) => {
    filters.category = e.target.value;
    applyFilters();
  });
  
  elements.priorityFilter.addEventListener('change', (e) => {
    filters.priority = e.target.value;
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
  filteredItems = roadmapData.items.filter(item => {
    const quarterMatch = filters.quarter === 'all' || item.quarter === filters.quarter;
    const categoryMatch = filters.category === 'all' || item.category.toLowerCase() === filters.category;
    const priorityMatch = filters.priority === 'all' || item.priority === filters.priority;
    
    return quarterMatch && categoryMatch && priorityMatch;
  });
  
  renderRoadmap();
}

// Render roadmap based on current view
function renderRoadmap() {
  if (filteredItems.length === 0) {
    elements.roadmapContent.innerHTML = '';
    elements.emptyState.style.display = 'block';
    return;
  }
  
  elements.emptyState.style.display = 'none';
  
  switch (currentView) {
    case 'list':
      renderListView();
      break;
    case 'kanban':
      renderKanbanView();
      break;
    case 'quarter':
      renderQuarterView();
      break;
  }
}

// Render list view
function renderListView() {
  // Group by status
  const grouped = {};
  STATUS_ORDER.forEach(status => {
    grouped[status] = filteredItems.filter(item => item.status === status);
  });
  
  elements.roadmapContent.innerHTML = `
    <div class="roadmap-list">
      ${STATUS_ORDER.map(status => {
        const items = grouped[status];
        if (items.length === 0) return '';
        
        return `
          <div class="status-section">
            <div class="status-header">
              <h3>${STATUS_LABELS[status]}</h3>
              <span class="status-count">${items.length} items</span>
            </div>
            ${items.map(item => renderRoadmapCard(item)).join('')}
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  addCardClickHandlers();
}

// Render kanban view
function renderKanbanView() {
  elements.roadmapContent.innerHTML = `
    <div class="kanban-board">
      ${STATUS_ORDER.map(status => {
        const items = filteredItems.filter(item => item.status === status);
        
        return `
          <div class="kanban-column">
            <div class="kanban-column-header">
              <h3>${STATUS_LABELS[status]}</h3>
              <span class="kanban-count">${items.length}</span>
            </div>
            <div class="kanban-cards">
              ${items.map(item => renderKanbanCard(item)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  addCardClickHandlers();
}

// Render quarter view
function renderQuarterView() {
  // Group by quarter
  const quarters = [...new Set(filteredItems.map(item => item.quarter))].sort();
  
  elements.roadmapContent.innerHTML = `
    <div class="quarter-grid">
      ${quarters.map(quarter => {
        const items = filteredItems.filter(item => item.quarter === quarter);
        const completed = items.filter(i => i.status === 'ready').length;
        const total = items.length;
        
        return `
          <div class="quarter-section">
            <div class="quarter-header">
              <h3>${quarter}</h3>
              <span class="quarter-status">${completed}/${total} completed</span>
            </div>
            <div class="quarter-items">
              ${items.map(item => renderQuarterCard(item)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  addCardClickHandlers();
}

// Render roadmap card (list view)
function renderRoadmapCard(item) {
  const priorityLabels = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low'
  };
  
  return `
    <div class="roadmap-card" data-status="${item.status}" data-item-id="${item.id}">
      <div class="card-header">
        <div class="card-title-section">
          <span class="card-category">${item.category}</span>
          <h4 class="card-title">${item.title}</h4>
        </div>
        <span class="card-priority ${item.priority}">${priorityLabels[item.priority]}</span>
      </div>
      <p class="card-description">${item.description}</p>
      <div class="card-meta">
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" data-status="${item.status}" style="width: ${item.progress}%"></div>
          </div>
          <span class="progress-text">${item.progress}% complete</span>
        </div>
        <div class="card-date">
          📅 ${item.targetDate || item.quarter}
        </div>
      </div>
    </div>
  `;
}

// Render kanban card
function renderKanbanCard(item) {
  const priorityLabels = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  
  return `
    <div class="kanban-card" data-item-id="${item.id}">
      <span class="card-category">${item.category}</span>
      <h4 class="card-title">${item.title}</h4>
      <span class="card-priority ${item.priority}">${priorityLabels[item.priority]}</span>
      <div class="progress-bar">
        <div class="progress-fill" data-status="${item.status}" style="width: ${item.progress}%"></div>
      </div>
    </div>
  `;
}

// Render quarter card
function renderQuarterCard(item) {
  const statusEmoji = {
    planning: '⚪',
    in_progress: '🔵',
    testing: '🟠',
    ready: '🟢'
  };
  
  return `
    <div class="quarter-card" data-item-id="${item.id}">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span>${statusEmoji[item.status]}</span>
        <span style="font-size: 0.75rem; color: var(--accent-cyan); text-transform: uppercase;">${item.category}</span>
      </div>
      <h4 style="font-size: 0.95rem; margin-bottom: 8px;">${item.title}</h4>
      <div class="progress-bar" style="height: 4px;">
        <div class="progress-fill" data-status="${item.status}" style="width: ${item.progress}%"></div>
      </div>
    </div>
  `;
}

// Add click handlers to cards
function addCardClickHandlers() {
  document.querySelectorAll('.roadmap-card, .kanban-card, .quarter-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemId = card.dataset.itemId;
      const item = roadmapData.items.find(i => i.id === itemId);
      if (item) openModal(item);
    });
  });
}

// Open modal with item details
function openModal(item) {
  const priorityLabels = {
    high: '🔴 High Priority',
    medium: '🟡 Medium Priority',
    low: '🟢 Low Priority'
  };
  
  elements.modalBody.innerHTML = `
    <span class="modal-status ${item.status}">${STATUS_LABELS[item.status]}</span>
    
    <div class="modal-header">
      <h2>${item.title}</h2>
      <div class="modal-meta">
        <span>${item.category}</span>
        <span>·</span>
        <span>${priorityLabels[item.priority]}</span>
        <span>·</span>
        <span>${item.quarter}</span>
      </div>
    </div>
    
    <div class="modal-description">
      ${item.description}
    </div>
    
    <div class="modal-progress">
      <div class="modal-progress-header">
        <span>Progress</span>
        <span>${item.progress}%</span>
      </div>
      <div class="modal-progress-bar">
        <div class="modal-progress-fill" data-status="${item.status}" style="width: ${item.progress}%"></div>
      </div>
    </div>
    
    <div class="modal-links">
      <a href="${item.source.url}" target="_blank" class="btn btn-primary">
        View on GitHub
      </a>
      ${item.userStory ? `<a href="user-stories.html#${item.userStory}" class="btn btn-secondary">View Story</a>` : ''}
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `;
  
  elements.itemModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  elements.itemModal.classList.remove('active');
  document.body.style.overflow = '';
}

window.closeModal = closeModal;
