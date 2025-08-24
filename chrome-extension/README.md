# Website Highlight Saver Chrome Extension

A powerful Chrome extension that allows users to highlight text on any webpage, save highlights locally, and get AI-powered summaries using OpenAI's API.

## Features

✨ **Text Highlighting**: Select any text on a webpage and save it with a simple popup
📚 **Local Storage**: All highlights are saved locally in your browser
🔍 **Search & Filter**: Search through your saved highlights
🤖 **AI Summarization**: Get concise summaries of your highlights using OpenAI GPT
🗑️ **Easy Management**: Delete individual highlights or clear all at once
🔗 **Quick Access**: Visit the original page where you saved a highlight
📱 **Responsive Design**: Clean, modern interface that works seamlessly

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
2. Enter your OpenAI API key (get one from https://platform.openai.com/api-keys)
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
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js              # React-based popup logic (compiled)
├── popup-src.js          # Source React code for popup
├── content.js            # Content script for webpage interaction
├── content.css           # Styles for webpage elements
├── background.js         # Service worker for background tasks
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## Technical Details

### Technologies Used

- **React 18**: For the popup interface
- **Chrome Extensions Manifest V3**: Latest extension standard
- **Chrome Storage API**: For local data persistence
- **OpenAI API**: For AI-powered summarization
- **Vanilla JavaScript**: For content scripts and background tasks

### Key Features Implementation

1. **Text Selection Detection**: Uses `window.getSelection()` to detect selected text
2. **Local Storage**: Chrome's `chrome.storage.local` API for persistent storage
3. **Cross-Page Highlighting**: Content script injection on all pages
4. **AI Integration**: Direct API calls to OpenAI's GPT models
5. **Responsive UI**: CSS Grid and Flexbox for adaptive layouts

### Permissions Explained

- `storage`: To save highlights locally
- `activeTab`: To access the current webpage content
- `scripting`: To inject content scripts for highlighting
- `host_permissions`: To work on all websites

## API Configuration

To use the AI summarization feature:

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Click the "🔑 API Key" button in the extension popup
3. Enter your API key (it's stored locally and encrypted)
4. Start using the summarization features

**Note**: API usage will incur costs based on OpenAI's pricing. The extension uses GPT-3.5-turbo for cost-effectiveness.

## Development

### Setup Development Environment

```bash
npm install
npm run dev  # Watches for changes and rebuilds
```

### Building for Production

```bash
npm run build
```

### Testing

1. Load the extension in Chrome
2. Test on various websites
3. Try different text selections
4. Verify storage persistence across browser restarts

## Privacy & Security

- All highlights are stored locally in your browser
- No data is sent to external servers except for AI summarization
- OpenAI API key is stored locally and never transmitted to other services
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
