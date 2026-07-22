/**
 * myPortfo - Main Script
 * Refactored into feature-based functions for easy readability & maintenance.
 */

// ==========================================================================
// 1. Core Initialization (Entry Point)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollRestoration();
    initPreloader();
    initFooterYear();
    initCustomCursor();
    initNavigation();
    initScrollReveal();
    initTypingEffect();
    init3DNametag();
    initContactForm();
});

// ==========================================================================
// 2. Feature Implementations
// ==========================================================================

/**
 * 2.1 Force Scroll to Top on Refresh
 */
function initScrollRestoration() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
}

/**
 * 2.2 Preloader & Video Background Logic
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const heroVideo = document.querySelector('.hero-video-overlay');

    const hidePreloader = () => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    document.querySelectorAll('.load-anim-top, .load-anim-bottom').forEach(el => {
                        el.classList.add('loaded');
                    });
                }, 300);
            }, 1000);
        }
    };

    if (preloader) {
        if (heroVideo) {
            // Check if video is already cached and ready
            if (heroVideo.readyState >= 3) {
                hidePreloader();
            } else {
                heroVideo.addEventListener('canplaythrough', hidePreloader);
                heroVideo.addEventListener('error', hidePreloader);
                setTimeout(hidePreloader, 5000); // 5s fallback for slow internet
            }
        } else {
            hidePreloader();
        }
    } else {
        document.querySelectorAll('.load-anim-top, .load-anim-bottom').forEach(el => {
            el.classList.add('loaded');
        });
    }
}

/**
 * 2.3 Footer Copyright Year
 */
function initFooterYear() {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * 2.4 Custom Cursor Logic
 */
function initCustomCursor() {
    const customCursor = document.querySelector('.custom-cursor');
    const customCursorDot = document.querySelector('.custom-cursor-dot');
    const playfulLetters = document.querySelectorAll('.portfolio-playful .letter');
    const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card');
    
    // Check if device supports hover (ignore touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && customCursor && customCursorDot) {
        // Cursor follow movement
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                customCursor.style.left = `${e.clientX}px`;
                customCursor.style.top = `${e.clientY}px`;
                customCursorDot.style.left = `${e.clientX}px`;
                customCursorDot.style.top = `${e.clientY}px`;
            });
        });

        // Hover effects on playful text
        playfulLetters.forEach(letter => {
            letter.addEventListener('mouseenter', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                customCursor.style.borderColor = 'var(--accent-primary)';
            });
            letter.addEventListener('mouseleave', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        // Hover effects on buttons and interactive elements
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
        });
    }
}

/**
 * 2.5 Navigation (Header Scroll, Mobile Menu, Active Links)
 */
function initNavigation() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    // Header Background on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Active Link Highlighting on Scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const headerHeight = document.querySelector('header').offsetHeight;
            if (pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * 2.6 Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
}

/**
 * 2.7 Typing Text Effect for Hero Section
 */
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const roles = ["Tech Enthusiast", "Web Designer", "UI/UX Engineer", "Frontend Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
}

/**
 * 2.8 3D Hover Effect for Nametag Card
 */
function init3DNametag() {
    const nametagCard = document.getElementById('nametagCard');
    const nametagGlare = document.getElementById('nametagGlare');
    const perspectiveContainer = document.querySelector('.perspective-container');

    if (!nametagCard || !perspectiveContainer) return;

    perspectiveContainer.addEventListener('mousemove', (e) => {
        const rect = nametagCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Stop tracking if mouse is in the top half of the card
        if (y < centerY) {
            nametagCard.style.transition = 'transform 0.5s ease-out';
            nametagCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
            if (nametagGlare) nametagGlare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`;
            return;
        }

        // Apply 3D tilt effect
        nametagCard.style.transition = 'transform 0.1s ease-out';
        const tiltX = ((y - centerY) / centerY) * -15; 
        const tiltY = ((x - centerX) / centerX) * 15;
        nametagCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Move glare effect
        if (nametagGlare) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            nametagGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
        }
    });

    perspectiveContainer.addEventListener('mouseleave', () => {
        nametagCard.style.transition = 'transform 0.5s ease-out';
        nametagCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
        if (nametagGlare) nametagGlare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`;
        
        setTimeout(() => { nametagCard.style.transition = 'transform 0.1s ease-out'; }, 500);
    });

    perspectiveContainer.addEventListener('mouseenter', () => {
        nametagCard.style.transition = 'transform 0.1s ease-out';
    });
}

/**
 * 2.9 Contact Form API Integration & CAPTCHA
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

            if (!turnstileToken) {
                formStatus.innerHTML = '<span style="color: #ff3366;"><i class="fa-solid fa-triangle-exclamation"></i> Harap selesaikan verifikasi keamanan.</span>';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const supabaseUrl = 'https://jfftdpzvhvvmmtnbkzqk.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZnRkcHp2aHZ2bW10bmJrenFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDY2NTQsImV4cCI6MjEwMDI4MjY1NH0.pUiFjc-pf-PKeQClfBOXmbkdRtE3UJ1ZGE-ByB7dN6A';
            const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

            supabase.functions.invoke('verify-captcha', {
                body: { name, email, message, turnstileToken }
            })
            .then(({ data, error }) => {
                if (error) {
                    console.error('Supabase Edge Function error:', error);
                    formStatus.innerHTML = '<span style="color: #ff3366;"><i class="fa-solid fa-circle-xmark"></i> Gagal mengirim pesan: ' + error.message + '</span>';
                } else {
                    formStatus.innerHTML = '<span style="color: #27c93f;"><i class="fa-solid fa-circle-check"></i> Pesan berhasil terkirim! Saya akan segera menghubungi Anda.</span>';
                    contactForm.reset();
                    if (window.turnstile) window.turnstile.reset();
                }
            })
            .catch(error => {
                console.error('Network Error:', error);
                formStatus.innerHTML = '<span style="color: #ff3366;"><i class="fa-solid fa-circle-xmark"></i> Gagal terhubung ke server. Silakan coba lagi.</span>';
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                setTimeout(() => { formStatus.innerHTML = ''; }, 5000);
            });
        });
    }
}
