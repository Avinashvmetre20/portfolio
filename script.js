// JavaScript to handle form submission
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name === '' || email === '' || message === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate sending a message
        alert('Thank you, ' + name + '! Your message has been sent successfully.');
        
        // Clear the form
        form.reset();
    });
});
