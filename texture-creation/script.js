// Get canvas and context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Get elements for controls
const bgColorInput = document.getElementById('bgColor');
const resXInput = document.getElementById('resX');
const resYInput = document.getElementById('resY');
const drawTransparentCheckbox = document.getElementById('drawTransparent');
const penColorInput = document.getElementById('penColor');
const penSizeInput = document.getElementById('penSize');
const clearCanvasButton = document.getElementById('clearCanvas');
const exportImageButton = document.getElementById('exportImage');
const messageBox = document.getElementById('message-box');
const overlayMessage = document.getElementById('overlay-message');

// Get elements for tabs and file lists
const jpgTab = document.getElementById('jpg-tab');
const pngTab = document.getElementById('png-tab');
const jpgFileList = document.getElementById('jpg-file-list');
const pngFileList = document.getElementById('png-file-list');
const selectedFileDisplay = document.getElementById('selected-file-display');
const noSelectionMessage = document.getElementById('no-selection-message');
const loadingMessage = document.getElementById('loading-message');
const fileSearchInput = document.getElementById('file-search-input'); // New: Get search input

// Drawing state variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let canvasContent = null; // Store canvas content for clear and redraw

// File selection state
let selectedFileName = '';
let selectedFileType = 'jpg'; // Default to JPG

// Arrays to store file names fetched from text files (full lists)
let allJpgFileNames = []; // Stores the full list of JPG names
let allPngFileNames = []; // Stores the full list of PNG names

// --- Utility Functions ---

/**
 * Displays a temporary message in the message box.
 * @param {string} message - The message to display.
 * @param {string} type - 'error' or 'info' (determines styling if needed, currently just one style).
 */
function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    // Hide after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

/**
 * Shows an overlay message on the canvas.
 * @param {string} message - The message to display.
 * @param {boolean} show - Whether to show or hide the overlay.
 */
function showCanvasOverlay(message, show = true) {
    overlayMessage.textContent = message;
    overlayMessage.style.display = show ? 'flex' : 'none';
}

/**
 * Initializes the canvas with default settings.
 */
function initializeCanvas() {
    canvas.width = parseInt(resXInput.value);
    canvas.height = parseInt(resYInput.value);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = parseInt(penSizeInput.value);
    ctx.strokeStyle = penColorInput.value;

    redrawCanvasBackground();
}

/**
 * Redraws the canvas background based on settings (color or transparent).
 */
function redrawCanvasBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing content
    if (!drawTransparentCheckbox.checked || selectedFileType === 'jpg') {
        ctx.fillStyle = bgColorInput.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // If transparent and PNG, leave clear.
    if (canvasContent) {
        // Restore previous drawing if it exists
        ctx.putImageData(canvasContent, 0, 0);
    }
}

/**
 * Clears the drawing on the canvas.
 */
function clearCanvasDrawing() {
    canvasContent = null; // Clear stored content
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear actual canvas
    redrawCanvasBackground(); // Redraw background
    showMessage('Canvas cleared!');
}

/**
 * Populates the file list based on the active tab and current search query.
 * @param {Array<string>} fileNamesToDisplay - The (potentially filtered) array of file names to display.
 * @param {HTMLElement} listElement - The <ul> element to populate.
 * @param {string} type - 'jpg' or 'png'.
 */
function populateFileList(fileNamesToDisplay, listElement, type) {
    listElement.innerHTML = ''; // Clear existing list
    if (fileNamesToDisplay.length === 0) {
        listElement.innerHTML = '<li class="text-gray-500 italic">No matching files found.</li>';
        noSelectionMessage.style.display = 'none'; // Hide if no matches
        return;
    }
    fileNamesToDisplay.forEach(name => {
        const li = document.createElement('li');
        // Remove .jpg or .png extension from the name if present
        const cleanName = name.replace(/\.(jpg|png)$/i, '');
        li.textContent = cleanName + '.' + type;
        li.dataset.filename = cleanName;
        li.dataset.filetype = type;
        li.addEventListener('click', () => selectFile(li));
        listElement.appendChild(li);
    });

    // Re-highlight selected file if it's still in the filtered list
    if (selectedFileName && listElement.querySelector(`[data-filename="${selectedFileName}"]`)) {
        noSelectionMessage.style.display = 'none';
        const selectedLi = listElement.querySelector(`[data-filename="${selectedFileName}"]`);
        if (selectedLi) {
            selectedLi.classList.add('selected');
        }
    } else {
        noSelectionMessage.style.display = 'block';
    }
}

/**
 * Selects a file from the list.
 * @param {HTMLElement} liElement - The selected list item.
 */
