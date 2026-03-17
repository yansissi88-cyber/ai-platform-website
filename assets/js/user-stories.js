/**
 * User Stories Page JavaScript
 * Handles data loading, filtering, and rendering of user stories
 */

// State management
let storiesData = { stories: [], personas: [], industries: [] };
let filteredStories = [];
let filters = {
  persona: 'all',
  industry: 'all',
  feature: 'all'
};

// Persona emoji mapping
const PERSONA_EMOJIS = {
  'Support Manager': '👨‍💼',
  'Sales Director': '💼',
  'Operations Lead': '📊',
  'IT Administrator': '⚙️',
  'Product Manager': '📱',
  'Customer Success': '🤝'
};

// DOM Elements
const elements = {
  storiesGrid: document.getElementById('storiesGrid'),
  lastUpdated: document.getElementById('lastUpdated'),
  totalStories: document.getElementById('totalStories'),
  totalIndustries: document.getElementById('totalIndustries'),
  avgImprovement: document.getElementById('avgImprovement'),
  personaFilter: document.getElementById('personaFilter'),
  industryFilter: document.getElementById('industryFilter'),
  featureFilter: document.getElementById('featureFilter'),
  emptyState: document.getElementById('emptyState'),
  storyModal: document.getElementById('storyModal'),
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

// Load user stories data
async function loadData() {
  try {
    const response = await fetch('data/user-stories.json');
    if (!response.ok) throw new Error('Failed to load user stories data');
    
    storiesData = await response.json();
    filteredStories = [...storiesData.stories];
    
    // Update last updated text
    const date = new Date(storiesData.lastUpdated);
    elements.lastUpdated.textContent = `Updated: ${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Populate filters
    populateFilters();
    
    // Render stories
    renderStories();
  } catch (error) {
    console.error('Error loading user stories data:', error);
    elements.storiesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Failed to load data</h3>
        <p>Please refresh the page to try again</p>
      </div>
    `;
  }
}

// Populate filter options
function populateFilters() {
  // Persona filter
  storiesData.personas.forEach(persona => {
    const option = document.createElement('option');
    option.value = persona;
    option.textContent = persona;
    elements.personaFilter.appendChild(option);
  });
  
  // Industry filter
  storiesData.industries.forEach(industry => {
    const option = document.createElement('option');
    option.value = industry;
    option.textContent = industry;
    elements.industryFilter.appendChild(option);
  });
  
  // Feature filter - extract unique features from stories
  const features = [...new Set(storiesData.stories.map(s => s.feature))];
  features.forEach(feature => {
    const option = document.createElement('option');
    option.value = feature;
    option.textContent = feature;
    elements.featureFilter.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Filter changes
  elements.personaFilter.addEventListener('change', (e) => {
    filters.persona = e.target.value;
    applyFilters();
  });
  
  elements.industryFilter.addEventListener('change', (e) => {
    filters.industry = e.target.value;
    applyFilters();
  });
  
  elements.featureFilter.addEventListener('change', (e) => {
    filters.feature = e.target.value;
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
  filteredStories = storiesData.stories.filter(story => {
    const personaMatch = filters.persona === 'all' || story.persona.name === filters.persona;
    const industryMatch = filters.industry === 'all' || story.tags.includes(filters.industry);
    const featureMatch = filters.feature === 'all' || story.feature === filters.feature;
    
    return personaMatch && industryMatch && featureMatch;
  });
  
  renderStories();
}

// Render stories
function renderStories() {
  if (filteredStories.length === 0) {
    elements.storiesGrid.innerHTML = '';
    elements.emptyState.style.display = 'block';
    return;
  }
  
  elements.emptyState.style.display = 'none';
  
  elements.storiesGrid.innerHTML = filteredStories.map(story => renderStoryCard(story)).join('');
  
  // Add click handlers
  document.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('click', () => {
      const storyId = card.dataset.storyId;
      const story = storiesData.stories.find(s => s.id === storyId);
      if (story) openModal(story);
    });
  });
}

// Render single story card
function renderStoryCard(story) {
  const emoji = PERSONA_EMOJIS[story.persona.name] || '👤';
  
  return `
    <div class="story-card" data-story-id="${story.id}">
      <div class="story-header">
        <div class="story-persona">
          <div class="persona-avatar">${emoji}</div>
          <div class="persona-info">
            <h4>${story.persona.name}</h4>
            <p>${story.persona.company}</p>
          </div>
        </div>
      </div>
      <div class="story-content">
        <h3 class="story-title">${story.title}</h3>
        
        <div class="story-pain-points">
          <div class="pain-point-title">Key Challenges</div>
          <ul class="pain-point-list">
            ${story.persona.painPoints.slice(0, 2).map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        
        <div class="story-quote">
          <p>${story.quote.content.substring(0, 80)}...</p>
          <div class="quote-author">
            ${story.quote.author}
            <span> · ${story.quote.role}</span>
          </div>
        </div>
        
        <div class="story-metrics">
          <div class="metric-box">
            <div class="metric-label">Before</div>
            <div class="metric-value">${story.metrics.before.split(',')[0].split(' ')[0]}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">After</div>
            <div class="metric-value">${story.metrics.after.split(',')[0].split(' ')[0]}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Improvement</div>
            <div class="metric-value improvement">${story.metrics.improvement.split(' ')[1] || '↑'}</div>
          </div>
        </div>
        
        <div class="story-footer">
          <div class="story-tags">
            ${story.tags.slice(0, 2).map(tag => `<span class="story-tag">${tag}</span>`).join('')}
          </div>
          <span class="story-link">Read More →</span>
        </div>
      </div>
    </div>
  `;
}

// Open modal with story details
function openModal(story) {
  const emoji = PERSONA_EMOJIS[story.persona.name] || '👤';
  
  elements.modalBody.innerHTML = `
    <div class="modal-header">
      <div class="story-persona">
        <div class="persona-avatar">${emoji}</div>
        <div class="persona-info">
          <h4>${story.persona.name}</h4>
          <p>${story.persona.company}</p>
        </div>
      </div>
      <h2>${story.title}</h2>
    </div>
    
    <div class="modal-content-inner">
      <div class="scenario-section">
        <h3>📖 The Story</h3>
        <div class="scenario-grid">
          <div class="scenario-box full-width">
            <h4>Background</h4>
            <p>${story.scenario.background}</p>
          </div>
          <div class="scenario-box">
            <h4>Goal</h4>
            <p>${story.scenario.goal}</p>
          </div>
          <div class="scenario-box">
            <h4>Solution</h4>
            <p>${story.scenario.action}</p>
          </div>
          <div class="scenario-box full-width">
            <h4>Results</h4>
            <p>${story.scenario.result}</p>
          </div>
        </div>
      </div>
      
      <div class="metrics-detail">
        <h3>📊 Impact</h3>
        <div class="metrics-comparison">
          <div class="metric-before">
            <h4>Before</h4>
            <p>${story.metrics.before}</p>
          </div>
          <div class="metric-arrow">→</div>
          <div class="metric-after">
            <h4>After</h4>
            <p>${story.metrics.after}</p>
          </div>
        </div>
        <div class="metric-improvement">
          <span>${story.metrics.improvement}</span>
        </div>
      </div>
      
      <div class="modal-quote">
        <p>${story.quote.content}</p>
        <div class="quote-author">
          <strong>${story.quote.author}</strong>
          <span> · ${story.quote.role}</span>
        </div>
      </div>
      
      <div class="scenario-section">
        <h3>🔗 Related</h3>
        <div class="scenario-box full-width">
          <h4>Features Used</h4>
          <p>${story.relatedFeatures.join(' · ')}</p>
        </div>
        <div class="scenario-box full-width">
          <h4>Releases</h4>
          <p>${story.relatedReleases.join(' · ')}</p>
        </div>
      </div>
      
      <div class="modal-actions">
        <a href="timeline.html" class="btn btn-primary">View Timeline</a>
        <a href="roadmap.html" class="btn btn-secondary">View Roadmap</a>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  
  elements.storyModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  elements.storyModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Update statistics
function updateStats() {
  elements.totalStories.textContent = storiesData.stories.length;
  elements.totalIndustries.textContent = storiesData.industries.length;
  
  // Calculate average improvement
  const improvements = storiesData.stories.map(story => {
    const match = story.metrics.improvement.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const avg = improvements.reduce((a, b) => a + b, 0) / improvements.length;
  elements.avgImprovement.textContent = `+${Math.round(avg)}%`;
}

window.closeModal = closeModal;
