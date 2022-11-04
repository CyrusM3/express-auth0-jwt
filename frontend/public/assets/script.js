const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.nav-bar');

function handleClick() {
  hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
}

handleClick();
