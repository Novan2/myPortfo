/* ==========================================================================
   Force Scroll to Top on Refresh
   ========================================================================== */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ==========================================================================
   Preloader Logic
   ========================================================================== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Tambahkan delay sedikit (misal 1 detik) agar efeknya terlihat jelas
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Trigger load animations
            setTimeout(() => {
                document.querySelectorAll('.load-anim-top, .load-anim-bottom').forEach(el => {
                    el.classList.add('loaded');
                });
            }, 300); // Slight delay after preloader starts fading
        }, 1000);
    } else {
        document.querySelectorAll('.load-anim-top, .load-anim-bottom').forEach(el => {
            el.classList.add('loaded');
        });
    }
});

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
    const customCursor = document.querySelector('.custom-cursor');
    const customCursorDot = document.querySelector('.custom-cursor-dot');

    // Add custom cursor style for playful hero text
    const playfulLetters = document.querySelectorAll('.portfolio-playful .letter');
    playfulLetters.forEach(letter => {
        letter.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            customCursor.style.borderColor = 'var(--accent-primary)';
        });
        letter.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Check if device supports hover (ignore touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

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

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
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

            // Ambil data dari form
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Ambil token Turnstile
            const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;
            if (!turnstileToken) {
                formStatus.innerHTML = '<span style="color: #ff3366;"><i class="fa-solid fa-triangle-exclamation"></i> Harap selesaikan verifikasi keamanan.</span>';
                return;
            }

            // Get button to show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Initialize Supabase client
            const supabaseUrl = 'https://jfftdpzvhvvmmtnbkzqk.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZnRkcHp2aHZ2bW10bmJrenFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDY2NTQsImV4cCI6MjEwMDI4MjY1NH0.pUiFjc-pf-PKeQClfBOXmbkdRtE3UJ1ZGE-ByB7dN6A';
            const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

            // Send request to Supabase Edge Function
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
                        // Reset turnstile widget for next submission
                        if (window.turnstile) {
                            window.turnstile.reset();
                        }
                    }
                })
                .catch(error => {
                    console.error('Network Error:', error);
                    formStatus.innerHTML = '<span style="color: #ff3366;"><i class="fa-solid fa-circle-xmark"></i> Gagal terhubung ke server. Silakan coba lagi.</span>';
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                    }, 5000);
                });
        });
    }

    /* ==========================================================================
       Typing Effect
       ========================================================================== */
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
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
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       3D Nametag Effect
       ========================================================================== */
    const nametagCard = document.getElementById('nametagCard');
    const nametagGlare = document.getElementById('nametagGlare');
    const perspectiveContainer = document.querySelector('.perspective-container');

    if (nametagCard && perspectiveContainer) {
        perspectiveContainer.addEventListener('mousemove', (e) => {
            const rect = nametagCard.getBoundingClientRect();
            // Calculate mouse position relative to card center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Stop tracking if mouse is in the top 50% of the card
            if (y < centerY) {
                nametagCard.style.transition = 'transform 0.5s ease-out';
                nametagCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
                if (nametagGlare) {
                    nametagGlare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`;
                }
                return;
            }

            // Restore fast transition for smooth tracking in the bottom half
            nametagCard.style.transition = 'transform 0.1s ease-out';

            // Calculate tilt (max 15 degrees)
            const tiltX = ((y - centerY) / centerY) * -15; // Invert Y
            const tiltY = ((x - centerX) / centerX) * 15;

            // Apply 3D transform
            nametagCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            // Move glare
            if (nametagGlare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                nametagGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
            }
        });

        perspectiveContainer.addEventListener('mouseleave', () => {
            // Reset transform smoothly
            nametagCard.style.transition = 'transform 0.5s ease-out';
            nametagCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
            if (nametagGlare) {
                nametagGlare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`;
            }
            
            // Revert back to fast transition for mousemove tracking
            setTimeout(() => {
                nametagCard.style.transition = 'transform 0.1s ease-out';
            }, 500);
        });
        
        perspectiveContainer.addEventListener('mouseenter', () => {
            nametagCard.style.transition = 'transform 0.1s ease-out';
        });
    }
});
