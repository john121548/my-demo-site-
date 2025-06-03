// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

    // --- Helper Functions ---
    // Shortcut for document.querySelector
    const select = (selector, parent = document) => parent.querySelector(selector);
    // Shortcut for document.querySelectorAll
    const selectAll = (selector, parent = document) => parent.querySelectorAll(selector);

    // --- Hamburger Menu Functionality ---
    const hamburgerMenu = select('#hamburgerMenu');
    const navLinks = select('#navLinks');
    const iconOpen = select('.icon-open', hamburgerMenu); // Scope to hamburgerMenu
    const iconClose = select('.icon-close', hamburgerMenu); // Scope to hamburgerMenu

    if (hamburgerMenu && navLinks && iconOpen && iconClose) {
        hamburgerMenu.addEventListener('click', () => {
            const isExpanded = navLinks.classList.toggle('active');
            hamburgerMenu.setAttribute('aria-expanded', isExpanded.toString());
            iconOpen.style.display = isExpanded ? 'none' : 'inline-block';
            iconClose.style.display = isExpanded ? 'inline-block' : 'none';
        });
    }

    // --- Smooth Scroll for Navigation Links ---
    selectAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Ensure targetId is not just "#"
            if (targetId.length > 1) { 
                const targetElement = select(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open and a link is clicked
                    if (navLinks.classList.contains('active')) {
                        hamburgerMenu.click(); 
                    }
                }
            }
        });
    });
    
    // --- Skip Link Focus ---
    // Allows keyboard users to skip to main content
    const skipLink = select('.skip-link');
    const mainContent = select('#main-content');
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            mainContent.setAttribute('tabindex', '-1'); // Make main content focusable
            mainContent.focus();
        });
        // Remove tabindex after focus is lost to avoid it being in tab order
        mainContent.addEventListener('blur', function() {
            mainContent.removeAttribute('tabindex');
        });
    }

    // --- Testimonial Slider ---
    const testimonialSliderEl = select('.testimonial-slider');
    if (testimonialSliderEl) {
        const testimonials = selectAll('.testimonial-item', testimonialSliderEl);
        let currentIndex = 0;

        if (testimonials.length > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '<i class="fas fa-chevron-right"></i>'; // RTL: Right arrow for "previous" visual
            prevButton.classList.add('slider-btn', 'prev-btn');
            prevButton.setAttribute('aria-label', 'الشهادة السابقة'); // Previous testimonial

            const nextButton = document.createElement('button');
            nextButton.innerHTML = '<i class="fas fa-chevron-left"></i>'; // RTL: Left arrow for "next" visual
            nextButton.classList.add('slider-btn', 'next-btn');
            nextButton.setAttribute('aria-label', 'الشهادة التالية'); // Next testimonial
            
            const sliderContainer = select('.testimonial-slider-container');
            if (sliderContainer) {
                 sliderContainer.appendChild(prevButton);
                 sliderContainer.appendChild(nextButton);
            } else { 
                // Fallback if specific container isn't found, though it should be
                testimonialSliderEl.parentNode.insertBefore(prevButton, testimonialSliderEl);
                testimonialSliderEl.parentNode.insertBefore(nextButton, testimonialSliderEl.nextSibling);
            }
            
            function showTestimonial(index) {
                testimonials.forEach((item, i) => {
                    item.style.display = 'none'; 
                    item.classList.remove('active');
                    item.setAttribute('aria-hidden', 'true');
                    if (i === index) {
                        item.style.display = 'block';
                        item.classList.add('active');
                        item.setAttribute('aria-hidden', 'false');
                    }
                });
            }

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
            });

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            });

            showTestimonial(currentIndex); // Initialize first testimonial
        } else if (testimonials.length === 1) {
            // If only one testimonial, just display it
            testimonials[0].style.display = 'block';
            testimonials[0].classList.add('active');
            testimonials[0].setAttribute('aria-hidden', 'false');
        }
    }

    // --- Contact Form Validation ---
    const contactForm = select('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual submission for this example
            let isValid = true;
            const nameInput = select('#contactName', contactForm);
            const emailInput = select('#contactEmail', contactForm);
            const messageInput = select('#contactMessage', contactForm);
            const formMessageDiv = select('#formMessage', contactForm.parentNode); // Get parent to find formMessage

            // Clear previous error messages and status
            selectAll('.form-error-message', contactForm).forEach(el => el.textContent = '');
            if(formMessageDiv){
                formMessageDiv.textContent = '';
                formMessageDiv.className = 'form-status-message'; // Reset classes
            }

            // Validate Name
            if (!nameInput.value.trim()) {
                isValid = false;
                const nameError = select('#nameError', nameInput.parentNode);
                if(nameError) nameError.textContent = 'الاسم مطلوب.';
                if(isValid) nameInput.focus(); 
            }

            // Validate Email
            if (!emailInput.value.trim()) {
                isValid = false;
                const emailError = select('#emailError', emailInput.parentNode);
                if(emailError) emailError.textContent = 'البريد الإلكتروني مطلوب.';
                if(isValid) emailInput.focus();
            } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
                isValid = false;
                const emailError = select('#emailError', emailInput.parentNode);
                if(emailError) emailError.textContent = 'الرجاء إدخال بريد إلكتروني صحيح.';
                 if(isValid) emailInput.focus();
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                isValid = false;
                const messageError = select('#messageError', messageInput.parentNode);
                if(messageError) messageError.textContent = 'الرسالة مطلوبة.';
                if(isValid) messageInput.focus();
            }

            // Display success or error message
            if(formMessageDiv){
                if (isValid) {
                    formMessageDiv.textContent = 'شكراً لك! تم إرسال رسالتك بنجاح.';
                    formMessageDiv.classList.add('success');
                    contactForm.reset(); // Reset form fields
                    nameInput.focus(); // Return focus to the first field
                } else {
                    formMessageDiv.textContent = 'الرجاء تصحيح الأخطاء في النموذج.';
                    formMessageDiv.classList.add('error');
                    // Focus the first invalid field if not already focused by specific validation
                    if (document.activeElement === contactForm || !contactForm.contains(document.activeElement)) {
                        if (!nameInput.value.trim()) nameInput.focus();
                        else if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) emailInput.focus();
                        else if (!messageInput.value.trim()) messageInput.focus();
                    }
                }
            }
        });
    }

    // --- Modal Functionality (for Singer Spare Parts or adaptable) ---
    const openSingerModalBtn = select('#openSingerModalBtn'); // Button to open the modal
    const singerModal = select('#singerModal'); // The modal element
    const closeModalBtns = selectAll('.close-modal'); // All elements that can close a modal

    if (openSingerModalBtn && singerModal) {
        openSingerModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            singerModal.style.display = 'flex'; // Show modal
            singerModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open'); // Prevent body scroll
            // Focus on the close button within the modal for accessibility
            const firstFocusableElement = singerModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        });
    }

    // Add event listener to all close buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalToClose = btn.closest('.modal'); // Find the parent modal
            if (modalToClose) {
                modalToClose.style.display = 'none'; // Hide modal
                modalToClose.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open'); // Re-enable body scroll
                // Return focus to the button that opened the modal, if applicable
                if (openSingerModalBtn && modalToClose.id === 'singerModal') {
                    openSingerModalBtn.focus();
                }
            }
        });
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = select('.modal[style*="display: flex"]'); // Find any active modal
            if (activeModal) {
                activeModal.style.display = 'none';
                activeModal.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');
                if (openSingerModalBtn && activeModal.id === 'singerModal') {
                    openSingerModalBtn.focus();
                }
            }
        }
    });
    
    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (e) => {
        const activeModal = select('.modal[style*="display: flex"]');
        if (activeModal && e.target === activeModal) { // If click is on the modal backdrop itself
            activeModal.style.display = 'none';
            activeModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (openSingerModalBtn && activeModal.id === 'singerModal') {
                 openSingerModalBtn.focus();
            }
        }
    });

    // Initialize Lightbox2 (if not auto-initialized, though it usually is)
    // lightbox.option({ // Example options
    //   'resizeDuration': 200,
    //   'wrapAround': true
    // })
    // Note: Lightbox2 usually initializes itself when its JS is included.
    // Explicit initialization is typically not needed unless customizing options globally.

});
