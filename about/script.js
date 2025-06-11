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

    // Map section data-section names to their respective background classes
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
    let currentSection = 0;
    let isScrolling = false;

    // Initialize first section and background
    if (sections.length > 0) {
        sections[0].classList.add('active');
        animateWordsIn(sections[0]);
        const initialSectionName = sections[0].getAttribute('data-section');
        body.setAttribute('data-current-section', initialSectionName);

        // Set the initial background for the first layer and make it visible
        currentBgLayer.style.background = sectionBackgrounds[initialSectionName];
        currentBgLayer.style.opacity = '1';
    }

    // Scroll event handler with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 16); // ~60fps
    });

    function handleScroll() {
        if (isScrolling) return;

        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Find which section should be active
        let newCurrentSectionIndex = 0;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop - windowHeight / 2 &&
                scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
                newCurrentSectionIndex = index;
            }
        });

        // If section changed, update
        if (newCurrentSectionIndex !== currentSection) {
            changeSection(newCurrentSectionIndex);
        }
    }

    function changeSection(newIndex) {
        if (isScrolling || newIndex === currentSection) return;

        isScrolling = true;
        const oldSection = sections[currentSection];
        const newSection = sections[newIndex];
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

        // Swap the layers after the transition
        setTimeout(() => {
            currentBgLayer.style.background = 'none'; // Clear background of the now hidden layer
            // Swap references
            const temp = currentBgLayer;
            currentBgLayer = nextBgLayer;
            nextBgLayer = temp;
        }, 1500); // This timeout should match the CSS transition duration (1.5s = 1500ms)

        // Update current section
        currentSection = newIndex;

        // Show new section text after delay
        setTimeout(() => {
            // Remove active from all sections
            sections.forEach(section => section.classList.remove('active'));

            // Add active to new section
            newSection.classList.add('active');

            // Animate words in
            animateWordsIn(newSection);

            isScrolling = false;
        }, 300); // This timeout is for word animations, can be adjusted
    }

    function animateWordsIn(section) {
        const sectionWords = section.querySelectorAll('.word-animate');

        sectionWords.forEach((word, index) => {
            setTimeout(() => {
                word.classList.remove('hide');
                word.classList.add('reveal');
            }, index * 100); // Stagger the animations
        });
    }

    function animateWordsOut(section) {
        const sectionWords = section.querySelectorAll('.word-animate');

        sectionWords.forEach((word, index) => {
            setTimeout(() => {
                word.classList.remove('reveal');
                word.classList.add('hide');
            }, index * 50); // Faster hide animation
        });
    }

    // Mouse movement for magnetic effects
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update custom cursor position (if you want to add one)
        updateCursor(mouseX, mouseY);

        // Magnetic effect for words
        applyMagneticEffect(e);
    });

    function updateCursor(x, y) {
        // This would update a custom cursor if we add one
        document.documentElement.style.setProperty('--mouse-x', x + 'px');
        document.documentElement.style.setProperty('--mouse-y', y + 'px');
    }

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

    // Particle interaction
    const particles = document.querySelectorAll('.particle');

    document.addEventListener('mousemove', function(e) {
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
    });

    // Grid interaction
    const gridLines = document.querySelectorAll('.grid-line');

    document.addEventListener('mousemove', function(e) {
        const mouseXPercent = (e.clientX / window.innerWidth) * 100;
        const mouseYPercent = (e.clientY / window.innerHeight) * 100;

        gridLines.forEach((line, index) => {
            if (index < 3) { // Horizontal lines
                const lineY = parseInt(line.style.top);
                const distance = Math.abs(mouseYPercent - lineY);
                if (distance < 20) {
                    line.style.opacity = Math.min(0.5, 0.1 + (20 - distance) / 20 * 0.4);
                }
            } else { // Vertical lines
                const lineX = parseInt(line.style.left);
                const distance = Math.abs(mouseXPercent - lineX);
                if (distance < 20) {
                    line.style.opacity = Math.min(0.5, 0.1 + (20 - distance) / 20 * 0.4);
                }
            }
        });
    });

    // Smooth scrolling for better experience
    let scrolling = false;

    window.addEventListener('wheel', function(e) {
        if (scrolling) {
            e.preventDefault();
            return;
        }

        // Optional: Add smooth snap-to-section scrolling
        // Uncomment below for snap scrolling behavior
        /*
        e.preventDefault();
        scrolling = true;

        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));

        if (nextSection !== currentSection) {
            sections[nextSection].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        setTimeout(() => {
            scrolling = false;
        }, 1000);
        */
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            const nextSection = Math.min(sections.length - 1, currentSection + 1);
            if (nextSection !== currentSection) {
                sections[nextSection].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevSection = Math.max(0, currentSection - 1);
            if (prevSection !== currentSection) {
                sections[prevSection].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });

    // Performance optimization: Intersection Observer for better scroll detection
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionIndex = Array.from(sections).indexOf(entry.target);
                if (sectionIndex !== currentSection && !isScrolling) {
                    changeSection(sectionIndex);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add some Easter eggs
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

    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});