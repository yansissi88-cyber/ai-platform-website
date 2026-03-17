/**
 * User Stories Module - Customer Success Stories
 * Enhanced with full case studies, multi-role perspectives, and implementation details
 */

let storiesData = null;
let currentFilter = 'all';

// Initialize stories
async function initStories() {
  try {
    const response = await fetch('data/user-stories.json');
    const data = await response.json();
    storiesData = data;
    renderStories(data.stories);
    setupFilters(data.stories);
    updateMetadata(data.metadata);
  } catch (error) {
    console.error('Failed to load stories data:', error);
    document.getElementById('stories-grid').innerHTML = `
      <div class="error-message">
        <p>Unable to load customer stories. Please try again later.</p>
      </div>
    `;
  }
}

// Update metadata display
function updateMetadata(metadata) {
  const metaEl = document.getElementById('stories-meta');
  if (metaEl && metadata) {
    metaEl.innerHTML = `
      <span>${metadata.totalStories} Success Stories</span>
      <span class="separator">•</span>
      <span>${metadata.industries.length} Industries</span>
      <span class="separator">•</span>
      <span>${metadata.successRate} Success Rate</span>
    `;
  }
}

// Setup filters
function setupFilters(stories) {
  const industries = [...new Set(stories.map(s => s.industry))];
  const filterContainer = document.getElementById('stories-filters');
  
  if (!filterContainer) return;
  
  filterContainer.innerHTML = `
    <button class="filter-btn active" data-filter="all">All Stories</button>
    ${industries.map(ind => `
      <button class="filter-btn" data-filter="${ind}">${ind}</button>
    `).join('')}
  `;
  
  const filterBtns = filterContainer.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      currentFilter = filter;
      
      const filtered = filter === 'all' 
        ? storiesData.stories 
        : storiesData.stories.filter(s => s.industry === filter);
      
      renderStories(filtered);
    });
  });
}

// Render stories grid
function renderStories(stories) {
  const container = document.getElementById('stories-grid');
  
  if (stories.length === 0) {
    container.innerHTML = '<div class="no-results">No stories match your filter.</div>';
    return;
  }
  
  container.innerHTML = `
    <div class="stories-grid-container">
      ${stories.map(story => renderStoryCard(story)).join('')}
    </div>
  `;
  
  // Setup card click handlers
  setupCardHandlers();
}

