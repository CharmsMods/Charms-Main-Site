// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all sections and words
    const sections = document.querySelectorAll('.text-section');
    const words = document.querySelectorAll('.word-animate');
    const body = document.body;

    // Get the two new background transition divs
    const bgTransition1 = document.getElementById('bg-transition-1');
    const bgTransition2 = document.getElementById('bg-transition-2');
    let currentBgLayer = bgTransition1; // Start with bgTransition1 as the active layer
    let nextBgLayer = bgTransition2;

    // The navInstruction element is no longer in the HTML, so this line will simply get null.
    // However, keeping it doesn't break anything.
    const navInstruction = document.getElementById('nav-instruction');

    // Map section data-section names to their respective background gradients
    const sectionBackgrounds = {
        "intro": "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
        "passion": "linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 30%, #e9d5ff 70%, #d8b4fe 100%)",
        "mods": "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 30%, #99f6e4 70%, #5eead4 100%)",
        "journey": "linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fde68a 70%, #f59e0b 100%)",
        "community": "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 70%, #c084fc 100%)",
        "feedback": "linear-gradient(135deg, #fff1f2 0%, #fecdd3 30%, #fda4af 70%, #f87171 100%)",
        "mission": "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #4ade80 100%)",
        "inspiration": "linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #bfdbfe 70%, #60a5fa 100%)",
        "closing": "linear-gradient(135deg, #1f2937 0%, #374151 30%, #6b7280 70%, #9ca3af 100%)"
    };

    // Current section tracking
    let currentSectionIndex = 0;
    let isTransitioning = false; // Flag to prevent rapid section changes

    // Initialize first section and background
    if (sections.length > 0) {
        sections[0].classList.add('active');
        animateWordsIn(sections[0]);
        const initialSectionName = sections[0].getAttribute('data-section');
        body.setAttribute('data-current-section', initialSectionName);

        // Set the initial background for the first layer and make it visible
        currentBgLayer.style.background = sectionBackgrounds[initialSectionName];
        currentBgLayer.style.opacity = '1';

        // The instruction display logic below is no longer relevant as the element is removed.
        // It's safe to remove or keep commented out.
        /*
        setTimeout(() => {
            if (navInstruction) { // Check if navInstruction exists before trying to access its classList
                navInstruction.classList.add('show');
                setTimeout(() => {
                    navInstruction.classList.remove('show');
                }, 5000); // Hide after 5 seconds
            }
        }, 1000); // Show after 1 second
        */
    }

    // --- Custom Smooth Scrolling Logic ---
    function scrollToSection(index) {
        if (isTransitioning || index < 0 || index >= sections.length) {
            return;
        }

        isTransitioning = true; // Set flag to prevent further actions

        const oldSection = sections[currentSectionIndex];
        const newSection = sections[index];
        const newSectionName = newSection.getAttribute('data-section');

        // Hide old section words
        animateWordsOut(oldSection);

        // Update the body's data-current-section attribute for text color changes
        body.setAttribute('data-current-section', newSectionName);

        // Prepare the next background layer
        nextBgLayer.style.background = sectionBackgrounds[newSectionName];
        nextBgLayer.style.opacity = '1'; // Fade in the next layer

        // Fade out the current background layer
        currentBgLayer.style.opacity = '0';

        // Swap the layers after the CSS transition duration
        setTimeout(() => {
            // Clear background of the now hidden layer to free up memory/resources
            currentBgLayer.style.background = 'none';
            // Swap references
            const temp = currentBgLayer;
            currentBgLayer = nextBgLayer;
            nextBgLayer = temp;
        }, 1500); // This timeout should match the CSS transition duration (1.5s = 1500ms)

        // Deactivate old section and activate new one (for text visibility and animations)
        setTimeout(() => {
            sections.forEach(section => section.classList.remove('active'));
            newSection.classList.add('active');
            animateWordsIn(newSection);
            currentSectionIndex = index; // Update current section index
            isTransitioning = false; // Reset flag after animations complete
        }, 1000); // Activate new section text and reset flag after 1 second (allows background to largely fade)
    }

    // Prevent default scroll wheel behavior
    window.addEventListener('wheel', function(e) {
        e.preventDefault(); // Prevent default scroll
        if (isTransitioning) return; // Ignore if already transitioning

        const direction = e.deltaY > 0 ? 1 : -1; // Determine scroll direction
        let nextIndex = currentSectionIndex + direction;

        scrollToSection(nextIndex);
    }, { passive: false }); // Use passive: false to allow preventDefault

    // Keyboard navigation (Arrow Up/Down, Spacebar)
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;

        let nextIndex = currentSectionIndex;
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault(); // Prevent default scroll
            nextIndex = Math.min(sections.length - 1, currentSectionIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); // Prevent default scroll
            nextIndex = Math.max(0, currentSectionIndex - 1);
        }

        if (nextIndex !== currentSectionIndex) {
            scrollToSection(nextIndex);
        }
    });


    // --- Existing functions (adjusted slightly) ---

    function animateWordsIn(section) {
        const sectionWords = section.querySelectorAll('.word-animate');
        sectionWords.forEach((word, index) => {
            word.classList.remove('hide'); // Ensure 'hide' is removed first
            // Use requestAnimationFrame for smoother animations if many words
            setTimeout(() => {
                word.classList.add('reveal');
            }, index * 100); // Stagger the animations
        });
    }

    function animateWordsOut(section) {
        const sectionWords = section.querySelectorAll('.word-animate');
        sectionWords.forEach((word, index) => {
            // Use requestAnimationFrame for smoother animations if many words
            setTimeout(() => {
                word.classList.remove('reveal');
                word.classList.add('hide');
            }, index * 50); // Faster hide animation
        });
    }

    // Mouse movement for magnetic effects
    document.addEventListener('mousemove', function(e) {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');

        applyMagneticEffect(e);
        updateParticleAndGridInteraction(e); // Combined particle/grid interaction
    });

    function applyMagneticEffect(e) {
        const activeWords = document.querySelectorAll('.text-section.active .word-animate.reveal');

        activeWords.forEach(word => {
            const rect = word.getBoundingClientRect();
            const wordCenterX = rect.left + rect.width / 2;
            const wordCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - wordCenterX, 2) +
                Math.pow(e.clientY - wordCenterY, 2)
            );

            if (distance < 100) { // Within 100px
                const strength = (100 - distance) / 100;
                const deltaX = (e.clientX - wordCenterX) * strength * 0.1;
                const deltaY = (e.clientY - wordCenterY) * strength * 0.1;

                word.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${1 + strength * 0.1})`;
            } else {
                word.style.transform = '';
            }
        });
    }

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

            if (distance < 150) {
                const strength = (150 - distance) / 150;
                particle.style.opacity = Math.min(1, 0.6 + strength * 0.4);
                particle.style.transform = `scale(${1 + strength * 2})`;
            } else {
                particle.style.opacity = '';
                particle.style.transform = '';
            }
        });

        // Grid interaction
        const gridLines = document.querySelectorAll('.grid-line');
        const mouseXPercent = (e.clientX / window.innerWidth) * 100;
        const mouseYPercent = (e.clientY / window.innerHeight) * 100;

        gridLines.forEach((line, index) => {
            if (index < 3) { // Horizontal lines
                const lineY = parseFloat(line.style.top);
                const distance = Math.abs(mouseYPercent - lineY);
                if (distance < 20) {
                    line.style.opacity = Math.min(0.5, 0.1 + (20 - distance) / 20 * 0.4);
                } else {
                    line.style.opacity = ''; // Reset to default CSS opacity
                }
            } else { // Vertical lines
                const lineX = parseFloat(line.style.left);
                const distance = Math.abs(mouseXPercent - lineX);
                if (distance < 20) {
                    line.style.opacity = Math.min(0.5, 0.1 + (20 - distance) / 20 * 0.4);
                } else {
                    line.style.opacity = ''; // Reset to default CSS opacity
                }
            }
        });
    }

    // Easter eggs (unchanged)
    let konamiCode = [];
    const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > correctCode.length) {
            konamiCode.shift();
        }

        if (konamiCode.length === correctCode.length &&
            konamiCode.every((code, index) => code === correctCode[index])) {
            // Easter egg: Add rainbow effect
            body.style.animation = 'rainbow-bg 2s infinite';

            setTimeout(() => {
                body.style.animation = '';
            }, 10000);
        }
    });

    // Add rainbow animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});