// Homepage interactivity for TechGadgets
const products = [
    {id: 1, name: 'Wireless Earbuds Pro', category: 'Audio', price: 129.99, originalPrice: 159.99, image: 'images/earbuds.jpg', rating: 4.8, reviews: 1245, inStock: true, badge: 'Popular'},
    {id: 2, name: 'Smart Watch Series 5', category: 'Wearables', price: 299.99, originalPrice: 349.99, image: 'images/smartwatch.jpg', rating: 4.7, reviews: 892, inStock: true, badge: 'New'},
    {id: 3, name: 'Wireless Charging Pad', category: 'Accessories', price: 29.99, originalPrice: 39.99, image: 'images/charger.jpg', rating: 4.5, reviews: 567, inStock: true},
    {id: 4, name: 'Bluetooth Speaker', category: 'Audio', price: 79.99, originalPrice: 99.99, image: 'images/speaker.jpg', rating: 4.6, reviews: 723, inStock: true},
    {id: 5, name: 'Smartphone Stand', category: 'Accessories', price: 19.99, originalPrice: 24.99, image: 'images/stand.jpg', rating: 4.3, reviews: 312, inStock: true},
    {id: 6, name: 'Fitness Tracker', category: 'Wearables', price: 89.99, originalPrice: 119.99, image: 'images/tracker.jpg', rating: 4.4, reviews: 498, inStock: false, badge: 'Sold Out'}
];

let cart = [];
const featuredProductsGrid = document.getElementById('featured-products');
const cartCount = document.querySelector('.cart-count');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const newsletterForm = document.getElementById('newsletter-form');

document.addEventListener('DOMContentLoaded', init);

function init() {
    displayProducts(products);
    loadCart();
    updateCartCount();
    setupEventListeners();
}

function displayProducts(productsToDisplay) {
    if (!featuredProductsGrid) return;
    featuredProductsGrid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>${product.inStock ? 'Add to Cart' : 'Out of Stock'}</button>
                    <button class="btn-wishlist"><i class="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function setupEventListeners() {
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-add-to-cart')) {
            const button = e.target.closest('.btn-add-to-cart');
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
        }
    });
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1});
    }
    updateCartCount();
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    if (!cartCount) return;
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);
