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
  
  // After clicking the import button, we need to wait for the new page to load,
  // then show the toast notification on that page
  chrome.webNavigation.onCompleted.addListener(function showToastAfterNavigation(details) {
    // Check if this is the tab we're interested in
    if (details.tabId === tabId && !details.url.includes('lichess.org/paste')) {
      // Remove this listener since we only want to execute it once
      chrome.webNavigation.onCompleted.removeListener(showToastAfterNavigation);
      
      // Wait longer for the page to fully load and eval components to be available
      setTimeout(() => {
        // First, inject the CSS file
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ['styles.css']
        });
        
        // Then inject the script to enable eval bar and show toast
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: () => {
            console.log('Starting to enable engine evaluation bar');
            
            // Function that waits for an element to appear in the DOM
            function waitForElement(selector, maxWait = 10000) {
              return new Promise((resolve, reject) => {
                if (document.querySelector(selector)) {
                  return resolve(document.querySelector(selector));
                }
                
                const observer = new MutationObserver(() => {
                  if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                  }
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
                
                // Set a timeout to stop waiting after maxWait milliseconds
                setTimeout(() => {
                  observer.disconnect();
                  reject(new Error(`Timeout waiting for ${selector}`));
                }, maxWait);
              });
            }
            
            // The specific selector for the engine evaluation toggle
            const EVAL_TOGGLE_SELECTOR = '#main-wrap > main > div.analyse__tools > div.ceval > div > label';
            
            // Function to show toast notification only if user is not logged in
            function showToastIfNotLoggedIn() {
              // Check if user is logged in by looking for the user_tag element
              const isLoggedIn = document.querySelector('#user_tag') !== null;
              
              if (isLoggedIn) {
                console.log('User is logged in, not showing toast');
                return; // Don't show toast if logged in
              }
              
              console.log('User is not logged in, showing login toast');
              
              // Create toast container
              const toast = document.createElement('div');
              toast.textContent = 'FCA: Login to Lichess for a better experience';
              toast.className = 'lichess-toast';
              
              // Add to the page
              document.body.appendChild(toast);
              
              // Animate in (slide from left)
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  toast.classList.add('show');
                });
              });
              
              // Remove after 5 seconds with animation
              setTimeout(() => {
                // Slide out to the left
                toast.classList.remove('show');
                toast.classList.add('hide');
                
                setTimeout(() => {
                  if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                  }
                }, 500); // Wait for the animation to finish
              }, 5000);
            }
            
            // Try to enable the evaluation bar, with better error handling
            async function enableEvalAndShowToast() {
              try {
                console.log('Waiting for evaluation toggle to appear...');
                const evalToggle = await waitForElement(EVAL_TOGGLE_SELECTOR, 8000);
                
                if (evalToggle) {
                  console.log('Found engine toggle, clicking it');
                  
                  // Wait just a moment before clicking to ensure the page is stable
                  setTimeout(() => {
                    // Try-catch the click operation itself
                    try {
                      evalToggle.click();
                      console.log('Successfully clicked engine toggle');
                      
                      // Wait a moment after clicking to let the UI update
                      setTimeout(showToastIfNotLoggedIn, 800);
                    } catch (clickError) {
                      console.error('Error clicking toggle:', clickError);
                      showToastIfNotLoggedIn();
                    }
                  }, 500);
                }
              } catch (error) {
                console.log('Error finding engine toggle:', error.message);
                showToastIfNotLoggedIn();
              }
            }
            
            // Start the process
            enableEvalAndShowToast();
          }
        });
      }, 3000); // Wait 3 seconds for the page to be fully interactive
    }
  });
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