// checkout.js - Checkout form handling for TechGadgets

document.addEventListener('DOMContentLoaded', function() {
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
    // Render order summary
    function renderSummary() {
        const summaryDiv = document.getElementById('checkout-summary-details');
        let cart = getCart();
        if (cart.length === 0) {
            summaryDiv.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        let total = 0;
        let html = '<ul>';
        cart.forEach(item => {
            let subtotal = item.price * item.quantity;
            total += subtotal;
            html += `<li>${item.name} x${item.quantity} - $${subtotal.toFixed(2)}</li>`;
        });
        html += `</ul><p>Total: <strong>$${total.toFixed(2)}</strong></p>`;
        summaryDiv.innerHTML = html;
    }
    renderSummary();
    // Form validation and order placement
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputs = this.querySelectorAll('input[required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) valid = false;
        });
        if (!valid) {
            alert('Please fill out all required fields.');
            return;
        }
        alert('Order placed successfully! (Simulation)');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
});
