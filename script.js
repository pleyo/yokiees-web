// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Create mailto link with pre-filled content
    const subject = encodeURIComponent('YO\'kiees Pre-Order Request');
    const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'Not provided'}\n` +
        `\n${data.message}`
    );
    
    // Open email client with pre-filled data
    window.location.href = `mailto:yae@yokiees.com?subject=${subject}&body=${body}`;
    
    // Show confirmation message
    alert('Your email client will open with your pre-order details. Please send the email to complete your order request.');
    
    // Reset form and order items
    contactForm.reset();
    orderItems = [];
});

// Quantity selector functionality
document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', function() {
        const display = this.parentElement.querySelector('.qty-display');
        let currentQty = parseInt(display.textContent);
        
        if (this.classList.contains('qty-plus')) {
            currentQty++;
        } else if (this.classList.contains('qty-minus') && currentQty > 1) {
            currentQty--;
        }
        
        display.textContent = currentQty;
        
        // Update minus button state
        const minusBtn = this.parentElement.querySelector('.qty-minus');
        minusBtn.disabled = currentQty <= 1;
    });
});

// Initialize minus buttons
document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.disabled = true; // Start disabled since default is 1
});

// Size selection functionality
document.querySelectorAll('.size-option').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from siblings
        const siblings = this.parentElement.querySelectorAll('.size-option');
        siblings.forEach(sibling => sibling.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Add to Order functionality
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const productName = card.querySelector('.product-name').textContent;
        const quantity = parseInt(card.querySelector('.qty-display').textContent);
        
        // Check if product has size options
        const sizeButtons = card.querySelectorAll('.size-option');
        let size = '';
        let price = '';
        let displayName = productName;
        
        if (sizeButtons.length > 0) {
            const activeSize = card.querySelector('.size-option.active');
            size = activeSize.dataset.size + '"';
            price = '฿' + activeSize.dataset.price;
            displayName = `${productName} (${size})`;
        } else {
            // Get price from product-price element
            const priceElement = card.querySelector('.product-price');
            price = priceElement.textContent;
        }
        
        // Animation feedback
        this.textContent = `Added ${quantity}!`;
        this.style.background = '#4CAF50';
        
        setTimeout(() => {
            this.textContent = 'Add to Order';
            this.style.background = '';
        }, 1500);
        
        // Add to order summary
        addToOrder(displayName, quantity, price);
        
        // Reset quantity to 1
        card.querySelector('.qty-display').textContent = '1';
        card.querySelector('.qty-minus').disabled = true;
        
        // Scroll to contact form
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center' 
        });
    });
});

// Order management
let orderItems = [];

function addToOrder(productName, quantity, price) {
    // Check if item already exists
    const existingItem = orderItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        orderItems.push({
            name: productName,
            quantity: quantity,
            price: price
        });
    }
    
    updateOrderSummary();
}

// Update order summary in contact form
function updateOrderSummary() {
    const messageField = document.getElementById('message');
    
    if (orderItems.length === 0) {
        messageField.value = '';
        return;
    }
    
    let orderSummary = 'Order:\n\n';
    
    orderItems.forEach(item => {
        orderSummary += `${item.quantity}x ${item.name} - ${item.price} each\n`;
    });
    
    orderSummary += '\nDelivery: Chiang Mai area\nThank you!';
    messageField.value = orderSummary;
}

// Intersection Observer for fade-in animations - ONLY ON DESKTOP
if (window.innerWidth > 768) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.about, .menu, .contact, .product-card').forEach(el => {
        observer.observe(el);
    });
} else {
    // On mobile, just make everything visible immediately
    document.querySelectorAll('.about, .menu, .contact, .product-card').forEach(el => {
        el.style.opacity = '1';
    });
}

// Add loading animation to images
document.querySelectorAll('.product-image img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});