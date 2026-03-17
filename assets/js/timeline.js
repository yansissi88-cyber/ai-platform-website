/**
 * Timeline Module - Product History Visualization
 * Enhanced with deep content: metrics, architecture, customer feedback
 */

let timelineData = null;
let currentFilter = 'all';

// Icons mapping
const icons = {
  feature: '✨',
  improvement: '🔧',
  fix: '🐛',
  healthcare: '🏥',
  platform: '🏗️',
  campaign: '📢',
  livechat: '💬',
  voice: '🎙️',
  analytics: '📊',
  mobile: '📱'
};

// Initialize timeline
async function initTimeline() {
  try {
    const response = await fetch('data/timeline-data.json');
    const data = await response.json();
    timelineData = data;
    renderTimeline(data.events);
    setupFilters();
    updateLastUpdated(data.lastUpdated);
  } catch (error) {
    console.error('Failed to load timeline data:', error);
    document.getElementById('timeline').innerHTML = `
      <div class="error-message">
        <p>Unable to load timeline data. Please try again later.</p>
      </div>
    `;
  }
}

// Render timeline events
function renderTimeline(events) {
  const container = document.getElementById('timeline');
  container.innerHTML = '';
  
  if (events.length === 0) {
    container.innerHTML = '<div class="no-results">No events match your filter.</div>';
    return;
  }
  
  events.forEach((event, index) => {
    const card = createTimelineCard(event, index % 2 === 0 ? 'left' : 'right');
    container.appendChild(card);
  });
  
  // Animate cards on scroll
  setupScrollAnimation();
}

// Create timeline card element
function createTimelineCard(event, position) {
  const card = document.createElement('div');
  card.className = `timeline-card ${position}`;
  card.dataset.id = event.id;
  
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const categoryIcon = icons[event.category] || icons[event.type] || '📦';
  
  card.innerHTML = `
    <div class="timeline-date">
      <span class="date-badge">${formattedDate}</span>
      <span class="version-badge">${event.version}</span>
    </div>
    <div class="timeline-content">
      <div class="card-header">
        <span class="category-icon">${categoryIcon}</span>
        <div class="header-text">
          <h3>${event.title}</h3>
          <div class="tags">
            ${event.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
      
      ${event.valueProposition ? `
        <div class="value-prop">
          <p>${event.valueProposition}</p>
        </div>
      ` : ''}
      
      <div class="highlights">
        ${event.highlights.slice(0, 3).map(h => `<div class="highlight">${h}</div>`).join('')}
      </div>
      
      ${renderBusinessImpact(event.businessImpact)}
      
      <div class="card-actions">
        <button class="btn-details" onclick="openEventDetails('${event.id}')">
          View Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        ${event.releaseUrl ? `
          <a href="${event.releaseUrl}" target="_blank" class="btn-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
            GitHub
          </a>
        ` : ''}
      </div>
    </div>
  `;
  
  return card;
}