// Render story card
function renderStoryCard(story) {
  const isFeatured = story.featured;
  
  return `
    <article class="story-card ${isFeatured ? 'featured' : ''}" data-id="${story.id}">
      ${isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
      
      <div class="story-header">
        <div class="story-industry">${story.industry}</div>
        <div class="story-company-size">${story.companySize}</div>
      </div>
      
      <h3 class="story-title">${story.title}</h3>
      <p class="story-subtitle">${story.subtitle}</p>
      
      <div class="story-metrics-preview">
        ${story.results.metrics.slice(0, 2).map(m => `
          <div class="metric-preview">
            <span class="metric-improvement">${m.improvement}</span>
            <span class="metric-name">${m.metric}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="story-quote-preview">
        <blockquote>"${story.quote.content.substring(0, 120)}..."</blockquote>
        <cite>— ${story.quote.author}, ${story.quote.role}</cite>
      </div>
      
      <div class="story-footer">
        <div class="story-company">
          <span class="company-name">${story.company.name}</span>
        </div>
        <button class="btn-read-more" onclick="openStoryDetail('${story.id}')">
          Read Full Story
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </article>
  `;
}

// Setup card click handlers
function setupCardHandlers() {
  // Handlers attached inline
}

// Open story detail modal
function openStoryDetail(storyId) {
  const story = storiesData.stories.find(s => s.id === storyId);
  if (!story) return;
  
  const modal = document.getElementById('story-modal') || createModal();
  const content = modal.querySelector('.modal-content');
  
  content.innerHTML = renderStoryDetailContent(story);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Create modal
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'story-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeStoryDetail()"></div>
    <div class="modal-container modal-large">
      <button class="modal-close" onclick="closeStoryDetail()">
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

// Close story detail
function closeStoryDetail() {
  const modal = document.getElementById('story-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Render detailed story content
function renderStoryDetailContent(story) {
  return `
    <article class="story-detail">
      ${renderDetailHeader(story)}
      ${renderSelectionProcess(story.selectionProcess)}
      ${renderScenario(story.scenario)}
      ${renderImplementation(story.scenario.implementation)}
      ${renderResults(story.results)}
      ${renderMultiRolePerspectives(story.multiRolePerspectives)}
      ${renderLessonsLearned(story.lessonsLearned)}
      ${renderDetailFooter(story)}
    </article>
  `;
}

// Render detail header
function renderDetailHeader(story) {
  return `
    <header class="detail-header">
      <div class="detail-badges">
        <span class="industry-badge">${story.industry}</span>
        <span class="company-size-badge">${story.companySize}</span>
        <span class="feature-badge">${story.feature}</span>
      </div>
      
      <h1>${story.title}</h1>
      <p class="detail-subtitle">${story.subtitle}</p>
      
      <div class="company-info">
        <div class="company-logo"></div>
        <div class="company-details">
          <h2>${story.company.name}</h2>
          <p>${story.company.description}</p>
        </div>
      </div>
      
      <blockquote class="hero-quote">
        <p>"${story.quote.content}"</p>
        <footer>
          <strong>${story.quote.author}</strong>
          <span>${story.quote.role}, ${story.company.name}</span>
        </footer>
      </blockquote>
    </header>
  `;
}

// Render selection process
function renderSelectionProcess(selection) {
  if (!selection) return '';
  
  return `
    <section class="detail-section selection-process">
      <h2>🔍 Selection Process</h2>
      
      <div class="selection-overview">
        <div class="selection-stat">
          <span class="stat-value">${selection.evaluationPeriod}</span>
          <span class="stat-label">Evaluation Period</span>
        </div>
        <div class="selection-stat">
          <span class="stat-value">${selection.evaluatedSolutions.length}</span>
          <span class="stat-label">Solutions Evaluated</span>
        </div>
      </div>
      
      ${selection.evaluatedSolutions ? `
        <div class="evaluated-solutions">
          <h3>Evaluated Solutions</h3>
          <div class="solutions-comparison">
            ${selection.evaluatedSolutions.map(sol => `
              <div class="solution-item ${sol === 'Kira' ? 'selected' : ''}">
                ${sol}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${selection.criteria ? `
        <div class="selection-criteria">
          <h3>Evaluation Criteria</h3>
          <table class="criteria-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>Weight</th>
                <th>Kira Score</th>
                <th>Competitor Avg</th>
              </tr>
            </thead>
            <tbody>
              ${selection.criteria.map(c => `
                <tr>
                  <td>${c.criterion}</td>
                  <td><span class="weight-badge ${c.weight.toLowerCase()}">${c.weight}</span></td>
                  <td class="score kira">${c.kiraScore}/10</td>
                  <td class="score competitor">${c.competitorAvg}/10</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      
      ${selection.decisionFactors ? `
        <div class="decision-factors">
          <h3>Key Decision Factors</h3>
          <ul>
            ${selection.decisionFactors.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${selection.pilotScope ? `
        <div class="pilot-scope">
          <h3>Pilot Scope</h3>
          <p>${selection.pilotScope}</p>
        </div>
      ` : ''}
    </section>
  `;
}

// Render scenario
function renderScenario(scenario) {
  if (!scenario) return '';
  
  return `
    <section class="detail-section scenario">
      <h2>📖 The Challenge</h2>
      
      <div class="scenario-grid">
        <div class="scenario-card background">
          <h3>Background</h3>
          <p>${scenario.background}</p>
        </div>
        
        <div class="scenario-card challenge">
          <h3>The Challenge</h3>
          <p>${scenario.challenge}</p>
        </div>
        
        <div class="scenario-card solution">
          <h3>The Solution</h3>
          <p>${scenario.solution}</p>
        </div>
      </div>
    </section>
  `;
}

// Render implementation
function renderImplementation(impl) {
  if (!impl) return '';
  
  return `
    <section class="detail-section implementation">
      <h2>🚀 Implementation Journey</h2>
      
      <div class="implementation-timeline">
        ${impl.phases.map((phase, index) => `
          <div class="impl-phase">
            <div class="phase-marker">
              <span class="phase-number">${index + 1}</span>
              ${index < impl.phases.length - 1 ? '<span class="phase-line"></span>' : ''}
            </div>
            <div class="phase-content">
              <div class="phase-header">
                <h3>${phase.phase}</h3>
                <span class="phase-duration">${phase.duration}</span>
              </div>
              <ul class="phase-activities">
                ${phase.activities.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="implementation-summary">
        <div class="summary-item">
          <span class="summary-label">Total Duration</span>
          <span class="summary-value">${impl.totalDuration}</span>
        </div>
      </div>
    </section>
  `;
}

// Render results
function renderResults(results) {
  if (!results) return '';
  
  return `
    <section class="detail-section results">
      <h2>📊 Results & Impact</h2>
      
      <div class="metrics-grid">
        ${results.metrics.map(m => `
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">${m.metric}</span>
              <span class="metric-improvement-badge">${m.improvement}</span>
            </div>
            <div class="metric-values">
              <div class="metric-before">
                <span class="label">Before</span>
                <span class="value">${m.before}</span>
              </div>
              <div class="metric-arrow">→</div>
              <div class="metric-after">
                <span class="label">After</span>
                <span class="value">${m.after}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${results.qualitativeOutcomes ? `
        <div class="qualitative-outcomes">
          <h3>Qualitative Impact</h3>
          <ul>
            ${results.qualitativeOutcomes.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${results.roi ? `
        <div class="roi-section">
          <h3>Return on Investment</h3>
          <div class="roi-grid">
            <div class="roi-card">
              <span class="roi-value">${results.roi.annualSavings}</span>
              <span class="roi-label">Annual Savings</span>
            </div>
            <div class="roi-card">
              <span class="roi-value">${results.roi.implementationCost}</span>
              <span class="roi-label">Implementation Cost</span>
            </div>
            <div class="roi-card highlight">
              <span class="roi-value">${results.roi.paybackPeriod}</span>
              <span class="roi-label">Payback Period</span>
            </div>
            <div class="roi-card">
              <span class="roi-value">${results.roi.threeYearRoi}</span>
              <span class="roi-label">3-Year ROI</span>
            </div>
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

// Render multi-role perspectives
function renderMultiRolePerspectives(perspectives) {
  if (!perspectives || perspectives.length === 0) return '';
  
  return `
    <section class="detail-section perspectives">
      <h2>💬 Perspectives</h2>
      
      <div class="perspectives-grid">
        ${perspectives.map(p => `
          <div class="perspective-card">
            <div class="perspective-header">
              <div class="perspective-avatar"></div>
              <div class="perspective-meta">
                <span class="perspective-role">${p.role}</span>
                <span class="perspective-name">${p.name}</span>
              </div>
            </div>
            <blockquote>${p.quote}</blockquote>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// Render lessons learned
function renderLessonsLearned(lessons) {
  if (!lessons || lessons.length === 0) return '';
  
  return `
    <section class="detail-section lessons">
      <h2>💡 Lessons Learned</h2>
      
      <div class="lessons-list">
        ${lessons.map((lesson, index) => `
          <div class="lesson-item">
            <span class="lesson-number">${index + 1}</span>
            <p>${lesson}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// Render detail footer
function renderDetailFooter(story) {
  return `
    <footer class="detail-footer-section">
      <div class="footer-cta">
        <h3>Ready to achieve similar results?</h3>
        <p>See how Kira can transform your ${story.industry.toLowerCase()} operations.</p>
        <div class="cta-buttons">
          <a href="https://kira.keyreply.com/demo" class="btn-primary">Request Demo</a>
          <a href="https://docs.kira.keyreply.com" class="btn-secondary">View Documentation</a>
        </div>
      </div>
      
      <div class="story-meta-footer">
        <span>Published ${new Date(story.publishedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        <span class="separator">•</span>
        <span>${story.feature}</span>
      </div>
    </footer>
  `;
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStoryDetail();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initStories);
