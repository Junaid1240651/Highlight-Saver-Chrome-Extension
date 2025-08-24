chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHighlights') {
    chrome.storage.local.get(['highlights'], (result) => {
      sendResponse({ highlights: result.highlights || [] });
    });
    return true;
  }
  
  if (request.action === 'saveHighlight') {
    chrome.storage.local.get(['highlights'], (result) => {
      try {
        const highlights = result.highlights || [];
        highlights.unshift(request.highlight);
        
        chrome.storage.local.set({ highlights }, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true });
          }
        });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    });
    return true;
  }
  
  if (request.action === 'deleteHighlight') {
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || [];
      const updatedHighlights = highlights.filter(h => h.id !== request.highlightId);
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
