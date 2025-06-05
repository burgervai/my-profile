// Product page filtering, sorting, and pagination
const products = [
    {id: 1, name: 'Wireless Earbuds Pro', category: 'audio', brand: 'sony', price: 199.99, originalPrice: 249.99, rating: 4.7, reviews: 1245, image: 'images/earbuds.jpg', inStock: true, isNew: true, isFeatured: true},
    {id: 2, name: 'Smart Watch Series 5', category: 'wearables', brand: 'apple', price: 399.99, originalPrice: 449.99, rating: 4.8, reviews: 892, image: 'images/smartwatch.jpg', inStock: true, isNew: false, isFeatured: true},
    {id: 3, name: 'Wireless Charging Pad', category: 'accessories', brand: 'samsung', price: 29.99, originalPrice: 39.99, rating: 4.2, reviews: 567, image: 'images/charger.jpg', inStock: true, isNew: false, isFeatured: false},
    {id: 4, name: 'Bluetooth Speaker', category: 'audio', brand: 'bose', price: 129.99, originalPrice: 159.99, rating: 4.6, reviews: 723, image: 'images/speaker.jpg', inStock: true, isNew: true, isFeatured: true},
    {id: 5, name: 'Smartphone Stand', category: 'accessories', brand: 'lg', price: 19.99, originalPrice: 24.99, rating: 4.0, reviews: 312, image: 'images/stand.jpg', inStock: true, isNew: false, isFeatured: false},
    {id: 6, name: 'Fitness Tracker', category: 'wearables', brand: 'xiaomi', price: 79.99, originalPrice: 99.99, rating: 4.3, reviews: 498, image: 'images/tracker.jpg', inStock: false, isNew: false, isFeatured: false},
    {id: 7, name: 'Gaming Laptop', category: 'laptops', brand: 'asus', price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviews: 342, image: 'images/laptop.jpg', inStock: true, isNew: true, isFeatured: true},
    {id: 8, name: 'Noise Cancelling Headphones', category: 'audio', brand: 'sony', price: 349.99, originalPrice: 399.99, rating: 4.9, reviews: 1023, image: 'images/headphones.jpg', inStock: true, isNew: false, isFeatured: true},
    {id: 9, name: 'Tablet Pro', category: 'tablets', brand: 'samsung', price: 599.99, originalPrice: 699.99, rating: 4.7, reviews: 765, image: 'images/tablet.jpg', inStock: true, isNew: true, isFeatured: true},
    {id: 10, name: 'Smartphone X', category: 'smartphones', brand: 'apple', price: 999.99, originalPrice: 1099.99, rating: 4.9, reviews: 2345, image: 'images/phone.jpg', inStock: true, isNew: false, isFeatured: true},
    {id: 11, name: 'Wireless Keyboard', category: 'accessories', brand: 'logitech', price: 79.99, originalPrice: 89.99, rating: 4.5, reviews: 432, image: 'images/keyboard.jpg', inStock: true, isNew: false, isFeatured: false},
    {id: 12, name: '4K Monitor', category: 'monitors', brand: 'lg', price: 399.99, originalPrice: 499.99, rating: 4.6, reviews: 287, image: 'images/monitor.jpg', inStock: true, isNew: false, isFeatured: false}
];

const productsGrid = document.getElementById('products-grid');
const showingCountEl = document.getElementById('showing-count');
const totalCountEl = document.getElementById('total-count');
const sortSelect = document.getElementById('sort-by');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');

const productsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', initProductsPage);

function initProductsPage() {
    totalCountEl.textContent = products.length;
    filterAndSortProducts();
    setupEventListeners();
}

function setupEventListeners() {
    if (sortSelect) sortSelect.addEventListener('change', filterAndSortProducts);
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; displayProducts(); updatePagination(); } });
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => { const totalPages = Math.ceil(filteredProducts.length / productsPerPage); if (currentPage < totalPages) { currentPage++; displayProducts(); updatePagination(); } });
    if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', () => { currentPage = 1; filterAndSortProducts(); });
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
}

function filterAndSortProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(cb => parseInt(cb.value));
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || 10000;
    filteredProducts = products.filter(product => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
        if (selectedRatings.length > 0) { const productRating = Math.floor(product.rating); if (!selectedRatings.some(rating => productRating >= rating)) return false; }
        if (product.price < minPrice || product.price > maxPrice) return false;
        return true;
    });
    sortProducts();
    updateProductsCount();
    displayProducts();
    updatePagination();
}

function sortProducts() {
    const sortBy = sortSelect ? sortSelect.value : 'featured';
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'rating': return b.rating - a.rating;
            case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            case 'featured':
            default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
    });
}

function displayProducts() {
    if (!productsGrid) return;
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    productsGrid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.isNew ? '<span class="product-badge">New</span>' : ''}
                ${!product.inStock ? '<span class="product-badge out-of-stock">Out of Stock</span>' : ''}
                <button class="quick-view-btn" data-id="${product.id}"><i class="fas fa-eye"></i></button>
            </div>
            <div class="product-info">
                <span class="product-category">${formatCategory(product.category)}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${getStarRating(product.rating)}<span>(${product.reviews})</span></div>
                <div class="product-price"><span class="current-price">$${product.price.toFixed(2)}</span>${product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}</div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>${product.inStock ? 'Add to Cart' : 'Out of Stock'}</button>
                    <button class="btn-wishlist" data-id="${product.id}"><i class="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
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

function updateProductsCount() {
    if (showingCountEl) {
        const startCount = Math.min((currentPage - 1) * productsPerPage + 1, filteredProducts.length);
        const endCount = Math.min(currentPage * productsPerPage, filteredProducts.length);
        showingCountEl.textContent = filteredProducts.length === 0 ? 0 : endCount;
    }
    if (totalCountEl) {
        totalCountEl.textContent = filteredProducts.length;
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    const pageNumbersContainer = document.querySelector('.page-numbers');
    if (!pageNumbersContainer) return;
    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-number' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => { currentPage = i; displayProducts(); updatePagination(); });
        pageNumbersContainer.appendChild(btn);
    }
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    sortSelect.value = 'featured';
    currentPage = 1;
    filterAndSortProducts();
}

function setupPriceRangeSliders() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minSlider = document.getElementById('price-slider-min');
    const maxSlider = document.getElementById('price-slider-max');
    if (minPriceInput && maxPriceInput && minSlider && maxSlider) {
        minPriceInput.value = minSlider.value;
        maxPriceInput.value = maxSlider.value;
        minSlider.addEventListener('input', (e) => {
            minPriceInput.value = e.target.value;
            if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
                maxPriceInput.value = minPriceInput.value;
                maxSlider.value = minPriceInput.value;
            }
        });
        maxSlider.addEventListener('input', (e) => {
            maxPriceInput.value = e.target.value;
            if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
                minPriceInput.value = maxPriceInput.value;
                minSlider.value = maxPriceInput.value;
            }
        });
        minPriceInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) value = 0;
            if (value > 10000) value = 10000;
            minSlider.value = value;
            if (value > parseInt(maxPriceInput.value)) {
                maxPriceInput.value = value;
                maxSlider.value = value;
            }
        });
        maxPriceInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value) || 10000;
            if (value > 10000) value = 10000;
            if (value < 0) value = 0;
            maxSlider.value = value;
            if (value < parseInt(minPriceInput.value)) {
                minPriceInput.value = value;
                minSlider.value = value;
            }
        });
    }
}
