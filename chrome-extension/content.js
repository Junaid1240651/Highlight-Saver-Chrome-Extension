class HighlightManager {
  constructor() {
    this.selectedText = '';
    this.selectionRange = null;
    this.popup = null;
    this.init();
  }

  init() {
    document.addEventListener('mouseup', this.handleTextSelection.bind(this), true);
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
  }

  handleMouseDown(event) {
    // Don't hide popup if clicking on the popup itself or its children
    if (this.popup && (this.popup.contains(event.target) || event.target.closest('.highlight-saver-popup'))) {
      return;
    }
    this.hidePopup();
  }

  handleTextSelection(event) {
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (selectedText.length > 0 && selectedText.length < 1000) {
        this.selectedText = selectedText;
        
        if (selection.rangeCount > 0) {
          this.selectionRange = selection.getRangeAt(0).cloneRange();
        }
        
        this.showHighlightPopup(event.pageX, event.pageY);
      } else {
        this.hidePopup();
      }
    }, 10);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.hidePopup();
    }
  }

  showHighlightPopup(x, y) {
    this.hidePopup();

    this.popup = document.createElement('div');
    this.popup.className = 'highlight-saver-popup';
    this.popup.style.cssText = `
      position: fixed !important;
      z-index: 999999 !important;
      background: white !important;
      border: 2px solid #2563eb !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
      padding: 0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      pointer-events: auto !important;
      user-select: none !important;
      left: ${Math.min(x, window.innerWidth - 200)}px !important;
      top: ${Math.max(y - 60, 10)}px !important;
    `;
    
    this.popup.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; padding: 8px;">
        <button id="save-highlight-btn" style="
          background: #2563eb !important;
          color: white !important;
          border: none !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        " onmousedown="event.stopPropagation();">
          💾 Save Highlight
        </button>
        <button id="cancel-highlight-btn" style="
          background: #f3f4f6 !important;
          color: #6b7280 !important;
          border: none !important;
          padding: 6px 8px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 14px !important;
        " onmousedown="event.stopPropagation();">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(this.popup);

    const saveBtn = this.popup.querySelector('#save-highlight-btn');
    const cancelBtn = this.popup.querySelector('#cancel-highlight-btn');
    
    if (saveBtn) {
      saveBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        saveBtn.textContent = '💾 Saving...';
        saveBtn.disabled = true;
        
        this.saveHighlight().catch(() => {
          saveBtn.textContent = '❌ Error';
          setTimeout(() => {
            saveBtn.textContent = '💾 Save Highlight';
            saveBtn.disabled = false;
          }, 2000);
        });
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hidePopup();
      });
    }

    setTimeout(() => {
      if (this.popup) {
        this.hidePopup();
      }
    }, 10000);
  }

  hidePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  async saveHighlight() {
    if (!this.selectedText || !this.selectionRange) {
      this.showErrorMessage('No text selected. Please select some text first.');
      return;
    }

    const highlight = {
      id: Date.now().toString(),
      text: this.selectedText,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      context: this.getContext()
    };

    try {
      if (!chrome || !chrome.runtime) {
        throw new Error('Chrome extension runtime not available');
      }

      const response = await chrome.runtime.sendMessage({
        action: 'saveHighlight',
        highlight: highlight
      });
      
      if (response && response.success) {
        this.applyHighlightStyling();
        this.showSuccessMessage();
        this.hidePopup();
      } else {
        throw new Error(response?.error || 'Failed to save highlight');
      }
    } catch (error) {
      this.showErrorMessage('Error saving highlight: ' + error.message);
    }
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'highlight-error-message';
    errorDiv.textContent = '❌ ' + message;
    errorDiv.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #dc2626 !important;
      color: white !important;
      padding: 10px 20px !important;
      border-radius: 5px !important;
      z-index: 1000000 !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
      max-width: 300px !important;
    `;

    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv && errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  getContext() {
    if (!this.selectionRange) return '';
    
    const container = this.selectionRange.commonAncestorContainer;
    const textContainer = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
    
    // Get surrounding text for context
    const fullText = textContainer.textContent || '';
    const selectedText = this.selectedText;
    const index = fullText.indexOf(selectedText);
    
    if (index === -1) return fullText.substring(0, 100);
    
    const start = Math.max(0, index - 50);
    const end = Math.min(fullText.length, index + selectedText.length + 50);
    
    return fullText.substring(start, end);
  }

  applyHighlightStyling() {
    if (!this.selectionRange) return;

    try {
      const span = document.createElement('span');
      span.className = 'highlight-saver-highlighted';
      span.style.cssText = `
        background-color: #fef08a !important;
        padding: 1px 2px !important;
        border-radius: 2px !important;
      `;
      
      this.selectionRange.surroundContents(span);
    } catch (error) {
      window.getSelection().removeAllRanges();
    }
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'highlight-success-message';
    message.textContent = '✓ Highlight saved!';
    message.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #4caf50 !important;
      color: white !important;
      padding: 10px 20px !important;
      border-radius: 5px !important;
      z-index: 1000000 !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
    `;

    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message && message.parentNode) {
        message.remove();
      }
    }, 3000);
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HighlightManager();
  });
} else {
  new HighlightManager();
}