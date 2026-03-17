/**
 * Roadmap Module - Product Development Roadmap
 * Enhanced with detailed specs, community features, and dependency visualization
 */

let roadmapData = null;
let currentView = 'list';
let currentFilter = 'all';

// Initialize roadmap
async function initRoadmap() {
  try {
    const response = await fetch('data/roadmap-data.json');
    const data = await response.json();
    roadmapData = data;
    renderRoadmap();
    setupViewSwitcher();
    setupFilters();
    updateHeaderInfo(data);
  } catch (error) {
    console.error('Failed to load roadmap data:', error);
    document.getElementById('roadmap-content').innerHTML = `
      <div class="error-message">
        <p>Unable to load roadmap data. Please try again later.</p>
      </div>
    `;
  }
}

// Update header info
function updateHeaderInfo(data) {
  const currentQuarterEl = document.getElementById('current-quarter');
  const lastUpdatedEl = document.getElementById('last-updated');
  
  if (currentQuarterEl) currentQuarterEl.textContent = data.currentQuarter;
  if (lastUpdatedEl && data.lastUpdated) {
    const date = new Date(data.lastUpdated);
    lastUpdatedEl.textContent = `Updated ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
}

// Setup view switcher
function setupViewSwitcher() {
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      renderRoadmap();
    });
  });
}

// Setup filters
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderRoadmap();
    });
  });
}

// Get filtered items
function getFilteredItems() {
  if (!roadmapData) return [];
  
  let items = roadmapData.items;
  
  if (currentFilter !== 'all') {
    if (['planning', 'in_progress', 'testing', 'ready'].includes(currentFilter)) {
      items = items.filter(item => item.status === currentFilter);
    } else {
      items = items.filter(item => item.category === currentFilter);
    }
  }
  
  return items;
}

// Render roadmap based on current view
function renderRoadmap() {
  const container = document.getElementById('roadmap-content');
  const items = getFilteredItems();
  
  if (items.length === 0) {
    container.innerHTML = '<div class="no-results">No items match your filter.</div>';
    return;
  }
  
  switch (currentView) {
    case 'list':
      container.innerHTML = renderListView(items);
      break;
    case 'board':
      container.innerHTML = renderBoardView(items);
      break;
    case 'quarter':
      container.innerHTML = renderQuarterView(items);
      break;
    case 'dependencies':
      container.innerHTML = renderDependencyView(items);
      break;
  }
  
  // Setup item click handlers
  setupItemHandlers();
}

// Render list view
function renderListView(items) {
  return `
    <div class="roadmap-list">
      ${items.map(item => renderRoadmapCard(item)).join('')}
    </div>
  `;
}

// Render board view (Kanban-style)
function renderBoardView(items) {
  const statuses = roadmapData.statuses;
  
  return `
    <div class="roadmap-board">
      ${statuses.map(status => {
        const statusItems = items.filter(item => item.status === status.id);
        return `
          <div class="board-column" data-status="${status.id}">
            <div class="column-header">
              <span class="status-dot" style="background: ${status.color}"></span>
              <h4>${status.name}</h4>
              <span class="count">${statusItems.length}</span>
            </div>
            <div class="column-items">
              ${statusItems.map(item => renderCompactCard(item)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Render quarter timeline view
function renderQuarterView(items) {
  const quarters = [...new Set(items.map(item => item.quarter))].sort();
  
  return `
    <div class="roadmap-timeline">
      ${quarters.map((quarter, index) => {
        const quarterItems = items.filter(item => item.quarter === quarter);
        return `
          <div class="timeline-quarter">
            <div class="quarter-header">
              <span class="quarter-badge">${quarter}</span>
              <div class="quarter-line"></div>
            </div>
            <div class="quarter-items">
              ${quarterItems.map(item => renderCompactCard(item)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Render dependency graph view
function renderDependencyView(items) {
  const itemsWithDeps = items.filter(item => 
    item.dependencies?.length > 0 || 
    items.some(i => i.dependencies?.some(d => d.itemId === item.id))
  );
  
  if (itemsWithDeps.length === 0) {
    return `<div class="no-results">No dependencies to display for current filter.</div>`;
  }
  
  return `
    <div class="dependency-view">
      <div class="dependency-graph">
        <svg id="dependency-svg" viewBox="0 0 800 600">
          ${renderDependencyConnections(itemsWithDeps)}
        </svg>
        <div class="dependency-nodes">
          ${itemsWithDeps.map((item, index) => renderDependencyNode(item, index)).join('')}
        </div>
      </div>
      <div class="dependency-legend">
        <div class="legend-item">
          <span class="legend-line requires"></span>
          <span>Requires (hard dependency)</span>
        </div>
        <div class="legend-item">
          <span class="legend-line enhances"></span>
          <span>Enhances (soft dependency)</span>
        </div>
      </div>
    </div>
  `;
}

// Render dependency connections (simplified SVG)
function renderDependencyConnections(items) {
  // Simplified visualization - in production would calculate node positions
  return items.map(item => {
    if (!item.dependencies) return '';
    return item.dependencies.map((dep, idx) => {
      const targetItem = items.find(i => i.id === dep.itemId);
      if (!targetItem) return '';
      return `<line class="dep-line ${dep.type}" x1="100" y1="100" x2="300" y2="200" />`;
    }).join('');
  }).join('');
}

// Render dependency node
function renderDependencyNode(item, index) {
  const category = roadmapData.categories.find(c => c.id === item.category);
  return `
    <div class="dep-node" data-id="${item.id}" style="--node-color: ${category?.color || '#3b82f6'}">
      <div class="node-header">
        <span class="node-status" style="background: ${getStatusColor(item.status)}"></span>
        <span class="node-title">${item.title}</span>
      </div>
      <div class="node-meta">
        <span class="node-quarter">${item.quarter}</span>
        ${item.dependencies?.length > 0 ? `<span class="node-deps">${item.dependencies.length} deps</span>` : ''}
      </div>
    </div>
  `;
}

// Render full roadmap card
function renderRoadmapCard(item) {
  const category = roadmapData.categories.find(c => c.id === item.category);
  const status = roadmapData.statuses.find(s => s.id === item.status);
  
  return `
    <div class="roadmap-card" data-id="${item.id}">
      <div class="card-header-row">
        <div class="card-category" style="color: ${category?.color || '#3b82f6'}">
          ${category?.name || item.category}
        </div>
        <div class="card-badges">
          <span class="status-badge" style="background: ${status?.color || '#64748b'}20; color: ${status?.color || '#64748b'}">
            ${status?.name || item.status}
          </span>
          ${item.priority === 'high' ? '<span class="priority-badge high">High</span>' : ''}
        </div>
      </div>
      
      <h3 class="card-title">${item.title}</h3>
      <p class="card-description">${item.description}</p>
      
      ${renderProgressBar(item)}
      ${renderCommunitySection(item)}
      ${renderMilestones(item)}
      
      <div class="card-footer">
        <div class="card-meta">
          <span class="quarter-tag">${item.quarter}</span>
          ${item.assignees ? `
            <div class="assignees">
              ${item.assignees.slice(0, 3).map(() => `
                <div class="assignee-avatar"></div>
              `).join('')}
              ${item.assignees.length > 3 ? `<span class="more-assignees">+${item.assignees.length - 3}</span>` : ''}
            </div>
          ` : ''}
        </div>
        <button class="btn-details" onclick="openItemDetails('${item.id}')">
          Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// Render compact card (for board/quarter views)
function renderCompactCard(item) {
  const category = roadmapData.categories.find(c => c.id === item.category);
  const status = roadmapData.statuses.find(s => s.id === item.status);
  
  return `
    <div class="compact-card" data-id="${item.id}" onclick="openItemDetails('${item.id}')">
      <div class="compact-header">
        <span class="category-dot" style="background: ${category?.color || '#3b82f6'}"></span>
        <span class="compact-status" style="color: ${status?.color || '#64748b'}">${status?.name}</span>
      </div>
      <h4 class="compact-title">${item.title}</h4>
      <div class="compact-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${item.progress || 0}%"></div>
        </div>
        <span class="progress-text">${item.progress || 0}%</span>
      </div>
      ${item.community?.votes > 20 ? `<div class="compact-votes">👍 ${item.community.votes}</div>` : ''}
    </div>
  `;
}

// Render progress bar
function renderProgressBar(item) {
  const progress = item.progress || 0;
  let statusColor = '#64748b';
  if (progress >= 75) statusColor = '#10b981';
  else if (progress >= 50) statusColor = '#3b82f6';
  else if (progress >= 25) statusColor = '#f59e0b';
  
  return `
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Progress</span>
        <span class="progress-value" style="color: ${statusColor}">${progress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%; background: ${statusColor}"></div>
      </div>
    </div>
  `;
}

// Render community section
function renderCommunitySection(item) {
  if (!item.community || item.community.votes === 0) return '';
  
  return `
    <div class="community-section">
      <div class="community-stats">
        <span class="community-stat" title="Community votes">
          👍 ${item.community.votes}
        </span>
        ${item.community.comments > 0 ? `
          <span class="community-stat" title="Comments">
            💬 ${item.community.comments}
          </span>
        ` : ''}
      </div>
      ${item.community.requestedBy?.length > 0 ? `
        <div class="requested-by">
          Requested by: ${item.community.requestedBy.slice(0, 2).join(', ')}
          ${item.community.requestedBy.length > 2 ? ` +${item.community.requestedBy.length - 2} more` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

// Render milestones
function renderMilestones(item) {
  if (!item.milestones || item.milestones.length === 0) return '';
  
  const completed = item.milestones.filter(m => m.status === 'completed').length;
  
  return `
    <div class="milestones-section">
      <div class="milestones-header">
        <span>Milestones</span>
        <span class="milestones-count">${completed}/${item.milestones.length}</span>
      </div>
      <div class="milestones-list">
        ${item.milestones.slice(0, 3).map(m => `
          <div class="milestone ${m.status}">
            <span class="milestone-dot"></span>
            <span class="milestone-name">${m.name}</span>
            <span class="milestone-date">${m.date || m.targetDate}</span>
          </div>
        `).join('')}
        ${item.milestones.length > 3 ? `<div class="more-milestones">+${item.milestones.length - 3} more</div>` : ''}
      </div>
    </div>
  `;
}

// Get status color
function getStatusColor(status) {
  const statusObj = roadmapData.statuses.find(s => s.id === status);
  return statusObj?.color || '#64748b';
}

// Open item details modal
function openItemDetails(itemId) {
  const item = roadmapData.items.find(i => i.id === itemId);
  if (!item) return;
  
  const modal = document.getElementById('roadmap-modal') || createModal();
  const content = modal.querySelector('.modal-content');
  
  content.innerHTML = renderItemDetailContent(item);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Create modal
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'roadmap-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeItemDetails()"></div>
    <div class="modal-container">
      <button class="modal-close" onclick="closeItemDetails()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <div class="modal-content"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// Close item details
function closeItemDetails() {
  const modal = document.getElementById('roadmap-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Render detailed item content
function renderItemDetailContent(item) {
  const category = roadmapData.categories.find(c => c.id === item.category);
  const status = roadmapData.statuses.find(s => s.id === item.status);
  
  return `
    <div class="detail-header">
      <div class="detail-badges">
        <span class="category-badge" style="background: ${category?.color || '#3b82f6'}20; color: ${category?.color || '#3b82f6'}">
          ${category?.name}
        </span>
        <span class="status-badge" style="background: ${status?.color || '#64748b'}20; color: ${status?.color || '#64748b'}">
          ${status?.name}
        </span>
        ${item.priority === 'high' ? '<span class="priority-badge">High Priority</span>' : ''}
      </div>
      <h2>${item.title}</h2>
      <p class="detail-description">${item.description}</p>
    </div>
    
    ${renderDetailedSpecs(item.detailedSpecs)}
    ${renderBusinessForecast(item.businessForecast)}
    ${renderDependencies(item)}
    ${renderDesignResources(item.designResources)}
    ${renderCommunityDetails(item.community)}
    ${renderAssignees(item.assignees)}
    ${renderMilestonesDetailed(item.milestones)}
    
    <!-- Related Links Section -->
    <div class="detail-section related-links">
      <h3>🔗 Related</h3>
      <div class="related-grid">
        <a href="timeline.html" class="related-card">
          <span class="related-icon">📅</span>
          <div class="related-info">
            <span class="related-title">Release Timeline</span>
            <span class="related-desc">View shipped features</span>
          </div>
        </a>
        <a href="user-stories.html" class="related-card">
          <span class="related-icon">⭐</span>
          <div class="related-info">
            <span class="related-title">Customer Stories</span>
            <span class="related-desc">See customer impact</span>
          </div>
        </a>
      </div>
    </div>
    
    <div class="detail-footer">
      ${item.source?.url ? `
        <a href="${item.source.url}" target="_blank" class="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
          View on GitHub
        </a>
      ` : ''}
    </div>
  `;
}

// Render detailed specs
function renderDetailedSpecs(specs) {
  if (!specs) return '';
  
  return `
    <div class="detail-section specs">
      <h3>📋 Detailed Specifications</h3>
      ${specs.overview ? `<p class="spec-overview">${specs.overview}</p>` : ''}
      
      ${specs.userStories ? `
        <div class="spec-subsection">
          <h4>User Stories</h4>
          <ul class="user-stories">
            ${specs.userStories.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${specs.acceptanceCriteria ? `
        <div class="spec-subsection">
          <h4>Acceptance Criteria</h4>
          <ul class="acceptance-criteria">
            ${specs.acceptanceCriteria.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${specs.targetMetrics ? `
        <div class="spec-subsection">
          <h4>Target Metrics</h4>
          <div class="target-metrics">
            ${Object.entries(specs.targetMetrics).map(([key, value]) => `
              <div class="target-metric">
                <span class="metric-key">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <span class="metric-target">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Render business forecast
function renderBusinessForecast(forecast) {
  if (!forecast) return '';
  
  return `
    <div class="detail-section forecast">
      <h3>📈 Business Forecast</h3>
      <div class="forecast-grid">
        ${forecast.marketSize ? `
          <div class="forecast-item">
            <span class="forecast-label">Market Size</span>
            <span class="forecast-value">${forecast.marketSize}</span>
          </div>
        ` : ''}
        ${forecast.targetCustomers ? `
          <div class="forecast-item">
            <span class="forecast-label">Target Segment</span>
            <span class="forecast-value">${forecast.targetCustomers}</span>
          </div>
        ` : ''}
        ${forecast.revenueImpact ? `
          <div class="forecast-item">
            <span class="forecast-label">Revenue Impact</span>
            <span class="forecast-value">${forecast.revenueImpact}</span>
          </div>
        ` : ''}
        ${forecast.adoptionGoal ? `
          <div class="forecast-item">
            <span class="forecast-label">Adoption Goal</span>
            <span class="forecast-value">${forecast.adoptionGoal}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Render dependencies
function renderDependencies(item) {
  if (!item.dependencies || item.dependencies.length === 0) return '';
  
  return `
    <div class="detail-section dependencies">
      <h3>🔗 Dependencies</h3>
      <div class="dependencies-list">
        ${item.dependencies.map(dep => {
          const depItem = roadmapData.items.find(i => i.id === dep.itemId);
          return `
            <div class="dependency-item ${dep.type}">
              <span class="dep-type">${dep.type}</span>
              <span class="dep-title">${depItem?.title || dep.itemId}</span>
              ${dep.description ? `<span class="dep-desc">${dep.description}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Render design resources
function renderDesignResources(resources) {
  if (!resources) return '';
  
  return `
    <div class="detail-section design-resources">
      <h3>🎨 Design Resources</h3>
      <div class="resources-grid">
        ${resources.figmaUrl ? `
          <a href="${resources.figmaUrl}" target="_blank" class="resource-card">
            <span class="resource-icon">🎨</span>
            <span class="resource-name">Figma</span>
          </a>
        ` : ''}
        ${resources.prototypeUrl ? `
          <a href="${resources.prototypeUrl}" target="_blank" class="resource-card">
            <span class="resource-icon">👆</span>
            <span class="resource-name">Prototype</span>
          </a>
        ` : ''}
        ${resources.designDoc ? `
          <a href="${resources.designDoc}" target="_blank" class="resource-card">
            <span class="resource-icon">📄</span>
            <span class="resource-name">Design Doc</span>
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

// Render community details
function renderCommunityDetails(community) {
  if (!community || community.votes === 0) return '';
  
  return `
    <div class="detail-section community-details">
      <h3>👥 Community</h3>
      <div class="community-stats-detailed">
        <div class="community-stat-large">
          <span class="stat-number">${community.votes}</span>
          <span class="stat-label">Votes</span>
        </div>
        <div class="community-stat-large">
          <span class="stat-number">${community.comments || 0}</span>
          <span class="stat-label">Comments</span>
        </div>
      </div>
      ${community.requestedBy?.length > 0 ? `
        <div class="requested-by-detailed">
          <h4>Requested By</h4>
          <div class="requestor-tags">
            ${community.requestedBy.map(r => `<span class="requestor-tag">${r}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${community.discussionUrl ? `
        <a href="${community.discussionUrl}" target="_blank" class="btn-secondary">
          Join Discussion
        </a>
      ` : ''}
    </div>
  `;
}

// Render assignees
function renderAssignees(assignees) {
  if (!assignees || assignees.length === 0) return '';
  
  return `
    <div class="detail-section assignees">
      <h3>👤 Team</h3>
      <div class="assignees-list">
        ${assignees.map(a => `
          <div class="assignee-card">
            <div class="assignee-avatar-large"></div>
            <div class="assignee-info">
              <span class="assignee-name">${a.name}</span>
              <span class="assignee-role">${a.role}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render detailed milestones
function renderMilestonesDetailed(milestones) {
  if (!milestones || milestones.length === 0) return '';
  
  return `
    <div class="detail-section milestones-detailed">
      <h3>🎯 Milestones</h3>
      <div class="milestones-timeline">
        ${milestones.map((m, index) => `
          <div class="milestone-item ${m.status}">
            <div class="milestone-marker">
              <span class="marker-dot"></span>
              ${index < milestones.length - 1 ? '<span class="marker-line"></span>' : ''}
            </div>
            <div class="milestone-content">
              <span class="milestone-name">${m.name}</span>
              <span class="milestone-status">${m.status}</span>
              <span class="milestone-date">${m.date || m.targetDate}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Setup item click handlers
function setupItemHandlers() {
  // Handlers are attached inline in render functions
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeItemDetails();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initRoadmap);
