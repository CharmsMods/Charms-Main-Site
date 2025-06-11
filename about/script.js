// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all sections and words
    const sections = document.querySelectorAll('.text-section');
    const words = document.querySelectorAll('.word-animate');
    const body = document.body;
    
    // Current section tracking
    let currentSection = 0;
    let isScrolling = false;
    
    // Initialize first section
    if (sections.length > 0) {
        sections[0].classList.add('active');
        animateWordsIn(sections[0]);
        body.setAttribute('data-current-section', sections[0].getAttribute('data-section'));
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
        let newCurrentSection = 0;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - windowHeight / 2 && 
                scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
                newCurrentSection = index;
            }
        });
        
        // If section changed, update
        if (newCurrentSection !== currentSection) {
            changeSection(newCurrentSection);
        }
    }
    
    function changeSection(newIndex) {
        if (isScrolling || newIndex === currentSection) return;
        
        isScrolling = true;
        const oldSection = sections[currentSection];
        const newSection = sections[newIndex];
        
        // Hide old section words
        animateWordsOut(oldSection);
        
        // Update current section
        currentSection = newIndex;
        
        // Update background
        body.setAttribute('data-current-section', newSection.getAttribute('data-section'));
        
        // Show new section after delay
        setTimeout(() => {
            // Remove active from all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active to new section
            newSection.classList.add('active');
            
            // Animate words in
            animateWordsIn(newSection);
            
            isScrolling = false;
        }, 300);
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