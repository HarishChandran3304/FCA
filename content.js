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
        if (element.textContent.toLowerCase().includes('share') || 
            element.className.toLowerCase().includes('share') ||
            element.id.toLowerCase().includes('share')) {
            console.log(`Share-related element ${index}:`, {
                tag: element.tagName,
                text: element.textContent,
                id: element.id,
                class: element.className,
                html: element.outerHTML
            });
        }
    });
}

// Run the function when the page loads
findShareButton(); 