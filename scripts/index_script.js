 if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        document.addEventListener('DOMContentLoaded', () => {
            window.scrollTo(0, 0);
            const splash = document.getElementById('intro-splash');
            
            // The splash screen transitions out after 2 seconds.
            // This aligns with our cardEntrance CSS animation (starts at 0.2s, takes 1.6s).
            setTimeout(() => {
                if (splash) {
                    splash.classList.add('fade-out');
                    document.body.classList.remove('loading');
                    window.scrollTo(0, 0);
                    
                    // Clean up the DOM element after transition completes to save resources
                    setTimeout(() => {
                        splash.remove();
                    }, 800); // 800ms matches the CSS transition time for #intro-splash
                }
            }, 2000);

            // Logo Hover Background transparency trigger
            const logos = document.querySelectorAll('#brand-container #logo, .sidebar-brand-container .sidebar-logo');
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                logos.forEach(logo => {
                    logo.addEventListener('mouseenter', () => {
                        sidebar.classList.add('logo-hovered');
                    });
                    logo.addEventListener('mouseleave', () => {
                        sidebar.classList.remove('logo-hovered');
                    });
                });
            }

            // Scroll Spy for Sidebar Active States
            const sections = [
                document.getElementById('about'),
                document.getElementById('education'),
                document.getElementById('volunteering'),
                document.getElementById('skills'),
                document.getElementById('designs'),
                document.getElementById('contact')
            ].filter(el => el !== null);
            
            const sidebarLinks = document.querySelectorAll('.sidebar-link[href^="#"]');
            
            function updateActiveLink() {
                let currentActiveId = '';
                const scrollPosition = window.scrollY + 200; // Trigger offset
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentActiveId = section.getAttribute('id');
                    }
                });
                
                // If scroll position is near the bottom of the page, activate the last element (contact)
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                    currentActiveId = '';
                }
                
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentActiveId}`) {
                        link.classList.add('active');
                    }
                });
            }
            
            window.addEventListener('scroll', updateActiveLink);
            updateActiveLink(); // Run initially

            // Dynamic Typing & Erasing Designation Animation
            const typedTextSpan = document.getElementById("typed-text");
            const designations = ["an Engineering Student", "a Graphic Designer"];
            const typingSpeed = 100;
            const erasingSpeed = 60;
            const newTextDelay = 2000; // Delay before erasing
            let designationIndex = 0;
            let charIndex = 0;

            function type() {
                if (charIndex < designations[designationIndex].length) {
                    typedTextSpan.textContent += designations[designationIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingSpeed);
                } else {
                    setTimeout(erase, newTextDelay);
                }
            }

            function erase() {
                if (charIndex > 0) {
                    typedTextSpan.textContent = designations[designationIndex].substring(0, charIndex - 1);
                    charIndex--;
                    setTimeout(erase, erasingSpeed);
                } else {
                    designationIndex = (designationIndex + 1) % designations.length;
                    setTimeout(type, typingSpeed + 500); // Pause before next word
                }
            }

            // Start typing effect after page load transitions settle
            if (typedTextSpan) {
                typedTextSpan.textContent = ""; // Clear fallback noscript text
                setTimeout(type, 3000);
            }

            // Initialize skills: store target values and set initial widths/texts to 0
            const skillsBoard = document.querySelector('.skills-board');
            if (skillsBoard) {
                const skillItems = skillsBoard.querySelectorAll('.skill-bar-item');
                skillItems.forEach(item => {
                    const fill = item.querySelector('.skill-bar-fill');
                    const percentSpan = item.querySelector('.skill-percent');
                    
                    if (fill && percentSpan) {
                        // Store the target width (e.g. "95%") and target percent number (e.g. 95)
                        const targetWidth = fill.style.width || '0%';
                        fill.dataset.targetWidth = targetWidth;
                        percentSpan.dataset.targetPercent = parseInt(percentSpan.textContent, 10) || 0;
                        
                        // Disable transition temporarily to prevent backward animation on load
                        fill.style.transition = 'none';
                        fill.style.width = '0%';
                        // Trigger a reflow
                        void fill.offsetHeight;
                        fill.style.transition = '';
                        
                        percentSpan.textContent = '0%';
                    }
                });
            }

            function animateCount(element, target, duration = 1500) {
                const startValue = 0;
                const startTime = performance.now();
                
                if (element.animationFrameId) {
                    cancelAnimationFrame(element.animationFrameId);
                }
                
                function update(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    if (elapsedTime >= duration) {
                        element.textContent = target + '%';
                        return;
                    }
                    
                    const progress = elapsedTime / duration;
                    // Cubic ease out to match the progress bar transition
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
                    
                    element.textContent = currentValue + '%';
                    element.animationFrameId = requestAnimationFrame(update);
                }
                
                element.animationFrameId = requestAnimationFrame(update);
            }

            function animateSkills(board) {
                const skillItems = board.querySelectorAll('.skill-bar-item');
                skillItems.forEach(item => {
                    const fill = item.querySelector('.skill-bar-fill');
                    const percentSpan = item.querySelector('.skill-percent');
                    
                    if (fill && percentSpan) {
                        fill.style.width = fill.dataset.targetWidth;
                        const targetPercent = parseInt(percentSpan.dataset.targetPercent, 10) || 0;
                        animateCount(percentSpan, targetPercent);
                    }
                });
            }

            function resetSkills(board) {
                const skillItems = board.querySelectorAll('.skill-bar-item');
                skillItems.forEach(item => {
                    const fill = item.querySelector('.skill-bar-fill');
                    const percentSpan = item.querySelector('.skill-percent');
                    
                    if (fill && percentSpan) {
                        if (percentSpan.animationFrameId) {
                            cancelAnimationFrame(percentSpan.animationFrameId);
                        }
                        fill.style.width = '0%';
                        percentSpan.textContent = '0%';
                    }
                });
            }

            // Scroll Fade-in Observer
            const scrollFadeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        if (entry.target.classList.contains('skills-board')) {
                            animateSkills(entry.target);
                        }
                    } else {
                        entry.target.classList.remove('visible');
                        if (entry.target.classList.contains('skills-board')) {
                            resetSkills(entry.target);
                        }
                    }
                });
            }, {
                threshold: 0.05, // Trigger when 5% of the element is visible
                rootMargin: '0px 0px -50px 0px' // Slightly offset trigger point
            });

            // Observe all scroll-fade elements
            document.querySelectorAll('.scroll-fade').forEach(el => {
                scrollFadeObserver.observe(el);
            });
        });

        // Safety scroll reset on page load complete
        window.addEventListener('load', () => {
            window.scrollTo(0, 0);
        });