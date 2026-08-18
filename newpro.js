document.addEventListener('DOMContentLoaded', function() {
    // Typing Animation
    const nameText = "Hi, I'm Sayan Ghosh";
    const roleText = "Data Science & ML Developer";
    const typingNameElement = document.getElementById('typingName');
    const typingRoleElement = document.getElementById('typingRole');
    
    let nameIndex = 0;
    let roleIndex = 0;
    let isDeletingName = false;
    let isDeletingRole = false;
    let nameTypingSpeed = 100;
    let roleTypingSpeed = 100;
    
    function typeName() {
        const currentText = nameText;
        
        if (isDeletingName) {
            typingNameElement.textContent = currentText.substring(0, nameIndex - 1);
            nameIndex--;
            nameTypingSpeed = 50;
        } else {
            typingNameElement.textContent = currentText.substring(0, nameIndex + 1);
            nameIndex++;
            nameTypingSpeed = 100;
        }
        
        if (!isDeletingName && nameIndex === currentText.length) {
            isDeletingName = true;
            nameTypingSpeed = 2000; // Pause before deleting
        } else if (isDeletingName && nameIndex === 0) {
            isDeletingName = false;
            nameTypingSpeed = 500; // Pause before typing again
        }
        
        setTimeout(typeName, nameTypingSpeed);
    }
    
    function typeRole() {
        const currentText = roleText;
        
        if (isDeletingRole) {
            typingRoleElement.textContent = currentText.substring(0, roleIndex - 1);
            roleIndex--;
            roleTypingSpeed = 50;
        } else {
            typingRoleElement.textContent = currentText.substring(0, roleIndex + 1);
            roleIndex++;
            roleTypingSpeed = 100;
        }
        
        if (!isDeletingRole && roleIndex === currentText.length) {
            isDeletingRole = true;
            roleTypingSpeed = 2000; // Pause before deleting
        } else if (isDeletingRole && roleIndex === 0) {
            isDeletingRole = false;
            roleTypingSpeed = 500; // Pause before typing again
        }
        
        setTimeout(typeRole, roleTypingSpeed);
    }
    
    // Start typing animations with a delay
    if (typingNameElement) {
        setTimeout(typeName, 500);
    }
    if (typingRoleElement) {
        setTimeout(typeRole, 1500);
    }
    
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navContainer = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        navContainer.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navContainer.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Smooth scrolling / slide navigation for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const targetId = href.startsWith('#') ? href : `#${href}`;
            const targetElement = document.querySelector(targetId);

            // If the target is one of the slide sections, activate it via showSlide to avoid
            // scrolling to elements that may be hidden by the slide system.
            if (targetElement && targetElement.classList && targetElement.classList.contains('slide')) {
                e.preventDefault();
                if (typeof showSlide === 'function') {
                    showSlide(targetId);
                    try { history.replaceState(null, '', targetId); } catch (err) {}
                    // Small delay to let the slide become visible, then smooth-scroll into view
                    setTimeout(() => { targetElement.scrollIntoView({ behavior: 'smooth' }); }, 150);
                }
                return;
            }

            if (targetElement) {
                e.preventDefault();
                const top = targetElement.offsetTop - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
    
    // Portfolio filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                item.style.display = (filterValue === 'all' || item.dataset.category === filterValue)
                    ? 'block'
                    : 'none';
            });
        });
    });
    
    // Slide navigation and Section Visibility
    const slides = document.querySelectorAll('.slide');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after first intersection
                // obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    slides.forEach(slide => {
        observer.observe(slide);
    });
    
    function showSlide(slideId) {
        // Scroll the target slide into view instead of toggling display classes.
        const targetSlide = document.querySelector(slideId);
        if (targetSlide) {
            // Use smooth scrolling and align to start; scroll-margin-top handles nav offset.
            targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
            try { history.replaceState(null, '', slideId); } catch (e) { /* ignore */ }
        }

        // Update nav active state
        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === slideId);
        });
    }
    
    // Initialize first slide
    showSlide('#home');
    
    // Handle nav link clicks for slides
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSlide(this.getAttribute('href'));
        });
    });
    
    // Scroll down button
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Use the slide navigation helper so the #about slide becomes active (visible)
            if (typeof showSlide === 'function') {
                showSlide('#about');
                // Update hash without jumping (keeps browser history tidy)
                try { history.replaceState(null, '', '#about'); } catch (err) { /* ignore */ }

                // After the slide becomes active, perform a subtle smooth scroll to the section
                // Delay briefly to allow the DOM/layout to update when the slide becomes visible
                setTimeout(() => {
                    const aboutSection = document.querySelector('#about');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 200);
            } else {
                // Fallback: smooth scroll to element if showSlide isn't available
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Support keyboard activation (Enter / Space) for accessibility
        scrollDownBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Keep nav 'active' in sync while the user scrolls (highlight the section currently in view)
    (function syncNavWithScroll() {
        // Determine the most visible slide using intersection ratios
        const activeObserver = new IntersectionObserver((entries) => {
            let mostVisible = null;
            entries.forEach(entry => {
                if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
                    mostVisible = entry;
                }
            });

            if (mostVisible && mostVisible.isIntersecting) {
                const id = mostVisible.target.id;
                const slideHash = `#${id}`;
                // Update nav link active state
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === slideHash);
                });
                // Optionally update the URL hash without jumping
                try { history.replaceState(null, '', slideHash); } catch (err) { /* ignore */ }
            }
        }, { threshold: [0.25, 0.5, 0.75] });

        slides.forEach(s => activeObserver.observe(s));
    })();

    // Enable keyboard navigation between slides (wheel snapping disabled by default to keep native scrolling)
    (function enableScrollKeyboardNav() {
        // Set to true if you want wheel-to-slide snapping (not recommended for native scrolling)
        const enableWheelSnap = false;
        let isThrottled = false;
        const throttleDelay = 700; // ms

        function getCurrentSlideIndex() {
            const active = Array.from(slides).findIndex(s => s.classList.contains('active'));
            return active >= 0 ? active : 0;
        }

        function showByIndex(index) {
            index = Math.max(0, Math.min(slides.length - 1, index));
            const id = slides[index].id;
            showSlide(`#${id}`);
        }

        // Wheel-to-slide snapping is optional and disabled to preserve default/native scrolling behavior.
        if (enableWheelSnap) {
            window.addEventListener('wheel', (e) => {
                if (isThrottled) return;
                const delta = e.deltaY;
                const cur = getCurrentSlideIndex();
                if (delta > 0 && cur < slides.length - 1) showByIndex(cur + 1);
                else if (delta < 0 && cur > 0) showByIndex(cur - 1);

                isThrottled = true;
                setTimeout(() => isThrottled = false, throttleDelay);
            }, { passive: true });
        }

        // Keep keyboard navigation for accessibility and power users
        window.addEventListener('keydown', (e) => {
            if (['ArrowDown', 'PageDown'].includes(e.key)) {
                e.preventDefault();
                showByIndex(getCurrentSlideIndex() + 1);
            } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
                e.preventDefault();
                showByIndex(getCurrentSlideIndex() - 1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                showByIndex(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                showByIndex(slides.length - 1);
            }
        });
    })();
    
    // Animate progress bars when skills section comes into view
    const skillsSection = document.querySelector('#skills');
    const progressBars = document.querySelectorAll('.progress');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => bar.style.width = targetWidth, 100);
        });
    }
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(skillsSection);
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const data = Object.fromEntries(new FormData(this));
            console.log('Form submitted:', data);
            
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Initialize Particles.js
    if(document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#6a5acd" }, "shape": { "type": "circle" }, "opacity": { "value": 0.4, "random": true }, "size": { "value": 4, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#8892b0", "opacity": 0.3, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }, "modes": { "grab": { "distance": 140, "line_opacity": 1 }, "push": { "particles_nb": 4 } } }, "retina_detect": true
        });
    }

    // Initialize Charts
    const skillsChartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initCharts();
                skillsChartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSectionForCharts = document.querySelector('#skills');
    if (skillsSectionForCharts) {
        skillsChartObserver.observe(skillsSectionForCharts);
    }

    function initCharts() {
        const primaryColor = '#6a5acd';
        const secondaryColor = '#5d4eec';
        const lightColor = '#e9ecef';

        // Common chart options
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        // Pie Chart 1 - Python/Power BI/Statistics (75%)
        const pythonCtx = document.getElementById('pythonPieChart');
        if (pythonCtx) {
            new Chart(pythonCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Proficient', 'Remaining'],
                    datasets: [{
                        data: [75, 25],
                        backgroundColor: [primaryColor, lightColor],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    cutout: '60%',
                    plugins: {
                        ...commonOptions.plugins,
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Pie Chart 2 - Pandas/NumPy/Matplotlib (85%)
        const pandasCtx = document.getElementById('pandasPieChart');
        if (pandasCtx) {
            new Chart(pandasCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Proficient', 'Remaining'],
                    datasets: [{
                        data: [85, 15],
                        backgroundColor: [secondaryColor, lightColor],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    cutout: '60%',
                    plugins: {
                        ...commonOptions.plugins,
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Pie Chart 3 - MySQL/DBMS/Scikit-learn/Tensorflow (91%)
        const mysqlCtx = document.getElementById('mysqlPieChart');
        if (mysqlCtx) {
            new Chart(mysqlCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Proficient', 'Remaining'],
                    datasets: [{
                        data: [91, 9],
                        backgroundColor: ['#8b7dd8', lightColor],
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    cutout: '60%',
                    plugins: {
                        ...commonOptions.plugins,
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Bar Chart - Skills Comparison
        const barCtx = document.getElementById('skillsBarChart');
        if (barCtx) {
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Python/Power BI/Stats', 'Pandas/NumPy/Matplotlib', 'MySQL/DBMS/Scikit-learn/Tensorflow'],
                    datasets: [{
                        label: 'Proficiency (%)',
                        data: [75, 85, 91],
                        backgroundColor: [
                            primaryColor,
                            secondaryColor,
                            '#8b7dd8'
                        ],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return 'Proficiency: ' + context.parsed.y + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Scroll Octocat Animation
    const octocat = document.getElementById('scroll-octocat');
    let lastScrollY = 0;
    let scrollTimeout;
    
    if (octocat) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Show octocat when scrolling down and past 300px
            if (currentScrollY > 300 && currentScrollY > lastScrollY) {
                octocat.classList.add('show');
                octocat.classList.add('wave');
            }
            
            // Hide octocat when scrolling up or at top
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                octocat.classList.remove('show');
                octocat.classList.remove('wave');
            }
            
            lastScrollY = currentScrollY;
            
            // Stop waving after scroll stops
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                octocat.classList.remove('wave');
            }, 500);
        });
    }

    // Coding Skills Progress Bar Animation
    const codingProgressBars = document.querySelectorAll('.coding-progress');
    
    function animateCodingProgress() {
        codingProgressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    }
    
    if (codingProgressBars.length > 0) {
        const codingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCodingProgress();
                    codingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.coding-skills-section').forEach(section => {
            codingObserver.observe(section);
        });
    }

    // 3D Galaxy Star Animation - Colorful Star Field
    const galaxyCanvas = document.getElementById('galaxy-canvas');
    if (galaxyCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: galaxyCanvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Colorful star colors - white, pink, blue, purple
        const starColors = [
            new THREE.Color('#ffffff'), // white
            new THREE.Color('#ff69b4'), // pink
            new THREE.Color('#4169e1'), // blue
            new THREE.Color('#9370db'), // purple
            new THREE.Color('#00bfff'), // deep sky blue
            new THREE.Color('#ff1493'), // deep pink
        ];
        
        const parameters = {
            count: 2000,
            size: 0.03,
            radius: 8
        };
        
        let geometry = null;
        let material = null;
        let points = null;
        
        const generateGalaxy = () => {
            if (points !== null) {
                geometry.dispose();
                material.dispose();
                scene.remove(points);
            }
            
            geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(parameters.count * 3);
            const colors = new Float32Array(parameters.count * 3);
            const sizes = new Float32Array(parameters.count);
            
            for (let i = 0; i < parameters.count; i++) {
                const i3 = i * 3;
                
                // Random position in sphere
                const r = parameters.radius * Math.cbrt(Math.random());
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
                
                // Random color from palette
                const color = starColors[Math.floor(Math.random() * starColors.length)];
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                
                // Random size variation
                sizes[i] = Math.random() * 2 + 0.5;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            material = new THREE.PointsMaterial({
                size: parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            });
            
            points = new THREE.Points(geometry, material);
            scene.add(points);
        };
        
        generateGalaxy();
        
        camera.position.z = 5;
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        const animate = () => {
            requestAnimationFrame(animate);
            
            const elapsedTime = Date.now() * 0.0005;
            
            if (points) {
                // Slow rotation
                points.rotation.y = elapsedTime * 0.1;
                points.rotation.x = elapsedTime * 0.05;
                
                // Mouse interaction
                points.rotation.x += mouseY * 0.01;
                points.rotation.y += mouseX * 0.01;
            }
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});
