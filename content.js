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

// Function to create and manage the progress indicator
function createProgressIndicator() {
  const progress = document.createElement('div');
  progress.className = 'chess-analysis-progress';
  progress.innerHTML = `
    <span class="progress-text">Preparing analysis...</span>
    <span class="progress-spinner"></span>
  `;
  document.body.appendChild(progress);
  return progress;
}

// Function to update progress text
function updateProgress(progress, text, isError = false) {
  progress.querySelector('.progress-text').textContent = text;
  progress.classList.remove('success', 'error');
  if (isError) {
    progress.classList.add('error');
    progress.querySelector('.progress-spinner').style.display = 'none';
  }
}

// Function to show success state
function showSuccess(progress) {
  progress.classList.add('success');
  progress.querySelector('.progress-spinner').style.display = 'none';
}

// Function to create and add the analyze button
function addAnalyzeButton() {
  // Check if we're on a game page by looking for the share button
  const shareButton = document.querySelector('#board-layout-sidebar > div.sidebar-component > div.live-game-buttons-component > button.icon-font-chess.share.live-game-buttons-button');
  
  if (shareButton) {
    // Only add the button if it doesn't already exist
    if (!document.querySelector('.chess-analysis-button')) {
      const playerComponent = document.querySelector('#board-layout-player-bottom > div.player-component.player-bottom');
      if (playerComponent) {
        const button = document.createElement('button');
        button.className = 'chess-analysis-button';
        button.textContent = 'Analyze on Lichess';
        button.addEventListener('click', triggerShareButton);
        playerComponent.appendChild(button);
      }
    }
  }
}

// Function to trigger the share button and analysis process
function triggerShareButton() {
  const progress = createProgressIndicator();
  progress.classList.add('show');
  
  // Find and click the share button using the specific selector
  const shareButton = document.querySelector('#board-layout-sidebar > div.sidebar-component > div.live-game-buttons-component > button.icon-font-chess.share.live-game-buttons-button');
  
  if (shareButton) {
    updateProgress(progress, 'Opening share menu...');
    shareButton.click();
    
    // Wait for the modal to appear and then click the first tab
    setTimeout(() => {
      const firstTab = document.querySelector('#share-modal > div > div.cc-modal-body.cc-modal-lg > div > header > div.share-menu-tab-selector-component > div:nth-child(1)');
      if (firstTab) {
        updateProgress(progress, 'Extracting game data...');
        firstTab.click();
        
        // Wait for the PGN content to load
        setTimeout(() => {
          // Get the PGN text from the textarea
          const pgnText = document.querySelector('#share-modal > div > div.cc-modal-body.cc-modal-lg > div > section > div > div:nth-child(2) > div.share-menu-tab-pgn-pgn-wrapper > textarea');
          if (pgnText) {
            updateProgress(progress, 'Opening Lichess analysis...');
            // Get the PGN and open Lichess
            const pgn = encodeURIComponent(pgnText.value);
            // Open the URL and notify the background script to inject code
            const lichessURL = `https://lichess.org/paste?pgn=${pgn}`;
            // Store the URL in localStorage so the background script can find it
            localStorage.setItem('lichessAnalysisURL', lichessURL);
            
            // Close the share modal before opening Lichess
            const closeButton = document.querySelector('#share-modal > div > div.cc-modal-body.cc-modal-lg > button > div');
            if (closeButton) {
              closeButton.click();
            }
            
            // Show success state briefly before opening Lichess
            showSuccess(progress);
            progress.querySelector('.progress-text').textContent = 'Analysis ready!';
            
            // Open the URL in a new tab
            chrome.runtime.sendMessage({ action: 'openLichessWithPGN', url: lichessURL });
            
            // Remove the progress indicator after a short delay
            setTimeout(() => {
              progress.remove();
            }, 2000);
          } else {
            updateProgress(progress, 'Failed to extract game data', true);
            setTimeout(() => {
              progress.remove();
            }, 3000);
          }
        }, 500);
      } else {
        updateProgress(progress, 'Failed to open share menu', true);
        setTimeout(() => {
          progress.remove();
        }, 3000);
      }
    }, 500);
  } else {
    updateProgress(progress, 'Share button not found', true);
    setTimeout(() => {
      progress.remove();
    }, 3000);
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