/* Mobile navigation */
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

/* Tabs */
const tabButtons = document.querySelectorAll('.color-tab__menu-button');

const deselectCurrentTabButton = function () {
    const selectedTabButton = document.querySelector('.color-tab__menu-button[aria-selected="true"]');
    selectedTabButton.setAttribute('aria-selected', 'false');
    selectedTabButton.parentElement.classList.remove('color-tab__menu-item--selected');
    selectedTabButton.setAttribute('tabindex', '-1');
}

const hidePreviousPanel = function () {
    const shownPanelItem = document.querySelector('.color-tab__panel-content-list-item:not([hidden]):has([role="tabpanel"])');
    shownPanelItem.hidden = true;
}

for (let tabButton of tabButtons) {
    tabButton.addEventListener('click', function () {
        deselectCurrentTabButton();

        tabButton.setAttribute('aria-selected', 'true');
        tabButton.parentElement.classList.add('color-tab__menu-item--selected');

        hidePreviousPanel();

        const panelId = tabButton.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        panel.parentElement.hidden = false;

        tabButton.setAttribute('tabindex', '0');
    });
}

const tabList = document.querySelector('[role="tablist"]');

tabList.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
    }

    event.preventDefault();

    deselectCurrentTabButton();

    const focusedTabButton = event.target;
    let currentIndex = Array.from(tabButtons).indexOf(focusedTabButton);
    console.log(currentIndex);

    hidePreviousPanel();

    if (event.key === 'ArrowLeft') {
        if (currentIndex === 0) {
            currentIndex = tabButtons.length - 1;
        } else {
            currentIndex--;
        }
    }

    if (event.key === 'ArrowRight') {
        if (currentIndex === tabButtons.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
    }

    tabButtons[currentIndex].focus();
    tabButtons[currentIndex].setAttribute('aria-selected', 'true');
    tabButtons[currentIndex].parentElement.classList.add('color-tab__menu-item--selected');

    const panelId = tabButtons[currentIndex].getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    panel.parentElement.hidden = false;

    tabButtons[currentIndex].setAttribute('tabindex', '0');
});
