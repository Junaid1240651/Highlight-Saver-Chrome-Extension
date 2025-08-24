// Vanilla JavaScript popup for the Chrome extension

// Global state
let highlights = [];
let apiKey = '';
let loading = true;
let summarizing = false;
let searchTerm = '';

// DOM elements
let elements = {};

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);

function initializePopup() {
  // Get DOM elements
  elements = {
    headerStats: document.getElementById('header-stats'),
    searchSection: document.getElementById('search-section'),
    searchInput: document.getElementById('search-input'),
    actionButtons: document.getElementById('action-buttons'),
    summarizeAllBtn: document.getElementById('summarize-all-btn'),
    apiKeyBtn: document.getElementById('api-key-btn'),
    clearAllBtn: document.getElementById('clear-all-btn'),
    apiKeySection: document.getElementById('api-key-section'),
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiKeyBtn: document.getElementById('save-api-key-btn'),
    cancelApiKeyBtn: document.getElementById('cancel-api-key-btn'),
    summarySection: document.getElementById('summary-section'),
    summaryContent: document.getElementById('summary-content'),
    closeSummaryBtn: document.getElementById('close-summary-btn'),
    loadingDiv: document.getElementById('loading'),
    highlightsList: document.getElementById('highlights-list')
  };

  // Add event listeners
  setupEventListeners();
  
  // Load initial data
  loadHighlights();
}

function setupEventListeners() {
  elements.searchInput.addEventListener('input', handleSearch);
  elements.summarizeAllBtn.addEventListener('click', () => summarizeHighlights());
  elements.apiKeyBtn.addEventListener('click', toggleApiKeySection);
  elements.clearAllBtn.addEventListener('click', clearAllHighlights);
  elements.saveApiKeyBtn.addEventListener('click', saveApiKey);
  elements.cancelApiKeyBtn.addEventListener('click', () => toggleApiKeySection(false));
  elements.closeSummaryBtn.addEventListener('click', closeSummary);
}

// Utility functions
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function truncateText(text, maxLength = 100) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

async function loadHighlights() {
  try {
    const result = await chrome.storage.local.get(['highlights', 'geminiApiKey']);
    highlights = result.highlights || [];
    apiKey = result.geminiApiKey || '';
    elements.apiKeyInput.value = apiKey;
    loading = false;
    elements.loadingDiv.style.display = 'none';
    updateUI();
  } catch (error) {
    loading = false;
    elements.loadingDiv.style.display = 'none';
    updateUI();
  }
}

// Update the UI based on current state
function updateUI() {
  const filteredHighlights = getFilteredHighlights();
  
  // Update header stats
  elements.headerStats.textContent = `${highlights.length} highlight${highlights.length !== 1 ? 's' : ''}`;
  
  // Show/hide sections based on highlights count
  if (highlights.length > 0) {
    elements.searchSection.style.display = 'block';
    elements.actionButtons.style.display = 'flex';
  } else {
    elements.searchSection.style.display = 'none';
    elements.actionButtons.style.display = 'none';
  }
  
  // Render highlights list
  renderHighlightsList(filteredHighlights);
}

