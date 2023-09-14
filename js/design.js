//Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('addBg', window.scrollY > 0);
});

//Filter type radio buttons
const filterTypeRadios = document.querySelectorAll('#filter input[type="radio"]');
filterTypeRadios.forEach((radio) => {
    radio.addEventListener('click', () => {
        filterTypeRadios.forEach((otherRadio) => {
            otherRadio.parentElement.classList.remove('click');
        });
        radio.parentElement.classList.add('click');
    });
});
