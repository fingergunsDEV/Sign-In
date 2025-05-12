// Check if we're in extension context
const isExtension = typeof chrome !== 'undefined' && chrome.tabs;

document.getElementById('openDashboard').addEventListener('click', () => {
  if (isExtension) {
    chrome.tabs.create({ url: 'index.html' });
  } else {
    window.location.href = 'index.html';
  }
});

document.getElementById('openLastCourse').addEventListener('click', async () => {
  if (isExtension) {
    try {
      const result = await chrome.storage.local.get('lastCourse');
      if (result.lastCourse) {
        chrome.tabs.create({ url: `index.html#course/${result.lastCourse}` });
      } else {
        chrome.tabs.create({ url: 'index.html' });
      }
    } catch (error) {
      console.error('Error accessing chrome storage:', error);
      window.location.href = 'index.html';
    }
  } else {
    // Fallback for web context
    const lastCourse = localStorage.getItem('lastCourse');
    if (lastCourse) {
      window.location.href = `index.html#course/${lastCourse}`;
    } else {
      window.location.href = 'index.html';
    }
  }
});