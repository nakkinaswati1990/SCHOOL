/**
 * Aether Academy - Core Client JavaScript
 * Interactive widgets, dark mode toggle, fee calculations, and slide animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Theme Management (Dark / Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;

    // Retrieve saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dynamic micro-animation effect for theme button
        themeToggleBtn.style.transform = 'scale(0.8) rotate(15deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = 'none';
        }, 150);
    });


    /* ==========================================================================
       2. Mobile Responsive Drawer Menu
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });


    /* ==========================================================================
       3. Academic Tabs Navigation
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Set active class on buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle panels with transition animation
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${targetTab}`) {
                    // Small delay to let the height collapse/transition smoothly
                    setTimeout(() => {
                        panel.classList.add('active');
                    }, 50);
                }
            });
        });
    });


    /* ==========================================================================
       4. Real-time Tuition Fee Calculator
       ========================================================================== */
    const calcGrade = document.getElementById('calcGrade');
    const calcTransport = document.getElementById('calcTransport');
    const calcDining = document.getElementById('calcDining');
    const clubCbs = document.querySelectorAll('.club-cb');

    const breakdownTuition = document.getElementById('breakdownTuition');
    const breakdownTransport = document.getElementById('breakdownTransport');
    const breakdownDining = document.getElementById('breakdownDining');
    const breakdownClubs = document.getElementById('breakdownClubs');
    const totalMonthly = document.getElementById('totalMonthly');
    const totalAnnual = document.getElementById('totalAnnual');

    function calculateFees() {
        // 1. Get Base Tuition price
        const selectedGradeOpt = calcGrade.options[calcGrade.selectedIndex];
        const tuitionPrice = parseFloat(selectedGradeOpt.getAttribute('data-price')) || 0;

        // 2. Get Transport price
        const selectedTransportOpt = calcTransport.options[calcTransport.selectedIndex];
        const transportPrice = parseFloat(selectedTransportOpt.getAttribute('data-price')) || 0;

        // 3. Get Dining price
        const selectedDiningOpt = calcDining.options[calcDining.selectedIndex];
        const diningPrice = parseFloat(selectedDiningOpt.getAttribute('data-price')) || 0;

        // 4. Get Co-Curricular activities price
        let clubsPrice = 0;
        clubCbs.forEach(cb => {
            if (cb.checked) {
                clubsPrice += parseFloat(cb.getAttribute('data-price')) || 0;
            }
        });

        // 5. Total Calculations
        const monthlySum = tuitionPrice + transportPrice + diningPrice + clubsPrice;
        const annualSum = monthlySum * 12; // Annual term is 12 months

        // 6. Update Breakdown values in UI with number formatting
        breakdownTuition.textContent = `₹${tuitionPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        breakdownTransport.textContent = `₹${transportPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        breakdownDining.textContent = `₹${diningPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        breakdownClubs.textContent = `₹${clubsPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        // Update Totals
        totalMonthly.innerHTML = `₹${monthlySum.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <small>/ month</small>`;
        totalAnnual.innerHTML = `₹${annualSum.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <small>/ academic year</small>`;
    }

    // Attach listeners
    if (calcGrade) {
        calcGrade.addEventListener('change', calculateFees);
        calcTransport.addEventListener('change', calculateFees);
        calcDining.addEventListener('change', calculateFees);
        clubCbs.forEach(cb => cb.addEventListener('change', calculateFees));

        // Initial trigger
        calculateFees();
    }


    /* ==========================================================================
       5. Automated & Interactive Testimonial Carousel
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentSlideIdx = 0;
    let slideTimer = null;
    const autoSlideInterval = 5000; // 5 seconds

    if (slides.length > 0) {
        // Create DOT Indicators
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
            if (idx === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoSlideTimer();
            });
            
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            // Remove active classes
            slides[currentSlideIdx].classList.remove('active');
            dots[currentSlideIdx].classList.remove('active');

            // Handle wraps
            currentSlideIdx = (index + slides.length) % slides.length;

            // Set new active classes
            slides[currentSlideIdx].classList.add('active');
            dots[currentSlideIdx].classList.add('active');
        }

        function showNextSlide() {
            goToSlide(currentSlideIdx + 1);
        }

        function showPrevSlide() {
            goToSlide(currentSlideIdx - 1);
        }

        // Add event listeners for arrows
        nextBtn.addEventListener('click', () => {
            showNextSlide();
            resetAutoSlideTimer();
        });

        prevBtn.addEventListener('click', () => {
            showPrevSlide();
            resetAutoSlideTimer();
        });

        // Auto Slider Timer functions
        function startAutoSlide() {
            slideTimer = setInterval(showNextSlide, autoSlideInterval);
        }

        function resetAutoSlideTimer() {
            clearInterval(slideTimer);
            startAutoSlide();
        }

        // Start Auto Slide
        startAutoSlide();

        // Pause timer when mouse is inside the carousel container
        const sliderContainer = document.querySelector('.testimonial-slider');
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideTimer));
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }


    /* ==========================================================================
       6. Inquiry Form simulated server submit
       ========================================================================== */
    const inquiryForm = document.getElementById('inquiryForm');
    const formSuccessOverlay = document.getElementById('formSuccessOverlay');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const successRef = document.getElementById('successRef');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate server network loading transition
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing Inquiry...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Generate a fake school reference number
                const randomRef = `#AETH-${Math.floor(1000 + Math.random() * 9000)}`;
                successRef.textContent = randomRef;
                
                // Show dynamic success display overlay
                formSuccessOverlay.classList.add('active');
                
                // Reset submit button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });

        resetFormBtn.addEventListener('click', () => {
            inquiryForm.reset();
            formSuccessOverlay.classList.remove('active');
        });
    }

    // Quick newsletter submit simulation
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newsletterSuccess.style.display = 'block';
            newsletterForm.querySelector('input').value = '';
            setTimeout(() => {
                newsletterSuccess.style.display = 'none';
            }, 3000);
        });
    }


    /* ==========================================================================
       7. Interactive Scroll Ribbon Statistics Counter
       ========================================================================== */
    const ribbonSection = document.querySelector('.stats-ribbon');
    const ribbonNums = document.querySelectorAll('.ribbon-num');
    let countersAnimated = false;

    function animateCounters() {
        ribbonNums.forEach(numElement => {
            const targetVal = parseInt(numElement.getAttribute('data-val')) || 0;
            const duration = 2000; // 2 seconds count duration
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function outQuad for smoother deceleration
                const easeProgress = progress * (2 - progress);
                const currentVal = Math.floor(easeProgress * targetVal);
                
                numElement.textContent = currentVal.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    numElement.textContent = targetVal.toLocaleString();
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Set Intersection Observer for Ribbon stats
    if (ribbonSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(ribbonSection);
    } else {
        // Fallback if IntersectionObserver is not supported
        setTimeout(animateCounters, 1000);
    }


    /* ==========================================================================
       8. Navigation Link Scroll Highlighter & Fade-in Animations
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLinks() {
        const scrollPosition = window.scrollY + 100; // navbar offset height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLinks);
    
    // Trigger highlight once initially
    highlightNavLinks();


    /* ==========================================================================
       9. Multi-Step Registration Form Controller
       ========================================================================== */
    const regForm = document.getElementById('registrationForm');
    
    if (regForm) {
        const nextBtns = document.querySelectorAll('.btn-next');
        const prevBtns = document.querySelectorAll('.btn-prev');
        const stepPanels = document.querySelectorAll('.form-step-panel');
        const progressSteps = document.querySelectorAll('.step-progress-item');

        // Prices lists matching the tuition selector
        const prices = {
            grade: { primary: 500, middle: 600, high: 650 },
            transport: { none: 0, standard: 800, door: 1200 },
            dining: { none: 0, standard: 150, premium: 300 }
        };

        function validateCurrentStep(currentStepNum) {
            const currentPanel = document.getElementById(`stepPanel${currentStepNum}`);
            const requiredFields = currentPanel.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.checkValidity()) {
                    field.reportValidity();
                    isValid = false;
                }
            });

            return isValid;
        }

        function updateProgressTimeline(stepNum) {
            progressSteps.forEach((step, idx) => {
                if (idx + 1 < stepNum) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (idx + 1 === stepNum) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
        }

        function showStep(stepNum) {
            stepPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`stepPanel${stepNum}`).classList.add('active');
            updateProgressTimeline(stepNum);

            if (stepNum === 4) {
                // Compile and populate Review Data in Step 4
                document.getElementById('revStudentName').textContent = document.getElementById('regStudentName').value || '-';
                document.getElementById('revDob').textContent = document.getElementById('regStudentDob').value || '-';
                
                const genderSelect = document.getElementById('regStudentGender');
                document.getElementById('revGender').textContent = genderSelect.options[genderSelect.selectedIndex].text || '-';

                const gradeSelect = document.getElementById('regStudentGrade');
                const gradeVal = gradeSelect.value;
                document.getElementById('revGrade').textContent = gradeSelect.options[gradeSelect.selectedIndex].text || '-';

                document.getElementById('revParentName').textContent = document.getElementById('regParentName').value || '-';
                document.getElementById('revParentPhone').textContent = document.getElementById('regParentPhone').value || '-';
                document.getElementById('revParentEmail').textContent = document.getElementById('regParentEmail').value || '-';

                // Price calculations
                const baseTuition = prices.grade[gradeVal] || 0;
                
                const transportSelect = document.getElementById('regTransport');
                const transportVal = transportSelect.value;
                const transportFee = prices.transport[transportVal] || 0;

                const diningSelect = document.getElementById('regDining');
                const diningVal = diningSelect.value;
                const diningFee = prices.dining[diningVal] || 0;

                let clubsFee = 0;
                const selectedClubs = [];
                document.querySelectorAll('.reg-club-cb').forEach(cb => {
                    if (cb.checked) {
                        clubsFee += parseFloat(cb.getAttribute('data-price')) || 0;
                        selectedClubs.push(cb.getAttribute('data-name'));
                    }
                });

                const totalMonthlyVal = baseTuition + transportFee + diningFee + clubsFee;
                const totalAnnualVal = totalMonthlyVal * 3; // Quarterly fee is 3 months

                // Populate pricing labels
                document.getElementById('revTuitionFee').textContent = `₹${baseTuition.toFixed(2)}`;
                document.getElementById('revTransportFee').textContent = `₹${transportFee.toFixed(2)}`;
                document.getElementById('revDiningFee').textContent = `₹${diningFee.toFixed(2)}`;
                document.getElementById('revClubsFee').textContent = `₹${clubsFee.toFixed(2)}`;
                document.getElementById('revTotalMonthly').textContent = `₹${totalMonthlyVal.toFixed(2)}/mo`;
                document.getElementById('revTotalAnnual').textContent = `₹${totalAnnualVal.toFixed(2)}/quarter`;
            }
        }

        // Event listener for next buttons
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.getAttribute('data-next'));
                const currentStep = nextStep - 1;

                if (validateCurrentStep(currentStep)) {
                    showStep(nextStep);
                }
            });
        });

        // Event listener for back buttons
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.getAttribute('data-prev'));
                showStep(prevStep);
            });
        });

        // Handle Registration Submit
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('regSubmitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting Registration Files...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const randomIdNum = Math.floor(1000 + Math.random() * 9000);
                const regId = `#KVSK-REG-2026-${randomIdNum}`;
                
                // Populate admission slip labels
                document.getElementById('regReceiptId').textContent = regId;
                document.getElementById('ticketStudentName').textContent = document.getElementById('regStudentName').value;
                
                const gradeSelect = document.getElementById('regStudentGrade');
                document.getElementById('ticketGrade').textContent = gradeSelect.options[gradeSelect.selectedIndex].text;

                // Show success overlay
                document.getElementById('regSuccessOverlay').classList.add('active');
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        });

        // Mock print ticket functionality
        const printBtn = document.getElementById('printReceiptBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
});
