/**
 * Testimonials Stream Animation - Pure JavaScript Implementation
 * Seamless infinite scrolling without CSS animations
 */

class TestimonialsStreamJS {
    constructor() {
        this.stream = document.querySelector('.testimonials-stream-1');
        this.isScrolling = true;
        this.scrollPosition = 0;
        this.scrollSpeed = 1; // pixels per frame
        this.animationId = null;
        this.originalWidth = 0;
        this.totalWidth = 0;
        this.isPaused = false;

        this.init();
    }

    init() {
        if (!this.stream) return;

        this.setupSeamlessLoop();
        this.calculateDimensions();
        this.bindEvents();
        this.startAnimation();
    }

    setupSeamlessLoop() {
        const originalCards = Array.from(this.stream.querySelectorAll('.testimonial-card:not(.testimonial-clone)'));

        // Create enough duplicates for seamless scrolling
        // We need at least 3 complete sets to ensure smooth looping
        for (let i = 0; i < 3; i++) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('testimonial-clone');
                this.stream.appendChild(clone);
            });
        }
    }

    calculateDimensions() {
        // Calculate the width of one complete set of original cards
        const originalCards = this.stream.querySelectorAll('.testimonial-card:not(.testimonial-clone)');
        let width = 0;

        originalCards.forEach((card, index) => {
            width += card.offsetWidth;
            if (index < originalCards.length - 1) {
                width += 24; // gap of 1.5rem (24px)
            }
        });

        this.originalWidth = width + 24; // Add one more gap
        this.totalWidth = this.stream.scrollWidth;

        // Set initial position
        this.scrollPosition = 0;
    }

    startAnimation() {
        if (!this.isScrolling || this.isPaused) return;

        this.animationId = requestAnimationFrame(() => {
            this.updatePosition();
            this.startAnimation();
        });
    }

    updatePosition() {
        this.scrollPosition += this.scrollSpeed;

        // When we've scrolled one complete set width, reset to create seamless loop
        if (this.scrollPosition >= this.originalWidth) {
            this.scrollPosition = 0;
        }

        // Apply the transform
        this.stream.style.transform = `translateX(-${this.scrollPosition}px)`;
    }

    pauseAnimation() {
        this.isPaused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resumeAnimation() {
        if (!this.isPaused) return;

        this.isPaused = false;
        this.startAnimation();
    }

    bindEvents() {
        // Pause on hover
        this.stream.addEventListener('mouseenter', () => {
            this.pauseAnimation();
        });

        this.stream.addEventListener('mouseleave', () => {
            this.resumeAnimation();
        });

        // Pause when user focuses on any testimonial (accessibility)
        this.stream.addEventListener('focusin', () => {
            this.pauseAnimation();
        });

        this.stream.addEventListener('focusout', () => {
            this.resumeAnimation();
        });

        // Touch support for mobile
        let touchTimeout = null;
        this.stream.addEventListener('touchstart', () => {
            this.pauseAnimation();
            if (touchTimeout) clearTimeout(touchTimeout);
        });

        this.stream.addEventListener('touchend', () => {
            touchTimeout = setTimeout(() => {
                this.resumeAnimation();
            }, 1500);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Pause when page is not visible - but only if completely hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else if (!this.stream.matches(':hover')) {
                // Only resume if not hovering
                this.resumeAnimation();
            }
        });

        // Intersection Observer for performance - made less aggressive
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Only pause if completely out of view
                    if (entry.intersectionRatio > 0) {
                        this.resumeAnimation();
                    } else {
                        // Only pause if completely invisible
                        this.pauseAnimation();
                    }
                });
            }, {
                threshold: [0, 0.1], // Multiple thresholds
                rootMargin: '50px' // Add margin to be less aggressive
            });

            observer.observe(this.stream);
        }
    }

    handleResize() {
        // Recalculate dimensions on resize
        setTimeout(() => {
            this.calculateDimensions();
        }, 100);
    }

    // Public methods
    setSpeed(speed) {
        this.scrollSpeed = speed;
    }

    stop() {
        this.isScrolling = false;
        this.pauseAnimation();
    }

    start() {
        this.isScrolling = true;
        this.resumeAnimation();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the testimonials stream animation
    const testimonialsAnimation = new TestimonialsStreamJS();

    // Make it globally accessible for debugging
    window.testimonialsAnimation = testimonialsAnimation;

    // Adjust speed based on screen size
    const updateSpeed = () => {
        if (window.innerWidth <= 480) {
            testimonialsAnimation.setSpeed(0.8);
        } else if (window.innerWidth <= 768) {
            testimonialsAnimation.setSpeed(1);
        } else {
            testimonialsAnimation.setSpeed(1.2);
        }
    };

    updateSpeed();
    window.addEventListener('resize', updateSpeed);
});

// Export for potential external use
window.TestimonialsStream = {
    JS: TestimonialsStreamJS
};
