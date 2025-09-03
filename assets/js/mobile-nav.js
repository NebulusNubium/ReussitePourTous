/**
 * Mobile Navigation Menu
 * Handles the responsive menu toggle functionality
 */

class MobileNavigation {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.isOpen = false;

        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navMenu) return;

        this.bindEvents();
        this.setupInitialState();
    }

    setupInitialState() {
        // Ensure menu is closed on load
        this.closeMenu();
    }

    bindEvents() {
        // Toggle menu on button click
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menuToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.menuToggle.focus();
            }
        });

        // Close menu when window is resized to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle menu link clicks on mobile
        const menuLinks = this.navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu when a link is clicked on mobile
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.navMenu.classList.add('is-open');
        this.menuToggle.classList.add('is-open');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuToggle.setAttribute('aria-label', 'Fermer le menu');

        // Focus management for accessibility
        const firstMenuItem = this.navMenu.querySelector('a');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isOpen = false;
        this.navMenu.classList.remove('is-open');
        this.menuToggle.classList.remove('is-open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Ouvrir le menu');

        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Public method to programmatically close menu
    close() {
        this.closeMenu();
    }

    // Public method to check if menu is open
    get isMenuOpen() {
        return this.isOpen;
    }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = new MobileNavigation();

    // Make it globally accessible for debugging
    window.mobileNav = mobileNav;
});

// Export for potential external use
window.MobileNavigation = MobileNavigation;
