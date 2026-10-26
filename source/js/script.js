const mainNav = document.querySelector('.page-header__main-nav');
mainNav.classList.remove('page-header__main-nav--opened');
const mainNavButtonActionText = document.querySelector('.page-header__main-nav-button-action-text');
const mainNavToggle = document.querySelector('.page-header__main-nav-toggle');

mainNavToggle.addEventListener('click', function () {
    mainNav.classList.toggle('page-header__main-nav--opened');

    if (mainNav.classList.contains('page-header__main-nav--opened')) {
        mainNavButtonActionText.textContent = 'Close site menu';
        mainNavToggle.setAttribute('aria-expanded', 'true');
    } else {
        mainNavButtonActionText.textContent = 'Open site menu';
        mainNavToggle.setAttribute('aria-expanded', 'false');
    }
});
