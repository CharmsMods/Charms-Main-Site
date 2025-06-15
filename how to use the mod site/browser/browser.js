// Wait for DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Select all sections (steps) and animated words
    const sections = document.querySelectorAll('.text-section');
    const words = document.querySelectorAll('.word-animate');
    const body = document.body; // Reference to the body element

    // Get the two background transition divs from the HTML
    const bgTransition1 = document.getElementById('bg-transition-1');
    const bgTransition2 = document.getElementById('bg-transition-2');
    let currentBgLayer = bgTransition1; // Initially, bgTransition1 is the active layer
    let nextBgLayer = bgTransition2; // bgTransition2 is the next layer to prepare

    // Map section data-section names to their respective background gradients
    // These gradients define the visual theme for each step on the browser page.
    const sectionBackgrounds = {
        "browser-intro": "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)", // Light theme for intro
        "browser-downloads": "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 70%, #c084fc 100%)", // Purple
        "browser-extract": "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 30%, #99f6e4 70%, #5eead4 100%)", // Teal
        "browser-new-folder": "linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fde68a 70%, #f59e0b 100%)", // Orange/Yellow
        "browser-keep-open": "linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #bfdbfe 70%, #60a5fa 100%)", // Blue
        "browser-open-browser": "linear-gradient(135deg, #fff1f2 0%, #fecdd3 30%, #fda4af 70%, #f87171 100%)", // Red/Pink
        "browser-extensions": "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 30%, #86efac 70%, #22c55e 100%)", // Green
        "browser-developer-mode": "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 70%, #0ea5e9 100%)", // Light Blue
        "browser-drag-drop": "linear-gradient(135deg, #fee2e2 0%, #fecaca 30%, #fca5a5 70%, #ef4444 100%)", // Red
        "browser-enable": "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 70%, #34d399 100%)", // Mint Green
        "browser-enjoy": "linear-gradient(135deg, #1f2937 0%, #374151 30%, #6b7280 70%, #9ca3af 100%)" // Dark theme for enjoy section
    };

    // Keep track of the current active section's index
    let currentSectionIndex = 0;
    // Flag to prevent multiple transitions from firing simultaneously
    let isTransitioning = false;

    // Initialize the first section and its background when the page loads
    if (sections.length > 0) {
        sections[0].classList.add('active'); // Make the first section active
        animateWordsIn(sections[0]); // Animate words in for the first section
        const initialSectionName = sections[0].getAttribute('data-section');
        body.setAttribute('data-current-section', initialSectionName); // Set body attribute for CSS theming

        // Set the background for the initial active layer and make it visible
        currentBgLayer.style.background = sectionBackgrounds[initialSectionName];
        currentBgLayer.style.opacity = '1';
    }

    // Function to scroll/transition to a specific section by its index
    function scrollToSection(index) {
        // Prevent action if already transitioning or if the index is out of bounds
        if (isTransitioning || index < 0 || index >= sections.length) {
            return;
        }

        isTransitioning = true; // Set the transition flag

        const oldSection = sections[currentSectionIndex]; // The section currently visible
        const newSection = sections[index]; // The section to transition to
        const newSectionName = newSection.getAttribute('data-section'); // Get its data-section name for background

        // Animate words out of the old section
        animateWordsOut(oldSection);

        // Update the body's data-current-section attribute, which triggers CSS changes (e.g., text color)
        body.setAttribute('data-current-section', newSectionName);

        // Prepare the next background layer: set its background and fade it in
        nextBgLayer.style.background = sectionBackgrounds[newSectionName];
        nextBgLayer.style.opacity = '1';

        // Fade out the current background layer
        currentBgLayer.style.opacity = '0';

        // After the CSS transition duration, swap the background layer references
        // This makes the 'nextBgLayer' the 'currentBgLayer' for the next transition.
        setTimeout(() => {
            currentBgLayer.style.background = 'none'; // Clear background of the now hidden layer
            const temp = currentBgLayer; // Temporarily store currentBgLayer
            currentBgLayer = nextBgLayer; // Assign nextBgLayer to currentBgLayer
            nextBgLayer = temp; // Assign the old currentBgLayer to nextBgLayer for future use
        }, 1500); // This timeout should match the CSS transition duration (1.5s)

        // After a shorter delay, deactivate the old section, activate the new one,
        // animate its words in, and reset the transition flag.
        setTimeout(() => {
            sections.forEach(section => section.classList.remove('active')); // Deactivate all sections
            newSection.classList.add('active'); // Activate the new section
            animateWordsIn(newSection); // Animate words in for the new section
            currentSectionIndex = index; // Update the current section index
            isTransitioning = false; // Reset the transition flag
        }, 1000); // Delay for text activation and flag reset (allows background to largely fade)
    }

    // Event listener for mouse wheel scrolling
    window.addEventListener('wheel', function(e) {
        e.preventDefault(); // Prevent default browser scroll behavior
        if (isTransitioning) return; // If already transitioning, ignore scroll input

        // Determine scroll direction (1 for down, -1 for up)
        const direction = e.deltaY > 0 ? 1 : -1;
        let nextIndex = currentSectionIndex + direction; // Calculate next section index

        scrollToSection(nextIndex); // Initiate the scroll transition
    }, { passive: false }); // Use passive: false to allow preventDefault

    // Event listener for keyboard navigation (Arrow Up/Down, Spacebar)
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return; // If already transitioning, ignore key input

        let nextIndex = currentSectionIndex;
        if (e.key === 'ArrowDown' || e.key === ' ') { // Down arrow or spacebar scrolls down
            e.preventDefault(); // Prevent default scroll/spacebar action
            nextIndex = Math.min(sections.length - 1, currentSectionIndex + 1); // Clamp index to max section
        } else if (e.key === 'ArrowUp') { // Up arrow scrolls up
            e.preventDefault(); // Prevent default scroll action
            nextIndex = Math.max(0, currentSectionIndex - 1); // Clamp index to min section
        }

        // If the calculated next index is different from the current, initiate transition
        if (nextIndex !== currentSectionIndex) {
            scrollToSection(nextIndex);
        }
    });

    // Function to animate words into view for a given section
    function animateWordsIn(section) {
        const sectionWords = section.querySelectorAll('.word-animate');
        sectionWords.forEach((word, index) => {
            word.classList.remove('hide'); // Ensure 'hide' class is removed
            setTimeout(() => {
                word.classList.add('reveal'); // Add 'reveal' class to trigger animation
            }, index * 100); // Stagger the animation start for each word
        });
    }

    // Function to animate words out of view for a given section
    function animateWordsOut(section) {
        const sectionWords = section.querySelectorAll('.word-animate');
        // Animate words out in reverse order or just remove 'reveal' quickly
        sectionWords.forEach((word, index) => {
            setTimeout(() => {
                word.classList.remove('reveal'); // Remove 'reveal' class
                word.classList.add('hide'); // Add 'hide' class to animate out
            }, index * 50); // Faster hide animation stagger
        });
    }

    // Event listener for mouse movement to apply magnetic and interactive effects
    document.addEventListener('mousemove', function(e) {
        // Update CSS variables for mouse coordinates (used by magnetic effect)
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');

        applyMagneticEffect(e); // Apply magnetic effect to words
        updateParticleAndGridInteraction(e); // Update particle and grid opacity/transform
    });

    // Function to apply a "magnetic" effect to words based on mouse proximity
    function applyMagneticEffect(e) {
        // Only apply to words in the currently active section that are revealed
        const activeWords = document.querySelectorAll('.text-section.active .word-animate.reveal');

        activeWords.forEach(word => {
            const rect = word.getBoundingClientRect(); // Get word's position and size
            const wordCenterX = rect.left + rect.width / 2;
            const wordCenterY = rect.top + rect.height / 2;

            // Calculate distance between mouse and word center
            const distance = Math.sqrt(
                Math.pow(e.clientX - wordCenterX, 2) +
                Math.pow(e.clientY - wordCenterY, 2)
            );

            // If mouse is within 100px of the word
            if (distance < 100) {
                const strength = (100 - distance) / 100; // Calculate influence strength (0 to 1)
                const deltaX = (e.clientX - wordCenterX) * strength * 0.1; // Small horizontal displacement
                const deltaY = (e.clientY - wordCenterY) * strength * 0.1; // Small vertical displacement

                // Apply transform: translate and scale based on strength
                word.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${1 + strength * 0.1})`;
            } else {
                word.style.transform = ''; // Reset transform if mouse is far away
            }
        });
    }

    // Function to update the opacity and transform of particles and grid lines based on mouse proximity
    function updateParticleAndGridInteraction(e) {
        // Particle interaction
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleCenterX = rect.left + rect.width / 2;
            const particleCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - particleCenterX, 2) +
                Math.pow(e.clientY - particleCenterY, 2)
            );

            if (distance < 150) { // If mouse is within 150px of the particle
                const strength = (150 - distance) / 150;
                // Increase opacity and scale based on proximity
                particle.style.opacity = Math.min(1, 0.6 + strength * 0.4);
                particle.style.transform = `scale(${1 + strength * 2})`;
            } else {
                particle.style.opacity = ''; // Reset opacity
                particle.style.transform = ''; // Reset transform
            }
        });

        // Grid interaction
        const gridLines = document.querySelectorAll('.grid-line');
        const mouseXPercent = (e.clientX / window.innerWidth) * 100;
        const mouseYPercent = (e.clientY / window.innerHeight) * 100;

        gridLines.forEach((line, index) => {
            // Horizontal lines (first 3 children)
            if (index < 3) {
                const lineY = parseFloat(line.style.top); // Get line's top position
                const distance = Math.abs(mouseYPercent - lineY); // Distance from mouse Y
                if (distance < 20) { // If mouse is within 20% vertical distance
                    line.style.opacity = Math.min(0.5, 0.1 + (20 - distance) / 20 * 0.4); // Increase opacity
                } else {
                    line.style.opacity = ''; // Reset opacity to default CSS
                }
            } else { // Vertical lines (last 2 children)
                const lineX = parseFloat(line.style.left); // Get line's left position
                const distance = Math.abs(mouseXPercent - lineX); // Distance from mouse X
                if (distance < 20) { // If mouse is within 20% horizontal distance
                    line.style.opacity = Math.min(0.5, 0.1 + (20 - distance) / 20 * 0.4); // Increase opacity
                } else {
                    line.style.opacity = ''; // Reset opacity to default CSS
                }
            }
        });
    }

    // Easter Egg: Konami Code for a rainbow background effect
    let konamiCode = [];
    // Konami Code sequence: ↑↑↓↓←→←→BA (keyCode values)
    const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode); // Add pressed key to the sequence
        // Keep the sequence length equal to the correct code length
        if (konamiCode.length > correctCode.length) {
            konamiCode.shift(); // Remove the oldest key if sequence gets too long
        }

        // Check if the current sequence matches the Konami Code
        if (konamiCode.length === correctCode.length &&
            konamiCode.every((code, index) => code === correctCode[index])) {
            // Apply rainbow effect animation to the body
            body.style.animation = 'rainbow-bg 2s infinite';

            // Remove the rainbow effect after 10 seconds
            setTimeout(() => {
                body.style.animation = '';
            }, 10000);
        }
    });

    // Dynamically add the @keyframes for the rainbow effect to the document head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
