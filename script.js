// Navigation functionality
class PageNavigator {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showPage(this.currentPage);
    }

    bindEvents() {
        // Add click event listeners to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });

        // Handle form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e);
            });
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                const pages = ['home', 'about', 'services', 'contact'];
                const currentIndex = pages.indexOf(this.currentPage);
                
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    e.preventDefault();
                    this.navigateToPage(pages[currentIndex - 1]);
                } else if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
                    e.preventDefault();
                    this.navigateToPage(pages[currentIndex + 1]);
                }
            }
        });
    }

    navigateToPage(pageName) {
        if (pageName === this.currentPage) return;

        // Update navigation active state
        this.updateNavigation(pageName);
        
        // Show the target page
        this.showPage(pageName);
        
        // Update current page
        this.currentPage = pageName;

        // Add to browser history
        this.updateHistory(pageName);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateNavigation(activePage) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showPage(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Trigger entrance animation
            this.animatePageEntrance(targetPage);
        }
    }

    animatePageEntrance(pageElement) {
        // Reset animation
        pageElement.style.animation = 'none';
        pageElement.offsetHeight; // Trigger reflow
        pageElement.style.animation = 'fadeIn 0.5s ease-in-out';
    }

    updateHistory(pageName) {
        const url = pageName === 'home' ? '/' : `/#${pageName}`;
        history.pushState({ page: pageName }, '', url);
    }

    handleFormSubmission(event) {
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Simulate form submission
        this.showFormFeedback('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        event.target.reset();
        
        console.log('Form submitted:', data);
    }

    showFormFeedback(message) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.querySelector('#feedback-styles')) {
            const style = document.createElement('style');
            style.id = 'feedback-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Insert feedback
        const form = document.querySelector('.contact-form');
        form.appendChild(feedback);

        // Remove feedback after 5 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    feedback.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        navigator.navigateToPage(event.state.page);
    } else {
        // Handle initial page load from URL hash
        const hash = window.location.hash.substring(1);
        const page = hash || 'home';
        navigator.navigateToPage(page);
    }
});

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigator = new PageNavigator();
    
    // Handle initial page load from URL hash
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'about', 'services', 'contact'].includes(hash)) {
        window.navigator.navigateToPage(hash);
    }
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Preload page content
class ContentPreloader {
    constructor() {
        this.preloadedContent = new Set();
        this.init();
    }

    init() {
        // Preload critical content after initial page load
        setTimeout(() => {
            this.preloadPageContent();
        }, 1000);
    }

    preloadPageContent() {
        const pages = document.querySelectorAll('.page:not(.active)');
        pages.forEach(page => {
            // Trigger any lazy-loaded content
            const images = page.querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        });
    }
}

// Initialize content preloader
document.addEventListener('DOMContentLoaded', () => {
    new ContentPreloader();
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels for better accessibility
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const pageName = link.getAttribute('data-page');
        link.setAttribute('aria-label', `Navigate to ${pageName} page`);
        link.setAttribute('role', 'tab');
    });

    // Add keyboard navigation hints
    const helpText = document.createElement('div');
    helpText.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.9rem;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 1001;
    `;
    helpText.textContent = 'Use Alt + ← → to navigate pages';
    document.body.appendChild(helpText);

    // Show help text on Alt key press
    let altKeyPressed = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Alt' && !altKeyPressed) {
            altKeyPressed = true;
            helpText.style.opacity = '1';
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Alt') {
            altKeyPressed = false;
            helpText.style.opacity = '0';
        }
    });
});