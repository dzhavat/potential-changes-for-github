chrome.webNavigation.onHistoryStateUpdated.addListener(function() {
  chrome.tabs.executeScript(null, { file: 'content.js' });
}, { url: [{ hostEquals: 'github.com' }] });
