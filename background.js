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