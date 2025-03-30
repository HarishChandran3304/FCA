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
        // Wait for the page to fully load before clicking buttons
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
  }, 500);
  
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
        
        // Then inject the script to enable eval bar
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
              toast.className = 'chess-analysis-progress';
              toast.innerHTML = `
                <span class="progress-text">Login to Lichess for a better experience</span>
                <span class="progress-spinner"></span>
              `;
              document.body.appendChild(toast);
              toast.classList.add('show');
              
              // Remove after 5 seconds with animation
              setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                  if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                  }
                }, 500);
              }, 5000);
            }
            
            // Try to enable the evaluation bar, with better error handling
            async function enableEval() {
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
                      
                      // Check if user is logged in
                      const isLoggedIn = document.querySelector('#user_tag') !== null;
                      
                      if (!isLoggedIn) {
                        // Show login toast for logged out users
                        const loginToast = document.createElement('div');
                        loginToast.className = 'chess-analysis-progress warning';
                        loginToast.innerHTML = `
                          <span class="progress-text">⚠️ Sign into Lichess for full analysis</span>
                        `;
                        document.body.appendChild(loginToast);
                        loginToast.classList.add('show');
                        
                        // Remove after 5 seconds
                        setTimeout(() => {
                          loginToast.classList.remove('show');
                          setTimeout(() => {
                            if (document.body.contains(loginToast)) {
                              document.body.removeChild(loginToast);
                            }
                          }, 500);
                        }, 5000);
                      } else {
                        // Show analysis toast for logged in users
                        const analysisToast = document.createElement('div');
                        analysisToast.className = 'chess-analysis-progress';
                        analysisToast.innerHTML = `
                          <span class="progress-text">Waiting for analysis</span>
                          <span class="progress-spinner"></span>
                        `;
                        document.body.appendChild(analysisToast);
                        analysisToast.classList.add('show');

                        // Function to check if analysis is complete
                        function checkAnalysisComplete() {
                          const loader = document.querySelector('#acpl-chart-container-loader');
                          if (!loader) {
                            // Analysis is complete
                            analysisToast.classList.add('success');
                            analysisToast.querySelector('.progress-text').innerHTML = '✅ Analysis ready!';
                            
                            // Remove the toast after 2 seconds
                            setTimeout(() => {
                              analysisToast.classList.remove('show');
                              setTimeout(() => {
                                if (document.body.contains(analysisToast)) {
                                  document.body.removeChild(analysisToast);
                                }
                              }, 500);
                            }, 2000);
                            return;
                          }
                          // Check again in 500ms
                          setTimeout(checkAnalysisComplete, 500);
                        }

                        // Start checking for analysis completion
                        checkAnalysisComplete();
                      }
                    } catch (clickError) {
                      console.error('Error clicking toggle:', clickError);
                    }
                  }, 500);
                }
              } catch (error) {
                console.log('Error finding engine toggle:', error.message);
              }
            }
            
            // Start the process
            enableEval();
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