// We no longer need to handle the Lichess page interaction since we're using the direct URL approach
// which automatically processes the PGN data through the URL

// Background script for Chess.com Analysis Helper
console.log("Chess.com Analysis Helper background script loaded");

// Function to handle Lichess page interaction
function handleLichessPage(tabId) {
  // Wait a bit for the page to fully load
  setTimeout(() => {
    // Inject a script to click the necessary buttons
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        // Wait for the page to fully load
        setTimeout(() => {
          // Click the "Request computer analysis" checkbox
          const analysisCheckbox = document.querySelector('#main-wrap > main > form > div.form-check.form-group > div > span > label');
          if (analysisCheckbox) {
            analysisCheckbox.click();
            console.log('Clicked analysis checkbox');
          } else {
            console.log('Analysis checkbox not found');
          }
          
          // Click the "Import game" button
          const importButton = document.querySelector('#main-wrap > main > form > div.form-actions.single > button');
          if (importButton) {
            importButton.click();
            console.log('Clicked import button');
          } else {
            console.log('Import button not found');
          }
        }, 1000);  // Wait 1 second for the page to fully load
      }
    });
  }, 500);  // Wait 0.5 second before injecting the script
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openLichessWithPGN') {
    // Open the URL in a new tab
    chrome.tabs.create({ url: message.url }, (tab) => {
      // Handle the new tab with the Lichess page
      handleLichessPage(tab.id);
    });
    return true;  // Keep the message channel open for async response
  }
});

// Also keep the navigation listener for backup
chrome.webNavigation.onCompleted.addListener((details) => {
  // If we detect navigation to a lichess.org/paste URL, try to inject our script
  if (details.url.includes('lichess.org/paste')) {
    handleLichessPage(details.tabId);
  }
}); 