// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeChessGame",
    title: "Analyze",
    contexts: ["page"],
    documentUrlPatterns: ["https://www.chess.com/*"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeChessGame") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: triggerShareButton
    });
  }
});

// Function to be injected into the page
function triggerShareButton() {
  // Find and click the share button using the specific selector
  const shareButton = document.querySelector('#board-layout-sidebar > div.sidebar-component > div.live-game-buttons-component > button.icon-font-chess.share.live-game-buttons-button');
  if (shareButton) {
    shareButton.click();
    // Wait for the modal to appear and then click the first tab
    setTimeout(() => {
      const firstTab = document.querySelector('#share-modal > div > div.cc-modal-body.cc-modal-lg > div > header > div.share-menu-tab-selector-component > div:nth-child(1)');
      if (firstTab) {
        firstTab.click();
        // Wait for the PGN content to load and then click the copy button
        setTimeout(() => {
          const copyButton = document.querySelector('#share-modal > div > div.cc-modal-body.cc-modal-lg > div > section > div > div:nth-child(2) > div.share-menu-tab-pgn-pgn-wrapper > button > span');
          if (copyButton) {
            copyButton.click();
            // Wait for clipboard to be updated, then open Lichess in new tab
            setTimeout(() => {
              // Open Lichess analysis in new tab
              window.open('https://lichess.org/analysis', '_blank');
            }, 500);
          } else {
            console.log('Copy button not found');
          }
        }, 500); // Wait 500ms for the PGN content to load
      } else {
        console.log('First tab not found');
      }
    }, 500); // Wait 500ms for the modal to appear
  } else {
    console.log('Share button not found');
  }
}

// Function to handle Lichess page
function handleLichessPage() {
  // Wait for the textarea to be available
  setTimeout(() => {
    const pgnTextarea = document.querySelector('#main-wrap > main > div.analyse__underboard > div > div.pgn > div > textarea');
    if (pgnTextarea) {
      // Get clipboard content and paste it
      navigator.clipboard.readText().then(text => {
        pgnTextarea.value = text;
        // Focus on the textarea
        pgnTextarea.focus();
        // Trigger input event to ensure Lichess recognizes the change
        pgnTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        // Find and click the button
        const analyzeButton = document.querySelector('#main-wrap > main > div.analyse__underboard > div > div.pgn > div > button');
        if (analyzeButton) {
          analyzeButton.click();
          // Wait for analysis to start and then enable Stockfish
          setTimeout(() => {
            const stockfishButton = document.querySelector('#main-wrap > main > div.analyse__tools > div.ceval > div > label');
            if (stockfishButton) {
              stockfishButton.click();
            } else {
              console.log('Stockfish button not found');
            }
          }, 1000); // Wait 1 second for analysis to start
        } else {
          console.log('Analyze button not found');
        }
      }).catch(err => {
        console.log('Failed to read clipboard:', err);
      });
    } else {
      console.log('PGN textarea not found');
    }
  }, 1000); // Wait 1 second for the page to load
}

// Listen for navigation to Lichess
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url.includes('lichess.org/analysis')) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      function: handleLichessPage
    });
  }
}); 