// This file will be used for any page-specific functionality
// Currently empty as we're handling everything in the background script
console.log('Chess.com Analysis Helper content script loaded');

// Function to help find the share button
function findShareButton() {
    // Log all buttons on the page
    const buttons = document.querySelectorAll('button');
    console.log('All buttons found:', buttons.length);
    buttons.forEach((button, index) => {
        console.log(`Button ${index}:`, {
            text: button.textContent,
            id: button.id,
            class: button.className,
            dataAttributes: Object.keys(button.dataset),
            html: button.outerHTML
        });
    });

    // Also look for elements with 'share' in their text or attributes
    const shareElements = document.querySelectorAll('*');
    shareElements.forEach((element, index) => {
        const className = element.className;
        const classNameStr = typeof className === 'string' ? className : className.toString();
        
        if (element.textContent.toLowerCase().includes('share') || 
            classNameStr.toLowerCase().includes('share') ||
            (element.id && element.id.toLowerCase().includes('share'))) {
            console.log(`Share-related element ${index}:`, {
                tag: element.tagName,
                text: element.textContent,
                id: element.id,
                class: classNameStr,
                html: element.outerHTML
            });
        }
    });
}

// Run the function when the page loads
findShareButton();

// Function to create and add the analyze button
function addAnalyzeButton() {
  // Check if we're on a game page by looking for the share button
  const shareButton = document.querySelector('#board-layout-sidebar > div.sidebar-component > div.live-game-buttons-component > button.icon-font-chess.share.live-game-buttons-button');
  
  if (shareButton) {
    // Only add the button if it doesn't already exist
    if (!document.querySelector('.chess-analysis-button')) {
      const button = document.createElement('button');
      button.className = 'chess-analysis-button';
      button.textContent = 'Analyze on Lichess';
      button.addEventListener('click', triggerShareButton);
      document.body.appendChild(button);
    }
  }
}

// Function to trigger the share button and analysis process
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
            // Wait for clipboard to be updated, then close the modal and open Lichess
            setTimeout(() => {
              // Close the share modal popup
              const closeButton = document.querySelector('#share-modal > div > div.cc-modal-body.cc-modal-lg > button > div');
              if (closeButton) {
                closeButton.click();
                // Wait a moment for the modal to close, then open Lichess
                setTimeout(() => {
                  // Open Lichess analysis in new tab
                  window.open('https://lichess.org/analysis', '_blank');
                }, 300);
              } else {
                console.log('Close button not found');
                // Fallback: open Lichess even if we couldn't close the modal
                window.open('https://lichess.org/analysis', '_blank');
              }
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

// Add the button when the page loads
addAnalyzeButton();

// Also check for the share button when the page content changes
// This helps with dynamic page loading
const observer = new MutationObserver(() => {
  addAnalyzeButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
}); 