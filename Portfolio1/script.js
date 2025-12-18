const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new FormData(form);
    const response = await fetch('https:formspree.io/f/yourFormID', {
        method: 'POST', 
        body: data,
        header: {'Accept': 'application/JSON'}
    });

    if(response.ok){
        status.textContent = 'Thanks for your message! I will get back to you soon.';
        form.reset();
    }
    else{
        status.textContent = 'Oops! Something went wrong. Please try again.'
    }
});