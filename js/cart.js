// cart.js - Cart page interactivity for TechGadgets

// Load cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const summaryDiv = document.getElementById('cart-summary-details');
    let cart = getCart();
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        summaryDiv.innerHTML = '<p>No items to summarize.</p>';
        document.querySelector('.cart-count').textContent = '0';
        return;
    }
    let total = 0;
    let html = '<table class="cart-table"><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Remove</th></tr></thead><tbody>';
    cart.forEach((item, idx) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        html += `<tr>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" data-idx="${idx}" class="qty-input"></td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-idx="${idx}"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    });
    html += '</tbody></table>';
    cartItemsDiv.innerHTML = html;
    summaryDiv.innerHTML = `<p>Total: <strong>$${total.toFixed(2)}</strong></p>`;
    document.querySelector('.cart-count').textContent = cart.reduce((a, b) => a + b.quantity, 0);
}

document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    document.getElementById('cart-items').addEventListener('input', function(e) {
        if (e.target.classList.contains('qty-input')) {
            let idx = e.target.getAttribute('data-idx');
            let cart = getCart();
            let newQty = parseInt(e.target.value);
            if (newQty > 0) {
                cart[idx].quantity = newQty;
                saveCart(cart);
                renderCart();
            }
        }
    });
    document.getElementById('cart-items').addEventListener('click', function(e) {
        if (e.target.closest('.remove-btn')) {
            let idx = e.target.closest('.remove-btn').getAttribute('data-idx');
            let cart = getCart();
            cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
        }
    });
});
