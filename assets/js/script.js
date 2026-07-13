document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Set Current Year in Footer
       ========================================================================== */
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       Custom Cursor Logic
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    // Check if device supports hover (ignore touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice && cursor && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
            });
        });

        // Add hover effect to interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card');
        
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    /* ==========================================================================
       Header Scroll Effect
       ========================================================================== */
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Navigation Toggle
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       Smooth Scrolling & Active Link State
       ========================================================================== */
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            // Allow for a little offset so it activates right before section hits the top
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

    /* ==========================================================================
       Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* ==========================================================================
       Contact Form Submission Mock
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get button to show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate network request
            setTimeout(() => {
                formStatus.innerHTML = '<span style="color: #27c93f;"><i class="fa-solid fa-circle-check"></i> Pesan berhasil dikirim! Saya akan segera menghubungi Anda.</span>';
                contactForm.reset();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            }, 1500);
        });
    }
});