// Render business impact metrics
function renderBusinessImpact(impact) {
  if (!impact || impact.length === 0) return '';
  
  return `
    <div class="business-impact">
      <h4>Business Impact</h4>
      <div class="impact-metrics">
        ${impact.map(m => `
          <div class="impact-metric">
            <span class="metric-name">${m.metric}</span>
            <div class="metric-values">
              <span class="before">${m.before}</span>
              <span class="arrow">→</span>
              <span class="after">${m.after}</span>
              <span class="improvement">${m.improvement}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Open event details modal
function openEventDetails(eventId) {
  const event = timelineData.events.find(e => e.id === eventId);
  if (!event) return;
  
  const modal = document.getElementById('event-modal') || createModal();
  const content = modal.querySelector('.modal-content');
  
  content.innerHTML = renderEventDetailContent(event);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Create modal if not exists
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'event-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeEventDetails()"></div>
    <div class="modal-container">
      <button class="modal-close" onclick="closeEventDetails()">
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

// Close event details
function closeEventDetails() {
  const modal = document.getElementById('event-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Render detailed event content
function renderEventDetailContent(event) {
  const date = new Date(event.date);
  const categoryIcon = icons[event.category] || icons[event.type] || '📦';
  
  return `
    <div class="detail-header">
      <div class="detail-meta">
        <span class="version-tag">${event.version}</span>
        <span class="date">${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <h2><span class="category-icon">${categoryIcon}</span> ${event.title}</h2>
      <div class="detail-tags">
        ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
    
    ${event.valueProposition ? `
      <div class="detail-section value-proposition">
        <h3>💡 Value Proposition</h3>
        <p class="lead">${event.valueProposition}</p>
      </div>
    ` : ''}
    
    ${event.problemStatement ? `
      <div class="detail-section problem-statement">
        <h3>🎯 Problem Statement</h3>
        <p>${event.problemStatement}</p>
      </div>
    ` : ''}
    
    ${event.solutionOverview ? `
      <div class="detail-section solution-overview">
        <h3>✅ Solution Overview</h3>
        <p>${event.solutionOverview}</p>
      </div>
    ` : ''}
    
    <div class="detail-section highlights">
      <h3>✨ Key Highlights</h3>
      <ul>
        ${event.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
    
    ${event.businessImpact ? renderBusinessImpactDetailed(event.businessImpact) : ''}
    
    ${event.architecture ? renderArchitectureSection(event.architecture) : ''}
    
    ${event.technicalHighlights ? `
      <div class="detail-section technical-highlights">
        <h3>🔧 Technical Highlights</h3>
        <ul>
          ${event.technicalHighlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${event.customerQuotes && event.customerQuotes.length > 0 ? renderCustomerQuotes(event.customerQuotes) : ''}
    
    ${event.comparisonWithPrevious && event.comparisonWithPrevious.length > 0 ? renderComparisonTable(event.comparisonWithPrevious) : ''}
    
    ${event.migrationGuide ? `
      <div class="detail-section migration">
        <h3>🚀 Migration Guide</h3>
        <p>${event.migrationGuide}</p>
      </div>
    ` : ''}
    
    ${event.breakingChanges && event.breakingChanges.length > 0 ? `
      <div class="detail-section breaking-changes">
        <h3>⚠️ Breaking Changes</h3>
        <ul>
          ${event.breakingChanges.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${event.resources && event.resources.length > 0 ? renderResources(event.resources) : ''}
    
    <!-- Related Links Section -->
    <div class="detail-section related-links">
      <h3>🔗 Related</h3>
      <div class="related-grid">
        <a href="roadmap.html" class="related-card">
          <span class="related-icon">🗺️</span>
          <div class="related-info">
            <span class="related-title">View Roadmap</span>
            <span class="related-desc">See upcoming features</span>
          </div>
        </a>
        <a href="user-stories.html" class="related-card">
          <span class="related-icon">⭐</span>
          <div class="related-info">
            <span class="related-title">Customer Stories</span>
            <span class="related-desc">Read success stories</span>
          </div>
        </a>
      </div>
    </div>
    
    <div class="detail-footer">
      ${event.releaseUrl ? `
        <a href="${event.releaseUrl}" target="_blank" class="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
          View on GitHub
        </a>
      ` : ''}
    </div>
  `;
}

// Render detailed business impact
function renderBusinessImpactDetailed(impact) {
  return `
    <div class="detail-section business-impact-detailed">
      <h3>📊 Business Impact</h3>
      <div class="impact-grid">
        ${impact.map(m => `
          <div class="impact-card">
            <div class="impact-metric-name">${m.metric}</div>
            <div class="impact-values">
              <div class="before-value">
                <span class="label">Before</span>
                <span class="value">${m.before}</span>
              </div>
              <div class="arrow-divider">→</div>
              <div class="after-value">
                <span class="label">After</span>
                <span class="value">${m.after}</span>
              </div>
            </div>
            <div class="improvement-badge">${m.improvement}</div>
            ${m.description ? `<div class="impact-description">${m.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render architecture section
function renderArchitectureSection(arch) {
  return `
    <div class="detail-section architecture">
      <h3>🏗️ Architecture</h3>
      <p>${arch.description}</p>
      ${arch.components ? `
        <div class="arch-components">
          <h4>Key Components</h4>
          <div class="component-tags">
            ${arch.components.map(c => `<span class="component-tag">${c}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${arch.technologies ? `
        <div class="arch-technologies">
          <h4>Technologies</h4>
          <div class="tech-tags">
            ${arch.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Render customer quotes
function renderCustomerQuotes(quotes) {
  return `
    <div class="detail-section customer-quotes">
      <h3>💬 Customer Feedback</h3>
      <div class="quotes-container">
        ${quotes.map(q => `
          <blockquote class="customer-quote">
            <p>"${q.quote}"</p>
            <footer>
              <div class="quote-author">
                <strong>${q.author}</strong>
                <span>${q.role}${q.company ? `, ${q.company}` : ''}</span>
              </div>
            </footer>
          </blockquote>
        `).join('')}
      </div>
    </div>
  `;
}

// Render comparison table
function renderComparisonTable(comparisons) {
  return `
    <div class="detail-section comparison">
      <h3>📈 Evolution</h3>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Previous</th>
            <th>Current</th>
          </tr>
        </thead>
        <tbody>
          ${comparisons.map(c => `
            <tr>
              <td>${c.aspect}</td>
              <td class="previous">${c.previous}</td>
              <td class="current">${c.current}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Render resources
function renderResources(resources) {
  const iconMap = {
    documentation: '📚',
    api: '🔌',
    tutorial: '🎓',
    blog: '📝',
    video: '🎬'
  };
  
  return `
    <div class="detail-section resources">
      <h3>📚 Resources</h3>
      <div class="resources-list">
        ${resources.map(r => `
          <a href="${r.url}" target="_blank" class="resource-link">
            <span class="resource-icon">${iconMap[r.type] || '📄'}</span>
            <span class="resource-title">${r.title}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// Setup filters
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });
}

// Apply filter
function applyFilter(filter) {
  currentFilter = filter;
  
  if (!timelineData) return;
  
  let filtered = timelineData.events;
  
  if (filter === 'feature') {
    filtered = timelineData.events.filter(e => e.type === 'feature');
  } else if (filter === 'fix') {
    filtered = timelineData.events.filter(e => e.type === 'fix' || e.type === 'improvement');
  } else if (filter === '2026') {
    filtered = timelineData.events.filter(e => new Date(e.date).getFullYear() === 2026);
  }
  
  renderTimeline(filtered);
}

// Update last updated timestamp
function updateLastUpdated(timestamp) {
  const element = document.getElementById('last-updated');
  if (element && timestamp) {
    const date = new Date(timestamp);
    element.textContent = `Last updated: ${date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}`;
  }
}

// Setup scroll animation
function setupScrollAnimation() {
  const cards = document.querySelectorAll('.timeline-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cards.forEach(card => observer.observe(card));
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEventDetails();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initTimeline);
