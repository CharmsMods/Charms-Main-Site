document.addEventListener('DOMContentLoaded', () => {
    // Define the mod data
    // 'name' property will store the full zip filename (e.g., "Blue Sky.zip")
    // 'folder' property will store the folder name (e.g., "Blue Sky")
    // 'link' will be dynamically constructed based on 'name' and 'folder'
    // 'images' now explicitly lists the images available for each mod.
    const modsConfig = [
    { name: "2fly.zip", folder: "2fly", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "aim_trainer.zip", folder: "aim_trainer", images: ["1.png", "2.png"] },
    { name: "ANIMALS HELL-Mod.zip", folder: "ANIMALS HELL-Mod", images: ["1.png"] },
    { name: "AQUA-Mod.zip", folder: "AQUA-Mod", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "BO$$ MOD V8 - enjoy!.zip", folder: "BO$$ MOD V8 - enjoy!", images: ["1.png", "2.png"] },
    { name: "Charm Mod.zip", folder: "Charm Mod", images: ["1.png", "2.png", "3.png"] },
    { name: "Cream Mod.zip", folder: "Cream Mod", images: ["1.png", "2.png", "3.png"] },
    { name: "Flash_mod.zip", folder: "Flash_mod", images: ["1.png"] },
    { name: "FOV MOD.zip", folder: "FOV MOD", images: ["1.png", "2.png", "3.png"] },
    { name: "Fugaz13-mod.zip", folder: "Fugaz13-mod", images: ["1.png", "2.png"] },
    { name: "Got to Got.zip", folder: "Got to Got", images: ["1.png"] },
    { name: "green_and_white_mod.zip", folder: "green_and_white_mod", images: ["1.png"] },
    { name: "Grey Mod.zip", folder: "Grey Mod", images: ["1.png"] },
    { name: "hate_mod.zip", folder: "hate_mod", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "Illumination Mod.zip", folder: "Illumination Mod", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "Jolt_Mod_v1.zip", folder: "Jolt_Mod_v1", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "Lava_mod.zip", folder: "Lava_mod", images: ["1.png"] },
    { name: "Minogue-Mod-Oficial.zip", folder: "Minogue-Mod-Oficial", images: ["1.png"] },
    { name: "Minty V2.zip", folder: "Minty V2", images: ["1.png"] },
    { name: "Nio-mod-purple-main.zip", folder: "Nio-mod-purple-main", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "NticxMod-v6.zip", folder: "NticxMod-v6", images: ["1.png", "2.png", "3.png"] },
    { name: "OOOPS-Mod.zip", folder: "OOOPS-Mod", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "PARADISE.zip", folder: "PARADISE", images: ["1.png", "2.png"] },
    { name: "Peru-Mod.zip", folder: "Peru-Mod", images: ["1.png"] },
    { name: "PRE-ALPHA-DARKMODE.zip", folder: "PRE-ALPHA-DARKMODE", images: ["1.png"] },
    { name: "pred_mod.zip", folder: "pred_mod", images: ["1.png"] },
    { name: "Psychologixal-Mod.zip", folder: "Psychologixal-Mod", images: ["1.png", "2.png"] },
    { name: "Rainbow_mod_2.zip", folder: "Rainbow_mod_2", images: ["1.png"] },
    { name: "Ren-Mod.zip", folder: "Ren-Mod", images: ["1.png"] },
    { name: "RVNG Mod.zip", folder: "RVNG Mod", images: ["1.png"] },
    { name: "Samu-mod.zip", folder: "Samu-mod", images: ["1.png", "2.png", "3.png"] },
    { name: "Sketch Mod.zip", folder: "Sketch Mod", images: ["1.png", "2.png"] },
    { name: "Skipper-Mod.zip", folder: "Skipper-Mod", images: ["1.png", "2.png", "3.png", "4.png"] },
    { name: "skylux mod.zip", folder: "skylux mod", images: ["1.png"] },
    { name: "Summer_mod.zip", folder: "Summer_mod", images: ["1.png"] },
    { name: "Teen_Titans_Mod.zip", folder: "Teen_Titans_Mod", images: ["1.png"] },
    { name: "The_Terminator_Mod_1.zip", folder: "The_Terminator_Mod_1", images: ["1.png"] },
    { name: "TZ_Mod.zip", folder: "TZ_Mod", images: ["1.png"] },
    { name: "vvsmod.zip", folder: "vvsmod", images: ["1.png", "2.png", "3.png", "4.png"] }
];

    // Process mod data to add download links
    const modsData = modsConfig.map(mod => {
        return {
            ...mod, // Keep existing properties (name, folder, images)
            link: `mod-download-card-pictures/${mod.folder}/${mod.name}` // Dynamically construct link
        };
    });

    const modsGrid = document.getElementById('modsGrid');
    const fullscreenModal = document.querySelector('.fullscreen-modal');
    const modalImage = document.querySelector('.fullscreen-modal img');
    const closeModal = document.querySelector('.close-button');

    // Custom Modal for "Coming Soon" messages
    const messageModal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseButton = document.getElementById('modalCloseButton');

    // Function to show the custom message modal
    function showMessageModal(message) {
        modalMessage.textContent = message;
        messageModal.style.display = 'flex'; // Show the modal
    }

    // Function to hide the custom message modal
    function hideMessageModal() {
        messageModal.style.display = 'none'; // Hide the modal
    }

    // Event listener for the custom message modal's close button
    modalCloseButton.addEventListener('click', hideMessageModal);
    // Event listener for clicking outside the custom message modal content
    messageModal.addEventListener('click', (event) => {
        if (event.target === messageModal) {
            hideMessageModal();
        }
    });

    // Function to create a mod card
    function createModCard(mod, index) {
        const card = document.createElement('div');
        card.classList.add('mod-card');
        card.style.animationDelay = `${0.1 * (index + 1)}s`;

        const downloadLink = mod.link;
        const buttonClass = downloadLink ? 'download-button' : 'download-button coming-soon';
        const buttonText = downloadLink ? 'Download' : 'Coming Soon';
        const buttonDataLink = downloadLink ? `data-link="${downloadLink}"` : '';

        // Derive the display name for the H2 tag (without extension)
        let displayName = mod.name;
        const extensions = ['.zip', '.7z', '.rar', '.exe', '.tar', '.gz', '.dmg'];
        for (const ext of extensions) {
            if (displayName.endsWith(ext)) {
                displayName = displayName.slice(0, -ext.length);
                break;
            }
        }
        // Remove underscores and apply capitalization to the display name
        displayName = displayName.replace(/_/g, ' '); // Replace underscores with spaces
        displayName = displayName.replace(/-/g, ' '); // Replace hyphens with spaces (common in filenames)
        displayName = displayName.replace(/\b(\w)/g, s => s.toUpperCase()); // Capitalize first letter of each word
        displayName = displayName.trim().replace(/[,.]+$/, ''); // Trim trailing commas/periods and spaces

        let imageGridHtml = '';
        mod.images.forEach(image => {
            imageGridHtml += `<img src="mod-download-card-pictures/${mod.folder}/${image}" alt="${displayName} Image">`;
        });

        // Updated HTML structure for the mod card to include the new loading animation
        card.innerHTML = `
            <div class="download-loading-animation">
                <h1>
                    <span class="let1">l</span>
                    <span class="let2">o</span>
                    <span class="let3">a</span>
                    <span class="let4">d</span>
                    <span class="let5">i</span>
                    <span class="let6">n</span>
                    <span class="let7">g</span>
                </h1>
            </div>
            <h2>${displayName}</h2>
            <div class="mod-content">
                <button class="${buttonClass}" ${buttonDataLink}>${buttonText}</button>
                <div class="mod-tray">
                    <div class="image-grid">
                        ${imageGridHtml}
                    </div>
                </div>
            </div>
        `;

        // Add event listener for download button
        const downloadButton = card.querySelector('.download-button');
        downloadButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent card expansion when clicking the button

            if (!downloadButton.classList.contains('coming-soon')) {
                const link = downloadButton.dataset.link;
                const currentModCard = downloadButton.closest('.mod-card');
                const loadingAnimation = currentModCard.querySelector('.download-loading-animation');
                const modContent = currentModCard.querySelector('.mod-content');
                const modTitle = currentModCard.querySelector('h2');

                const animationDuration = 2000; // 2 seconds as requested

                // Hide mod content and title
                if (modContent) {
                    modContent.style.opacity = '0';
                    modContent.style.visibility = 'hidden';
                    modContent.style.pointerEvents = 'none'; // Disable interactions
                }
                if (modTitle) {
                    modTitle.style.opacity = '0';
                    modTitle.style.visibility = 'hidden';
                }

                // Show loading animation
                loadingAnimation.classList.add('show');

                setTimeout(() => {
                    // Hide loading animation
                    loadingAnimation.classList.remove('show');

                    // Show mod content and title again
                    if (modContent) {
                        modContent.style.opacity = '1';
                        modContent.style.visibility = 'visible';
                        modContent.style.pointerEvents = 'auto';
                    }
                    if (modTitle) {
                        modTitle.style.opacity = '1';
                        modTitle.style.visibility = 'visible';
                    }

                    // Trigger the download
                    if (link) {
                        window.location.href = link; // Use window.location.href for direct download
                    }
                }, animationDuration);

            } else {
                showMessageModal("This mod is coming soon!");
            }
        });

        // Add event listener for card expansion (click anywhere on the card except download button/image)
        const modTray = card.querySelector('.mod-tray');
        card.addEventListener('click', (event) => {
            // Only expand if the click is not on the download button or an image
            if (!event.target.classList.contains('download-button') && event.target.tagName !== 'IMG') {
                const isExpanded = card.classList.contains('expanded');

                // Close all other expanded cards
                document.querySelectorAll('.mod-card.expanded').forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('expanded');
                        otherCard.querySelector('.mod-tray').style.maxHeight = '0';
                        otherCard.querySelector('.mod-tray').classList.remove('show-images');
                    }
                });

                if (isExpanded) {
                    card.classList.remove('expanded');
                    modTray.style.maxHeight = '0';
                    modTray.classList.remove('show-images');
                } else {
                    card.classList.add('expanded');
                    modTray.style.maxHeight = modTray.scrollHeight + 50 + 'px'; // Add buffer for smooth transition
                    modTray.classList.add('show-images');
                }
            }
        });

        // Add event listeners for fullscreen image view
        const images = card.querySelectorAll('.image-grid img');
        images.forEach(image => {
            image.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent card expansion when clicking an image
                modalImage.src = event.target.src;
                fullscreenModal.style.display = 'flex';
            });
        });

        return card;
    }

    // Populate the mods grid
    modsData.forEach((mod, index) => {
        modsGrid.appendChild(createModCard(mod, index));
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        fullscreenModal.style.display = 'none';
    });

    // Close modal when clicking outside the image
    fullscreenModal.addEventListener('click', (event) => {
        if (event.target === fullscreenModal) {
            fullscreenModal.style.display = 'none';
        }
    });
});