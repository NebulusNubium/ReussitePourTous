/**
 * Testimonials Stream Animation
 * Auto-scrolling testimonials that pause on hover
 */

class TestimonialsStream {
    constructor() {
        this.container = document.querySelector('.testimonials-grid');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.isScrolling = true;
        this.scrollSpeed = 1; // pixels per frame
        this.scrollPosition = 0;
        this.animationId = null;
        this.containerWidth = 0;
        this.totalWidth = 0;

        this.init();
    }

    init() {
        if (!this.container || this.cards.length === 0) return;

        this.setupContainer();
        this.cloneCards();
        this.calculateDimensions();
        this.bindEvents();
        this.startAnimation();
    }

    setupContainer() {
        // Transform grid into horizontal scrolling container
        this.container.style.display = 'flex';
        this.container.style.flexWrap = 'nowrap';
        this.container.style.overflow = 'hidden';
        this.container.style.gap = '2rem';
        this.container.style.width = '100%';
        this.container.style.position = 'relative';
    }

    cloneCards() {
        // Clone cards to create seamless loop
        const originalCards = Array.from(this.cards);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('testimonial-clone');
            this.container.appendChild(clone);
        });

        // Update cards list to include clones
        this.cards = document.querySelectorAll('.testimonial-card');
    }

    calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;

        // Set minimum width for each card
        this.cards.forEach(card => {
            card.style.minWidth = '350px';
            card.style.flexShrink = '0';
        });

        // Calculate total width of all original cards plus gaps
        const cardWidth = 350; // minimum width
        const gap = 32; // 2rem in pixels
        const originalCardCount = this.cards.length / 2; // half are clones
        this.totalWidth = (cardWidth + gap) * originalCardCount;
    }

    bindEvents() {
        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.pauseAnimation();
        });

        this.container.addEventListener('mouseleave', () => {
            this.resumeAnimation();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.calculateDimensions();
        });

        // Pause when user focuses on any testimonial (accessibility)
        this.container.addEventListener('focusin', () => {
            this.pauseAnimation();
        });

        this.container.addEventListener('focusout', () => {
            this.resumeAnimation();
        });
    }

    startAnimation() {
        if (!this.isScrolling) return;

        this.animationId = requestAnimationFrame(() => {
            this.updatePosition();
            this.startAnimation();
        });
    }

    updatePosition() {
        this.scrollPosition += this.scrollSpeed;

        // Reset position when we've scrolled past one complete set
        if (this.scrollPosition >= this.totalWidth) {
            this.scrollPosition = 0;
        }

        // Apply transform
        this.container.style.transform = `translateX(-${this.scrollPosition}px)`;
    }

    pauseAnimation() {
        this.isScrolling = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Add visual feedback
        this.container.style.animationPlayState = 'paused';
    }

    resumeAnimation() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        this.startAnimation();

        // Remove visual feedback
        this.container.style.animationPlayState = 'running';
    }
}

// Alternative implementation: CSS-based animation with JS controls
class TestimonialsStreamCSS {
    constructor() {
        this.section = document.querySelector('.testimonials');
        this.container = document.querySelector('.testimonials-grid');
        this.cards = document.querySelectorAll('.testimonial-card');

        this.init();
    }

    init() {
        if (!this.container || this.cards.length === 0) return;

        this.setupStreamLayout();
        this.addCSSAnimation();
        this.bindEvents();
    }

    setupStreamLayout() {
        // Create wrapper for infinite scroll
        const wrapper = document.createElement('div');
        wrapper.className = 'testimonials-stream-wrapper';

        // Create two identical sets for seamless loop
        const firstSet = document.createElement('div');
        firstSet.className = 'testimonials-set';

        const secondSet = document.createElement('div');
        secondSet.className = 'testimonials-set';

        // Clone cards into both sets
        this.cards.forEach(card => {
            const clone1 = card.cloneNode(true);
            const clone2 = card.cloneNode(true);
            firstSet.appendChild(clone1);
            secondSet.appendChild(clone2);
        });

        wrapper.appendChild(firstSet);
        wrapper.appendChild(secondSet);

        // Replace original grid
        this.container.innerHTML = '';
        this.container.appendChild(wrapper);
        this.container.classList.add('testimonials-stream');
    }

    addCSSAnimation() {
        // Add CSS for streaming animation
        const style = document.createElement('style');
        style.textContent = `
            .testimonials-stream {
                overflow: hidden !important;
                mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
                -webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
            }
            
            .testimonials-stream-wrapper {
                display: flex;
                animation: stream 60s linear infinite;
                gap: 2rem;
            }
            
            .testimonials-set {
                display: flex;
                gap: 2rem;
                flex-shrink: 0;
            }
            
            .testimonials-set .testimonial-card {
                min-width: 350px;
                flex-shrink: 0;
            }
            
            @keyframes stream {
                from {
                    transform: translateX(0);
                }
                to {
                    transform: translateX(-50%);
                }
            }
            
            .testimonials-stream-wrapper:hover {
                animation-play-state: paused;
            }
            
            @media (max-width: 768px) {
                .testimonials-set .testimonial-card {
                    min-width: 300px;
                }
                
                @keyframes stream {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }
            }
            
            /* Smooth hover transition */
            .testimonials-stream-wrapper {
                transition: animation-play-state 0.3s ease;
            }
            
            /* Focus handling for accessibility */
            .testimonials-stream:focus-within .testimonials-stream-wrapper {
                animation-play-state: paused;
            }
        `;

        document.head.appendChild(style);
    }

    bindEvents() {
        const wrapper = this.container.querySelector('.testimonials-stream-wrapper');
        if (!wrapper) return;

        // Add keyboard navigation support
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.toggleAnimation();
            }
        });

        // Add touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            wrapper.style.animationPlayState = 'paused';
        });

        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            setTimeout(() => {
                wrapper.style.animationPlayState = 'running';
            }, 1000); // Resume after 1 second
        });
    }

    toggleAnimation() {
        const wrapper = this.container.querySelector('.testimonials-stream-wrapper');
        if (!wrapper) return;

        const currentState = getComputedStyle(wrapper).animationPlayState;
        wrapper.style.animationPlayState = currentState === 'paused' ? 'running' : 'paused';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use CSS-based implementation for better performance
    new TestimonialsStreamCSS();
});

// Fallback for older browsers or if CSS animations are disabled
if (!CSS.supports('animation', 'stream 60s linear infinite')) {
    document.addEventListener('DOMContentLoaded', () => {
        new TestimonialsStream();
    });
}
