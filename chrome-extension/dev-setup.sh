#!/bin/bash

# Development script for Website Highlight Saver Chrome Extension

echo "🚀 Website Highlight Saver - Development Setup"
echo "============================================="

# Check if Chrome is available
if command -v google-chrome >/dev/null 2>&1; then
    CHROME_COMMAND="google-chrome"
elif command -v google-chrome-stable >/dev/null 2>&1; then
    CHROME_COMMAND="google-chrome-stable"
elif command -v chromium >/dev/null 2>&1; then
    CHROME_COMMAND="chromium"
else
    echo "❌ Chrome not found. Please install Chrome or Chromium."
    exit 1
fi

echo "✅ Chrome found: $CHROME_COMMAND"

# Current directory
EXTENSION_DIR="$(pwd)"
echo "📁 Extension directory: $EXTENSION_DIR"

echo ""
echo "📋 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked' and select this directory:"
echo "   $EXTENSION_DIR"
echo ""
echo "🔧 To open Chrome extensions page directly, run:"
echo "   $CHROME_COMMAND --new-window chrome://extensions/"
echo ""
echo "🌐 Test the extension on any website by:"
echo "   • Selecting text on a webpage"
echo "   • Clicking 'Save Highlight' in the popup"
echo "   • Opening extension popup from toolbar"
echo ""
echo "🔧 Debug the extension:"
echo "   • Open debug-test.html in Chrome to test functionality"
echo "   • Open DevTools (F12) and check Console for logs"
echo "   • Look for messages starting with 'HighlightManager:'"
echo "   • Check chrome://extensions/ for any error badges"
echo ""
echo "🤖 For AI features:"
echo "   • Get Google Gemini API key from https://aistudio.google.com/app/apikey"
echo "   • Enter it in the extension popup"
echo ""
echo "🐛 If the save button isn't working:"
echo "   1. Check browser console for errors"
echo "   2. Verify extension is loaded in chrome://extensions/"
echo "   3. Try reloading the extension"
echo "   4. Test on debug-test.html first"
echo ""
echo "Happy highlighting! 📝✨"
