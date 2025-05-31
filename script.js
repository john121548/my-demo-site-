document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة الحقوق تلقائياً في الفوتر
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // معالجة إرسال نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            if (formMessage) {
                formMessage.textContent = "تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً.";
                formMessage.style.color = "#0078d7"; 
            }
            contactForm.reset(); 
            setTimeout(() => {
                if (formMessage) {
                    formMessage.textContent = "";
                }
            }, 5000); 
        });
    }

    // --- النافذة المنبثقة (Modal) للمنتجات ---
    const modal = document.getElementById('productsModal');
    const openSingerModalBtn = document.getElementById('openSingerModalBtn'); 
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const modalProductList = document.getElementById('modalProductList');
    const modalTitle = document.getElementById('modalTitle');

    // Helper function to generate placeholder products
    function generatePlaceholderProducts(categoryNameArabic, categoryPrefix, count) {
        const products = [];
        for (let i = 1; i <= count; i++) {
            products.push({
                id: `${categoryPrefix}${String(i).padStart(3, '0')}`,
                name: `منتج ${categoryNameArabic} رقم ${i}`,
                description: `وصف تفصيلي لمنتج ${categoryNameArabic} رقم ${i}. هذا المنتج يتميز بالجودة العالية والتصميم الفريد ليلبي احتياجاتك.`,
                price: `${Math.floor(Math.random() * 450 + 50) * 10 + 500} جنيه`, // Random price between 500 and 4990, in steps of 10
                image: `images/${categoryPrefix}_placeholder_${String(i).padStart(3, '0')}.jpg` // Placeholder image path
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

    // Manually set the first few products for Singer to match previous example if needed for consistency
    if (productsData.singer.length >= 4) {
        productsData.singer[0] = { id: 'singer001', name: 'ماكينة خياطة سنجر موديل A1', description: 'ماكينة خياطة منزلية متعددة الوظائف، سهلة الاستخدام للمبتدئين والمحترفين.', price: '1550 جنيه', image: 'images/singer_model_a1.jpg' };
        productsData.singer[1] = { id: 'singer002', name: 'طقم إبر سنجر ذهبية', description: 'مجموعة إبر عالية الجودة لمختلف أنواع الأقمشة.', price: '75 جنيه', image: 'images/singer_needles.jpg' };
        productsData.singer[2] = { id: 'singer003', name: 'زيت ماكينة سنجر الأصلي', description: 'زيت مخصص لتشحيم مكائن الخياطة والحفاظ عليها.', price: '40 جنيه', image: 'images/singer_oil.jpg' };
        productsData.singer[3] = { id: 'singer004', name: 'مقص سنجر احترافي', description: 'مقص حاد ومتين لقص الأقمشة بدقة.', price: '120 جنيه', image: 'images/singer_scissors.jpg' };
    }


    function displayProductsInModal(category) {
        if (!modalProductList || !productsData[category] || productsData[category].length === 0) {
            modalProductList.innerHTML = '<p style="text-align:center; width:100%;">لا توجد منتجات لعرضها في هذا القسم حاليًا.</p>';
            return;
        }

        modalProductList.innerHTML = ''; 
        productsData[category].forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('card', 'product-item-modal'); 
            
            const imageUrl = product.image || `https://placehold.co/150x120/E0E0E0/757575?text=${encodeURIComponent(product.name.substring(0,15))}`;

            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" class="product-modal-image" onerror="this.onerror=null; this.src='https://placehold.co/150x120/EAEAEA/BDBDBD?text=صورة+غير+متوفرة'; this.alt='صورة غير متوفرة';">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price}</p>
                <button class="btn add-to-cart-modal" data-product-id="${product.id}" data-product-name="${product.name}">أضف إلى السلة</button>
            `;
            modalProductList.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-modal').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const productName = this.dataset.productName;
                alert(`تمت إضافة "${productName}" إلى السلة (وظيفة تجريبية).`);
            });
        });
    }

    if (openSingerModalBtn) {
        openSingerModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalTitle.textContent = 'منتجات سنجر';
            displayProductsInModal('singer');
            modal.style.display = 'flex'; 
            document.body.style.overflow = 'hidden'; 
        });
    }
    
    document.querySelectorAll('.spare-btn[data-category]').forEach(button => {
        if (button.id === 'openSingerModalBtn' && openSingerModalBtn) return; 

        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            const categoryName = this.textContent; 
            
            modalTitle.textContent = `منتجات ${categoryName}`;
            displayProductsInModal(category);
            modal.style.display = 'flex'; 
            document.body.style.overflow = 'hidden'; 
        });
    });


    function closeModalFunction() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; 
        }
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = closeModalFunction;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModalFunction();
        }
    }
    
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') { 
            closeModalFunction();
        }
    });

    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section[id]');

    function changeNavOnScroll() {
        let currentSectionId = 'home'; 
        const scrollPosition = pageYOffset + (window.innerHeight / 2.5); 

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop ) {
                 currentSectionId = section.getAttribute('id');
            }
        });
        
        if (pageYOffset < window.innerHeight / 3) {
            currentSectionId = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.startsWith('index.html#') && linkHref.split('#')[1] === currentSectionId) {
                link.classList.add('active');
            } else if (linkHref === 'index.html#home' && currentSectionId === 'home') { 
                 link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', changeNavOnScroll);
    window.addEventListener('load', changeNavOnScroll); 
    changeNavOnScroll();

});
