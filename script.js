document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menuIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const themeToggle = document.getElementById('themeToggle');
    const splitModeToggle = document.getElementById('splitModeToggle'); // New split mode button
    const body = document.body;
    const darkModeSplitOverlay = document.getElementById('dark-mode-split-overlay');

    // Menu icon functionality
    if (menuIcon && dropdownMenu) {
        menuIcon.addEventListener('click', () => {
            dropdownMenu.classList.toggle('open');
            menuIcon.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!dropdownMenu.contains(event.target) && !menuIcon.contains(event.target)) {
                dropdownMenu.classList.remove('open');
                menuIcon.classList.remove('active');
            }
        });
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // If in split mode, exit split mode first
            if (body.classList.contains('split-active')) {
                body.classList.remove('split-active');
                darkModeSplitOverlay.style.clipPath = 'polygon(0 0, 0 0, 0 0, 0 0)'; // Collapse dark overlay
                // Reset body to be fully dark or light based on previous state if needed, or let themeToggle handle it
            }

            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });

        // Initialize theme icon based on current body class on load
        if (body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Split mode toggle functionality
    if (splitModeToggle && darkModeSplitOverlay) {
        splitModeToggle.addEventListener('click', () => {
            // Toggle split-active class on the body
            body.classList.toggle('split-active');

            // Ensure main dark-mode class is removed when entering split mode
            if (body.classList.contains('split-active')) {
                body.classList.remove('dark-mode'); // Force light mode as base
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Update theme toggle icon to sun

                // Apply initial clip path for the split effect
                darkModeSplitOverlay.style.clipPath = 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)';
            } else {
                // When exiting split mode, reset clip-path to hidden
                darkModeSplitOverlay.style.clipPath = 'polygon(0 0, 0 0, 0 0, 0 0)';
                // Revert to original theme based on user preference or last state
                // This will let the main themeToggle handle it if clicked again
            }
        });
    }
});