document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Select the name input and the span in the modal
    const nameInput = document.querySelector('input[placeholder="Full Name"]');
    const userNameSpan = document.getElementById('userName');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the page from refreshing

        // 1. Get the value from the input field
        const nameValue = nameInput.value;

        // 2. Put the name into the modal span
        // If the name is empty for some reason, we use "there" as a backup
        userNameSpan.textContent = nameValue ? nameValue : "there";

        // 3. Show the modal
        modal.classList.add('modal-active');

        // 4. Clear the form
        contactForm.reset();
    });

    // Close logic
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('modal-active');
    });
});