function selectFile(liElement) {
    // Remove 'selected' class from all other items in both lists
    document.querySelectorAll('#file-list-container li').forEach(item => {
        item.classList.remove('selected');
    });

    liElement.classList.add('selected');
    selectedFileName = liElement.dataset.filename;
    selectedFileType = liElement.dataset.filetype;
    selectedFileDisplay.textContent = `(Selected: ${selectedFileName}.${selectedFileType})`;
    noSelectionMessage.style.display = 'none'; // Hide the no selection message

    // Adjust transparent drawing checkbox based on selection
    if (selectedFileType === 'jpg') {
        drawTransparentCheckbox.checked = false; // JPG cannot be transparent
        drawTransparentCheckbox.disabled = true;
        showCanvasOverlay('JPG does not support transparency. Background will be filled.');
    } else {
        drawTransparentCheckbox.disabled = false;
        showCanvasOverlay('', false); // Clear overlay
    }
    redrawCanvasBackground(); // Redraw with potentially new transparency setting
}

/**
 * Exports the image.
 */
function exportImage() {
    if (!selectedFileName) {
        showMessage('Please select a file name from the list.', 'error');
        return;
    }

    // Create a temporary canvas for the final image with correct background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Handle background based on type and transparency setting
    if (selectedFileType === 'jpg' || !drawTransparentCheckbox.checked) {
        tempCtx.fillStyle = bgColorInput.value;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }
    // If PNG and transparent, leave tempCanvas clear (default behavior)

    // Draw the content from the main canvas onto the temporary canvas
    // Using ImageData to copy the current drawing content without background
    if (canvasContent) {
        const drawingData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        tempCtx.putImageData(drawingData, 0, 0);
    } else {
         // If no drawing, just copy the (potentially empty) canvas content
         tempCtx.drawImage(canvas, 0, 0);
    }


    let imageUrl;
    let mimeType;

    if (selectedFileType === 'png') {
        mimeType = 'image/png';
        imageUrl = tempCanvas.toDataURL(mimeType, 1.0); // 1.0 for no compression
    } else { // JPG
        mimeType = 'image/jpeg';
        imageUrl = tempCanvas.toDataURL(mimeType, 1.0); // 1.0 for no compression
    }

    // Create a temporary link element to trigger download
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${selectedFileName}.${selectedFileType}`;
    document.body.appendChild(a); // Append to body is good practice for cross-browser compatibility
    a.click(); // Programmatically click the link
    document.body.removeChild(a); // Clean up the element

    showMessage(`Exported as ${selectedFileName}.${selectedFileType}`);
}

/**
 * Fetches file names from a given URL and populates the global array.
 * @param {string} url - The URL of the text file.
 * @param {string} type - 'jpg' or 'png' to determine which global array to populate.
 */
async function fetchFileNames(url, type) {
    loadingMessage.style.display = 'block'; // Show loading message
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const names = text.split('\n').map(name => name.trim()).filter(name => name.length > 0);

        if (type === 'jpg') {
            allJpgFileNames = names; // Store full list
            applySearchFilter(); // Apply filter immediately after fetching
        } else if (type === 'png') {
            allPngFileNames = names; // Store full list
            applySearchFilter(); // Apply filter immediately after fetching
        }
    } catch (error) {
        console.error(`Error fetching ${type} file names:`, error);
        showMessage(`Failed to load ${type} file names.`, 'error');
        if (type === 'jpg') {
            jpgFileList.innerHTML = '<li class="text-red-500 italic">Error loading JPG names.</li>';
        } else if (type === 'png') {
            pngFileList.innerHTML = '<li class="text-red-500 italic">Error loading PNG names.</li>';
        }
    } finally {
        loadingMessage.style.display = 'none'; // Hide loading message
    }
}

/**
 * Filters the file list based on the search input and repopulates the active list.
 */
function applySearchFilter() {
    const searchTerm = fileSearchInput.value.toLowerCase();
    let filesToFilter = [];
    let listElementToPopulate;
    let currentFileType;

    if (jpgTab.classList.contains('active')) {
        filesToFilter = allJpgFileNames;
        listElementToPopulate = jpgFileList;
        currentFileType = 'jpg';
    } else if (pngTab.classList.contains('active')) {
        filesToFilter = allPngFileNames;
        listElementToPopulate = pngFileList;
        currentFileType = 'png';
    }

    const filteredFiles = filesToFilter.filter(name =>
        name.toLowerCase().includes(searchTerm)
    );

    populateFileList(filteredFiles, listElementToPopulate, currentFileType);
}

// --- Event Listeners ---

// Drawing functionality
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    // Start a new path for smooth drawing
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.lineWidth = parseInt(penSizeInput.value);
    ctx.strokeStyle = penColorInput.value;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    // Store the current canvas state (drawing only) for clearing/redrawing background
    canvasContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
     // Store the current canvas state (drawing only) for clearing/redrawing background
    canvasContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Input change listeners
bgColorInput.addEventListener('input', redrawCanvasBackground);
penColorInput.addEventListener('input', () => {
    ctx.strokeStyle = penColorInput.value;
});
penSizeInput.addEventListener('input', () => {
    ctx.lineWidth = parseInt(penSizeInput.value);
});

// Resolution change listeners
resXInput.addEventListener('change', initializeCanvas);
resYInput.addEventListener('change', initializeCanvas);

// Transparent drawing checkbox
drawTransparentCheckbox.addEventListener('change', () => {
    if (drawTransparentCheckbox.checked && selectedFileType === 'jpg') {
        // This state should be prevented by disabling the checkbox, but as a safeguard
        drawTransparentCheckbox.checked = false;
        showMessage('JPG format does not support transparency. Please switch to PNG or uncheck this option.', 'error');
        showCanvasOverlay('JPG does not support transparency. Background will be filled.');
    } else if (drawTransparentCheckbox.checked) {
        showCanvasOverlay('Drawing on transparent background.', true);
        redrawCanvasBackground(); // Redraw canvas with transparent background
    } else {
        showCanvasOverlay('', false); // Hide overlay
        redrawCanvasBackground(); // Redraw canvas with solid background
    }
});

// Buttons
clearCanvasButton.addEventListener('click', clearCanvasDrawing);
exportImageButton.addEventListener('click', exportImage);

// Tab functionality
jpgTab.addEventListener('click', async () => {
    jpgTab.classList.add('active');
    pngTab.classList.remove('active');
    jpgFileList.classList.remove('hidden');
    pngFileList.classList.add('hidden');
    fileSearchInput.value = ''; // Clear search on tab change
    await fetchFileNames('jpgurl.txt', 'jpg'); // Fetch JPG names
    selectedFileType = 'jpg'; // Update current type when tab changes
    // If currently selected file is not a JPG, clear selection
    if (selectedFileDisplay.textContent && (!selectedFileDisplay.textContent.includes('(Selected: ') || selectedFileDisplay.textContent.includes('.png'))) {
        selectedFileName = '';
        selectedFileDisplay.textContent = '';
        noSelectionMessage.style.display = 'block';
    } else {
        // If current selection is a JPG, ensure it's re-highlighted after fetching
        applySearchFilter();
    }

    // Enforce JPG transparency rules
    drawTransparentCheckbox.checked = false;
    drawTransparentCheckbox.disabled = true;
    showCanvasOverlay('JPG does not support transparency. Background will be filled.');
    redrawCanvasBackground();
});

pngTab.addEventListener('click', async () => {
    pngTab.classList.add('active');
    jpgTab.classList.remove('active');
    pngFileList.classList.remove('hidden');
    jpgFileList.classList.add('hidden');
    fileSearchInput.value = ''; // Clear search on tab change
    await fetchFileNames('pnglist.txt', 'png'); // Fetch PNG names
    selectedFileType = 'png'; // Update current type when tab changes
    // If currently selected file is not a PNG, clear selection
    if (selectedFileDisplay.textContent && (!selectedFileDisplay.textContent.includes('(Selected: ') || selectedFileDisplay.textContent.includes('.jpg'))) {
        selectedFileName = '';
        selectedFileDisplay.textContent = '';
        noSelectionMessage.style.display = 'block';
    } else {
        // If current selection is a PNG, ensure it's re-highlighted after fetching
        applySearchFilter();
    }

    // Allow PNG transparency
    drawTransparentCheckbox.disabled = false;
    showCanvasOverlay('', false); // Clear any JPG-specific overlay
    redrawCanvasBackground();
});

// Search input listener
fileSearchInput.addEventListener('keyup', applySearchFilter);

// --- Initialization on window load ---
window.onload = function() {
    initializeCanvas();
    // Initially populate JPG tab on load, which will also fetch the names
    jpgTab.click();
};

// The canvas's actual width/height are set by JS `canvas.width = X; canvas.height = Y;`
// The CSS (`.canvas-container` and `#drawingCanvas`) ensures that if the canvas's intrinsic
// resolution is larger than the available display area, scrollbars appear, preventing it
// from "filling up the entire page" and pushing other elements off-screen.
// We don't need a specific `window.addEventListener('resize')` for canvas scaling as its
// logical size remains fixed by user input, and its display is handled by CSS overflows.
