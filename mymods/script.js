// Password and elements
const correctPassword = "123456789";
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('passwordInput');
const mainContent = document.getElementById('mainContent');
const cursor = document.getElementById('cursor');

// Variables for timing and state
let inputEnabled = false;
let cursorVisible = false;

// Enable input and show cursor after animations complete
setTimeout(() => {
    inputEnabled = true;
    passwordInput.style.opacity = '1';
    cursor.style.opacity = '1';
    cursorVisible = true;
    
    // Focus on input to start typing immediately
    passwordInput.focus();
}, 3800); // Wait for all animations to complete

// Handle password input
passwordInput.addEventListener('input', (e) => {
    if (!inputEnabled) return;
    
    const enteredPassword = e.target.value;
    
    // Update cursor position based on text length
    updateCursorPosition();
});

// Handle Enter key press to check password
passwordInput.addEventListener('keypress', (e) => {
    if (!inputEnabled) return;
    
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Function to update cursor position
function updateCursorPosition() {
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontSize = getComputedStyle(passwordInput).fontSize;
    tempSpan.style.fontFamily = getComputedStyle(passwordInput).fontFamily;
    tempSpan.style.letterSpacing = getComputedStyle(passwordInput).letterSpacing;
    tempSpan.textContent = passwordInput.value;
    document.body.appendChild(tempSpan);

    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // Get the padding-left of the password-box
    const passwordBox = document.getElementById('passwordBox');
    const computedPaddingLeft = parseFloat(getComputedStyle(passwordBox).paddingLeft);

    // Add a small offset (e.g., 2px) to move the cursor past the text
    const cursorOffset = 2; // Adjust this value as needed to fine-tune spacing

    // Position the cursor at the end of the text, plus the initial padding and offset
    cursor.style.left = (computedPaddingLeft + textWidth + cursorOffset) + 'px';
}

// Function to check password
function checkPassword() {
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === correctPassword) {
        // Correct password - show main content
        showMainContent();
    } else {
        // Wrong password - show error
        showError();
    }
}

// Function to show error (red screen)
function showError() {
    passwordScreen.classList.add('error');
    
    // Clear input and reset after 1 second
    setTimeout(() => {
        passwordScreen.classList.remove('error');
        passwordInput.value = '';
        updateCursorPosition();
        passwordInput.focus();
    }, 1000);
}

// Function to show main content
function showMainContent() {
    // Hide password screen
    passwordScreen.classList.add('hidden');
    
    // Show main content after transition
    setTimeout(() => {
        passwordScreen.style.display = 'none';
        mainContent.classList.add('show');
        document.body.style.overflow = 'auto'; // Enable scrolling
    }, 500);
}

// Handle cursor blinking
setInterval(() => {
    if (cursorVisible && inputEnabled) {
        if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
            cursor.style.opacity = '1';
        } else {
            cursor.style.opacity = '0';
        }
    }
}, 500);

// Handle window resize to update cursor position
window.addEventListener('resize', () => {
    if (inputEnabled) {
        updateCursorPosition();
    }
});

// Prevent context menu and other interactions during password phase
document.addEventListener('contextmenu', (e) => {
    if (!mainContent.classList.contains('show')) {
        e.preventDefault();
    }
});

// Handle page visibility to refocus input
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && inputEnabled && !mainContent.classList.contains('show')) {
        setTimeout(() => {
            passwordInput.focus();
        }, 100);
    }
});

// Ensure input stays focused during password phase
document.addEventListener('click', (e) => {
    if (!mainContent.classList.contains('show') && inputEnabled) {
        passwordInput.focus();
    }
});

// Optional: Add click handlers for mod cards and download buttons
document.addEventListener('DOMContentLoaded', () => {
    const modCards = document.querySelectorAll('.mod-card');
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    // Handle mod card clicks (excluding download button clicks)
    modCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the download button
            if (e.target.classList.contains('download-btn')) return;
            
            const modNames = ['Cream Mod', 'Sketch Mod', 'Grey Mod', 'Charm Mod', 'Illumination Mod'];
            console.log(`Clicked on ${modNames[index]}`);
            // Add your mod card click functionality here
        });
    });
    
    // Handle download button clicks
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            
            // Get the mod name from the card title
            const modName = button.closest('.mod-card').querySelector('h3').textContent;
            
            // Build file path: mods/[Mod Name]/[Mod Name].zip
            const filePath = `mods/${modName}/${modName}.zip`;
            
            // Download the file
            downloadFile(filePath, modName);
        });
    });
});

// Function to download file directly
function downloadFile(filePath, modName) {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = filePath;
    link.download = ''; // Let browser determine filename from path
    
    // Add to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloading ${modName} from ${filePath}`);
}

// Alternative function for URL-based downloads
function downloadFromUrl(url, filename) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        });
}