// Get filtered highlights based on search term
function getFilteredHighlights() {
  if (!searchTerm) return highlights;
  
  return highlights.filter(highlight => 
    highlight.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    highlight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    highlight.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Render the highlights list
function renderHighlightsList(filteredHighlights) {
  const container = elements.highlightsList;
  container.innerHTML = '';
  
  if (filteredHighlights.length === 0) {
    if (highlights.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No highlights yet</h3>
          <p>Select text on any webpage and click "Save Highlight" to get started!</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try a different search term.</p>
        </div>
      `;
    }
    return;
  }
  
  filteredHighlights.forEach(highlight => {
    const highlightElement = createHighlightElement(highlight);
    container.appendChild(highlightElement);
  });
}

// Create a highlight element
function createHighlightElement(highlight) {
  const div = document.createElement('div');
  div.className = 'highlight-item';
  div.dataset.id = highlight.id;
  
  const isExpanded = false; // Initially collapsed
  
  div.innerHTML = `
    <div class="highlight-header">
      <div class="highlight-meta">
        <span class="highlight-date">${formatDate(highlight.timestamp)}</span>
        <span class="highlight-domain">${new URL(highlight.url).hostname}</span>
      </div>
      <div class="highlight-actions">
        <button class="expand-btn" title="${isExpanded ? 'Collapse' : 'Expand'}">
          ${isExpanded ? '▼' : '▶'}
        </button>
        <button class="delete-btn" title="Delete highlight">✕</button>
      </div>
    </div>
    <div class="highlight-content">
      <div class="highlight-text">${highlight.text.length > 150 ? truncateText(highlight.text, 150) : highlight.text}</div>
      <div class="highlight-details" style="display: none;">
        <div class="highlight-title"><strong>Page:</strong> ${highlight.title}</div>
        ${highlight.context ? `<div class="highlight-context"><strong>Context:</strong> ${highlight.context}</div>` : ''}
        <div class="highlight-buttons">
          <button class="visit-btn">Visit Page</button>
          <button class="summarize-btn">Summarize</button>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners to buttons
  const expandBtn = div.querySelector('.expand-btn');
  const deleteBtn = div.querySelector('.delete-btn');
  const visitBtn = div.querySelector('.visit-btn');
  const summarizeBtn = div.querySelector('.summarize-btn');
  const highlightText = div.querySelector('.highlight-text');
  const highlightDetails = div.querySelector('.highlight-details');
  
  expandBtn.addEventListener('click', () => {
    const isCurrentlyExpanded = highlightDetails.style.display !== 'none';
    if (isCurrentlyExpanded) {
      highlightDetails.style.display = 'none';
      expandBtn.textContent = '▶';
      expandBtn.title = 'Expand';
      highlightText.innerHTML = truncateText(highlight.text, 150);
    } else {
      highlightDetails.style.display = 'block';
      expandBtn.textContent = '▼';
      expandBtn.title = 'Collapse';
      highlightText.innerHTML = highlight.text;
    }
  });
  
  deleteBtn.addEventListener('click', () => deleteHighlight(highlight.id));
  visitBtn.addEventListener('click', () => visitPage(highlight.url));
  summarizeBtn.addEventListener('click', () => {
    summarizeBtn.textContent = '⏳ Summarizing...';
    summarizeBtn.disabled = true;
    summarizeHighlights([highlight]).finally(() => {
      summarizeBtn.textContent = '🤖 Summarize';
      summarizeBtn.disabled = false;
    });
  });
  
  return div;
}

// Event handlers
function handleSearch(event) {
  searchTerm = event.target.value;
  updateUI();
}

function toggleApiKeySection(show = null) {
  const isVisible = elements.apiKeySection.style.display !== 'none';
  const shouldShow = show !== null ? show : !isVisible;
  elements.apiKeySection.style.display = shouldShow ? 'block' : 'none';
}

function closeSummary() {
  elements.summarySection.style.display = 'none';
}

// Action functions
async function deleteHighlight(highlightId) {
  highlights = highlights.filter(h => h.id !== highlightId);
  await chrome.storage.local.set({ highlights });
  updateUI();
}

function visitPage(url) {
  chrome.tabs.create({ url });
}

async function clearAllHighlights() {
  if (confirm('Are you sure you want to delete all highlights?')) {
    highlights = [];
    await chrome.storage.local.set({ highlights: [] });
    updateUI();
  }
}

async function saveApiKey() {
  apiKey = elements.apiKeyInput.value;
  await chrome.storage.local.set({ geminiApiKey: apiKey });
  toggleApiKeySection(false);
}

async function summarizeHighlights(highlightsToSummarize = highlights) {
  if (!apiKey) {
    toggleApiKeySection(true);
    return;
  }
  
  if (highlightsToSummarize.length === 0) {
    alert('No highlights to summarize');
    return;
  }
  
  summarizing = true;
  elements.summarizeAllBtn.disabled = true;
  elements.summarizeAllBtn.textContent = '⏳ Summarizing...';
  
  try {
    const highlightTexts = highlightsToSummarize
      .map(h => `"${h.text}" (from ${h.title})`)
      .join('\n\n');
    
    const isSingleHighlight = highlightsToSummarize.length === 1;
    const prompt = isSingleHighlight 
      ? `Summarize this highlight in 2-3 concise sentences, focusing on the key information:\n\n${highlightTexts}`
      : `Create numbered individual summaries for each highlight. For each person or topic mentioned, write a number followed by their name and a colon, then 2-3 concise sentences about them. Format like "1. Name: summary sentences" and "2. Name: summary sentences". Do not use bullet points or complex structures:\n\n${highlightTexts}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },      
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: isSingleHighlight ? 200 : 500,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;
    
    // Format the summary with better line breaks and structure
    const formattedSummary = summary
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic text
      .replace(/\n\n/g, '</p><p>')                       // Paragraph breaks
      .replace(/\n/g, '<br>');                           // Line breaks
    
    elements.summaryContent.innerHTML = `<p>${formattedSummary}</p>`;
    elements.summarySection.style.display = 'block';
    
  } catch (error) {
    elements.summaryContent.textContent = 'Error generating summary. Please check your API key and try again.';
    elements.summarySection.style.display = 'block';
  } finally {
    summarizing = false;
    elements.summarizeAllBtn.disabled = false;
    elements.summarizeAllBtn.textContent = '🤖 Summarize All';
  }
}
