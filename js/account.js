// account.js - Login/Register and order history for TechGadgets

document.addEventListener('DOMContentLoaded', function() {
    // Login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        // Simulate login (no backend)
        if (email && password) {
            localStorage.setItem('user', JSON.stringify({ email }));
            alert('Login successful!');
            document.querySelector('.order-history p').textContent = 'No orders yet.';
        } else {
            alert('Please enter both email and password.');
        }
    });
    // Register
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        // Simulate registration (no backend)
        if (name && email && password) {
            localStorage.setItem('user', JSON.stringify({ name, email }));
            alert('Registration successful! You can now log in.');
        } else {
            alert('Please fill out all fields.');
        }
    });
    // Show order history if logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.querySelector('.order-history p').textContent = 'No orders yet.';
    }
});
