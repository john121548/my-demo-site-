document.addEventListener('DOMContentLoaded', function() {
    console.log("Alex Trading Site - DOM Ready");

    // --- General Helper Functions ---
    const select = (selector, parent = document) => parent.querySelector(selector);
    const selectAll = (selector, parent = document) => parent.querySelectorAll(selector);
    const listen = (event, selector, callback, parent = document) => {
        const element = typeof selector === 'string' ? select(selector, parent) : selector;
        if (element) {
            element.addEventListener(event, callback);
        }
    };

    // --- Update Footer Year ---
    const currentYearSpan = select('#currentYear');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- Header Scroll Effect ---
    const siteHeader = select('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true }); // تحسين الأداء
    }

    // --- Responsive Navigation Menu ---
    const hamburgerMenu = select('#hamburgerMenu');
    const navLinksUl = select('#navLinks');
    const navLinksItems = selectAll('#navLinks .nav-link');

    if (hamburgerMenu && navLinksUl) {
        hamburgerMenu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            navLinksUl.classList.toggle('active');
            document.body.classList.toggle('no-scroll', navLinksUl.classList.contains('active'));
        });

        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksUl.classList.contains('active')) {
                    hamburgerMenu.click();
                }
            });
        });
    }

    // --- Contact Form Validation & Submission ---
    const contactForm = select('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const inputsToValidate = [
                { el: select('#contactName', this), msg: 'الاسم الكامل مطلوب.' },
                { el: select('#contactEmail', this), msg: 'البريد الإلكتروني مطلوب.', emailCheck: true, invalidMsg: 'الرجاء إدخال بريد إلكتروني صالح.' },
                { el: select('#contactMessage', this), msg: 'الرسالة مطلوبة.' }
            ];

            inputsToValidate.forEach(item => {
                if (!item.el) return; // تخطي إذا لم يتم العثور على العنصر
                if (item.el.value.trim() === '') {
                    displayFormError(item.el, item.msg);
                    isValid = false;
                } else if (item.emailCheck && !isValidEmail(item.el.value.trim())) {
                    displayFormError(item.el, item.invalidMsg);
                    isValid = false;
                } else {
                    clearFormError(item.el);
                }
            });

            const formStatusMessage = select('#formMessage');
            if (isValid && formStatusMessage) {
                formStatusMessage.textContent = "جاري إرسال رسالتك...";
                formStatusMessage.className = 'form-status-message processing';
                formStatusMessage.style.display = 'block';

                // Simulate form submission (replace with actual AJAX call if needed)
                setTimeout(() => {
                    formStatusMessage.textContent = "تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً.";
                    formStatusMessage.className = 'form-status-message success';
                    contactForm.reset();
                    clearAllFormErrors(contactForm);
                    setTimeout(() => {
                        formStatusMessage.style.display = 'none';
                        formStatusMessage.className = 'form-status-message';
                    }, 4000);
                }, 1500);
            } else if (!isValid && formStatusMessage) {
                formStatusMessage.textContent = "الرجاء تصحيح الأخطاء الموضحة في النموذج.";
                formStatusMessage.className = 'form-status-message error';
                formStatusMessage.style.display = 'block';
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function displayFormError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.form-error-message');
            if (errorElement) errorElement.textContent = message;
            inputElement.classList.add('input-error');
        }
    }

    function clearFormError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.form-error-message');
            if (errorElement) errorElement.textContent = '';
            inputElement.classList.remove('input-error');
        }
    }

    function clearAllFormErrors(form) {
        selectAll('.form-group', form).forEach(group => {
            const errorElement = select('.form-error-message', group);
            if (errorElement) errorElement.textContent = '';
            const inputElement = select('input, textarea', group);
            if (inputElement) inputElement.classList.remove('input-error');
        });
    }

    // --- Products Modal ---
    const modal = select('#productsModal');
    const openProductModalButtons = selectAll('.spare-btn');
    const closeModalBtn = select('.modal-close-btn');
    const modalProductList = select('#modalProductList');
    const modalTitle = select('#modalTitle');

    function generatePlaceholderProducts(categoryNameArabic, categoryPrefix, count) {
        const products = [];
        for (let i = 1; i <= count; i++) {
            products.push({
                id: `${categoryPrefix}${String(i).padStart(3, '0')}`,
                name: `منتج ${categoryNameArabic} ${i}`,
                categoryOriginal: categoryPrefix,
                categoryDisplayName: categoryNameArabic,
                description: `وصف مختصر لمنتج ${categoryNameArabic} رقم ${i}. جودة عالية وسعر مناسب.`,
                price: `${Math.floor(Math.random() * 200 + 50) * 10} جنيه`,
                image: `https://placehold.co/140x110/003580/FFFFFF?text=${encodeURIComponent(categoryNameArabic)}+${i}`
            });
        }
        return products;
    }

    const productsData = {
        singer: generatePlaceholderProducts('سنجر', 'singer', 50),
        over: generatePlaceholderProducts('أوفر', 'over', 50),
        orleh: generatePlaceholderProducts('أورليه', 'orleh', 50),
        needles: generatePlaceholderProducts('إبر', 'needles', 50)
    };
    if (productsData.singer.length >= 1) {
        productsData.singer[0] = { id: 'singer001', name: 'ماكينة سنجر هيفي ديوتي 4423', categoryOriginal: 'singer', categoryDisplayName: 'سنجر', description: 'ماكينة خياطة قوية ومتينة للأعمال الشاقة، 23 غرزة مدمجة.', price: '3200 جنيه', image: 'images/singer_heavy_duty_4423.jpg' };
    }

    function displayProductsInModal(category) {
        if (!modalProductList || !productsData[category] || productsData[category].length === 0) {
            if (modalProductList) modalProductList.innerHTML = '<p class="loading-text">لا توجد منتجات لعرضها حاليًا.</p>';
            return;
        }
        if (modalTitle) modalTitle.textContent = `منتجات ${productsData[category][0].categoryDisplayName}`;
        
        modalProductList.innerHTML = '';
        productsData[category].forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('card', 'product-item-modal');
            const imageUrl = product.image || `https://placehold.co/140x110/E0E0E0/757575?text=منتج`;
            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" class="product-modal-image" onerror="this.onerror=null; this.src='https://placehold.co/140x110/EAEAEA/BDBDBD?text=خطأ'; this.alt='صورة غير متوفرة';">
                <h3>${product.name}</h3>
                <p class="product-description-modal">${product.description.substring(0, 70)}...</p>
                <p class="price">${product.price}</p>
                <button class="btn add-to-cart-modal" data-product-id="${product.id}" data-product-name="${product.name}"><span>أضف للسلة</span></button>
            `;
            modalProductList.appendChild(productCard);
        });

        selectAll('.add-to-cart-modal', modalProductList).forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.dataset.productName;
                // يمكنك هنا إضافة وظيفة إضافة للسلة الفعلية
                alert(`تمت إضافة "${productName}" إلى السلة (وظيفة تجريبية).`);
            });
        });
    }

    openProductModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.id === 'openSingerModalBtn' ? 'singer' : button.dataset.category;
            if (category) {
                displayProductsInModal(category);
                if (modal) modal.style.display = 'flex';
                document.body.classList.add('no-scroll');
            }
        });
    });

    function closeModalFunction() {
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    }
    if (closeModalBtn) closeModalBtn.onclick = closeModalFunction;
    window.onclick = function(event) { if (modal && event.target == modal) closeModalFunction(); }
    window.addEventListener('keydown', function(event) { if (modal && event.key === 'Escape' && modal.style.display === 'flex') closeModalFunction(); });

    // --- Active Nav Link on Scroll & Scroll to Top Button ---
    const mainNavLinksForScroll = selectAll('.main-nav ul#navLinks a.nav-link');
    const pageSectionsForScroll = selectAll('main > section[id]');
    const scrollToTopBtn = select("#scrollToTopBtn");

    function handleScroll() {
        // Active Nav Link
        let currentSectionId = 'home';
        const scrollThreshold = window.innerHeight * 0.4;
        pageSectionsForScroll.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - scrollThreshold) {
                currentSectionId = section.getAttribute('id');
            }
        });
        mainNavLinksForScroll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').endsWith(`#${currentSectionId}`)) {
                link.classList.add('active');
            }
        });

        // Scroll to Top Button
        if (scrollToTopBtn) {
            if (window.scrollY > 200) {
                scrollToTopBtn.style.opacity = "1";
                scrollToTopBtn.style.visibility = "visible";
                scrollToTopBtn.style.display = "flex"; // تأكد من أنه flex
            } else {
                scrollToTopBtn.style.opacity = "0";
                scrollToTopBtn.style.visibility = "hidden";
                 // لا تغير display هنا مباشرة، دع الانتقال ينتهي
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", () => window.scrollTo({top: 0, behavior: 'smooth'}) );
    }


    // --- Intersection Observer for Section Animations ---
    const sectionsToAnimate = selectAll('main > section');
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 }); // زيادة threshold قليلاً
        sectionsToAnimate.forEach(section => sectionObserver.observe(section));
    } else { // Fallback for older browsers
        sectionsToAnimate.forEach(section => section.classList.add('visible'));
    }
    
    // Initial calls on load
    handleScroll(); // لتحديد الرابط النشط عند التحميل

});
