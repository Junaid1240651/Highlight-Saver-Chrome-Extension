# Website Highlight Saver Chrome Extension

A powerful Chrome extension that allows users to highlight text on any webpage, save highlights locally, and get AI-powered summaries using Google Gemini.

## Features

✨ **Text Highlighting**: Select any text on a webpage and save it with a simple popup
📚 **Local Storage**: All highlights are saved locally in your browser
🔍 **Search & Filter**: Search through your saved highlights
🤖 **AI Summarization**: Get concise summaries of your highlights using Google Gemini (API key required)
🗑️ **Easy Management**: Delete individual highlights or clear all at once
🔗 **Quick Access**: Visit the original page where you saved a highlight
📱 **Modern UI**: Clean, responsive popup interface

## Installation

### Option 1: Load as Unpacked Extension (Development)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

### Option 2: Load as Development Extension

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chrome-extension
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension folder
   - The extension icon should appear in your Chrome toolbar

> **Note**: This extension now uses vanilla JavaScript instead of React, so no build process is required!

## Usage

### Saving Highlights

1. Navigate to any webpage
2. Select the text you want to highlight
3. A popup will appear near your selection with "Save Highlight" button
4. Click the button to save the highlight
5. The text will be highlighted on the page and saved locally

### Viewing Saved Highlights

1. Click the extension icon in the Chrome toolbar
2. View all your saved highlights in a scrollable list
3. Use the search bar to find specific highlights
4. Click on highlights to expand and see more details

### AI Summarization

1. Click the "🔑 API Key" button in the popup
2. Enter your Google Gemini API key (get one from https://aistudio.google.com/app/apikey)
3. Use "🤖 Summarize All" to get a summary of all highlights
4. Or click "🤖 Summarize" on individual highlights

### Managing Highlights

- **Delete**: Click the 🗑️ button on any highlight
- **Visit Page**: Click "🔗 Visit Page" to open the original webpage
- **Clear All**: Use the "🗑️ Clear All" button to delete all highlights
- **Search**: Type in the search box to filter highlights

## File Structure

```
chrome-extension/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Popup logic (vanilla JS)
├── content.js          # Content script for webpage interaction
├── content.css         # Styles for content script elements
├── background.js       # Service worker for background tasks
├── icons.json          # Icon references
├── package.json        # Metadata
├── dev-setup.sh        # Development setup script
└── README.md           # This file
```

## Technical Details

### Technologies Used

- **Vanilla JavaScript**: Used for all scripts
- **Chrome Extensions Manifest V3**: Latest extension standard
- **Chrome Storage API**: For local data persistence
- **Google Gemini API**: For AI-powered summarization
- **Responsive UI**: Modern CSS for popup and content script

### Key Features Implementation

1. **Text Selection Detection**: Uses `window.getSelection()` to detect selected text
2. **Local Storage**: Chrome's `chrome.storage.local` API for persistent storage
3. **Cross-Page Highlighting**: Content script injection on all pages
4. **AI Integration**: Direct API calls to Google Gemini
5. **Responsive UI**: CSS Grid and Flexbox for adaptive layouts

### Permissions Explained

- `storage`: To save highlights locally
- `activeTab`: To access the current webpage content
- `scripting`: To inject content scripts for highlighting
- `host_permissions`: To work on all websites

## API Configuration

To use AI summarization:

1. Get a Google Gemini API key from https://aistudio.google.com/app/apikey
2. Click the "🔑 API Key" button in the extension popup
3. Enter your API key (stored locally)
4. Start using the summarization features

## Development

### Development

- No build process required (vanilla JS)
- For development setup, see `dev-setup.sh` for instructions.

### Testing

1. Load the extension in Chrome
2. Test on various websites
3. Try different text selections
4. Verify storage persistence across browser restarts

## Privacy & Security

- All highlights are stored locally in your browser
- No data is sent to external servers except for AI summarization
-- Your API key is stored locally and never transmitted elsewhere
- The extension only accesses webpage content when you interact with it

## Troubleshooting

### Extension not working on some sites
- Some websites may block content script injection
- Try refreshing the page after installing the extension

### Highlights not saving
- Check if the extension has proper permissions
- Ensure you're not in incognito mode (unless enabled for incognito)

### AI summarization not working
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you have internet connectivity

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Happy highlighting! 📝✨**
