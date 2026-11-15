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

/* Slider */
const paginationButtons = document.querySelectorAll('.slider__pagination-button');

function deactivatePaginationButtonActive () {
    const paginationButtonActive = document.querySelector('.slider__pagination-button--active');

    paginationButtonActive.classList.remove('slider__pagination-button--active');
    paginationButtonActive.removeAttribute('aria-current');
}

function deactivateCurrentSlide () {
    const currentSlide = document.querySelector('.slides-list__item--current');

    currentSlide.classList.remove('slides-list__item--current');
}

const desktopMediaQuery = window.matchMedia('(min-width: 1920px)');

function sliderScrolling () {
    if (desktopMediaQuery.matches) {
        const currentSlide = document.querySelector('.slides-list__item--current');
        const currentSlideRectangle = currentSlide.getBoundingClientRect();
        const sliderPositionHorizontalCenter = currentSlideRectangle.left + currentSlideRectangle.width / 2;
        const viewportCenter = window.innerWidth / 2;
        const sliderHorizontalDisplacement = viewportCenter - sliderPositionHorizontalCenter;

        const slidesList = document.querySelector('.slides-list');
        const slidesListStyles = window.getComputedStyle(slidesList);
        const sliderCurrentTransform = slidesListStyles.transform;
        const transformMatrix = new DOMMatrix(sliderCurrentTransform);
        const sliderCurrentOffset = transformMatrix.m41;
        const newSliderPosition = sliderCurrentOffset + sliderHorizontalDisplacement;
        slidesList.style.transform = `translateX(${newSliderPosition}px)`;
    } else {
        const slidesList = document.querySelector('.slides-list');
        slidesList.style.transform = '';
    }
}

const slides = document.querySelectorAll('.slides-list__item');
const buttonPrevSlide = document.querySelector('.slider-main-content__button--prev');
const buttonNextSlide = document.querySelector('.slider-main-content__button--next');

function updateSliderButtonsState () {
    buttonPrevSlide.disabled = slides[0].classList.contains('slides-list__item--current');
    buttonNextSlide.disabled = slides[slides.length - 1].classList.contains('slides-list__item--current');
}

updateSliderButtonsState();

for (let paginationButton of paginationButtons) {
    paginationButton.addEventListener('click', function () {
        deactivatePaginationButtonActive();

        paginationButton.classList.add('slider__pagination-button--active');
        paginationButton.setAttribute('aria-current', 'true');

        deactivateCurrentSlide();
        const currentSlideId = paginationButton.getAttribute('aria-controls');
        const currentSlide = document.getElementById(currentSlideId);
        currentSlide.classList.add('slides-list__item--current');

        sliderScrolling();
        updateSliderButtonsState();
    });
}

function getButtonActiveIndex() {
    const paginationButtonActive = document.querySelector('.slider__pagination-button--active');

    return [...paginationButtons].indexOf(paginationButtonActive);
}

function switchPrevSlide (buttonActiveIndex) {
    if (buttonActiveIndex === 0) {
        return;
    }

    deactivateCurrentSlide();
    deactivatePaginationButtonActive();

    const prevPaginationButton = paginationButtons[buttonActiveIndex - 1];
    prevPaginationButton.classList.add('slider__pagination-button--active');
    prevPaginationButton.setAttribute('aria-current', 'true');

    const slideId = prevPaginationButton.getAttribute('aria-controls');
    const slide = document.getElementById(slideId);
    slide.classList.add('slides-list__item--current');

    sliderScrolling();
    updateSliderButtonsState();
}

function switchNextSlide (buttonActiveIndex) {
    if (buttonActiveIndex === paginationButtons.length - 1) {
        return;
    }

    deactivateCurrentSlide();
    deactivatePaginationButtonActive();

    const nextPaginationButton = paginationButtons[buttonActiveIndex + 1];
    nextPaginationButton.classList.add('slider__pagination-button--active');
    nextPaginationButton.setAttribute('aria-current', 'true');

    const slideId = nextPaginationButton.getAttribute('aria-controls');
    const slide = document.getElementById(slideId);
    slide.classList.add('slides-list__item--current');

    sliderScrolling();
    updateSliderButtonsState();
}

buttonPrevSlide.addEventListener('click', function () {
    switchPrevSlide(getButtonActiveIndex());
});

buttonNextSlide.addEventListener('click', function () {
    switchNextSlide(getButtonActiveIndex());
});

slides.forEach(function (slide, index) {
    slide.addEventListener('click', function () {
        const buttonActiveIndex = getButtonActiveIndex();

        if (index < buttonActiveIndex) {
            switchPrevSlide(buttonActiveIndex);
        } else if (index > buttonActiveIndex) {
            switchNextSlide(buttonActiveIndex);
        }
    });
});

const slider = document.querySelector('.slider');

slider.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
    }

    const buttonActiveIndex = getButtonActiveIndex();

    if (event.key === 'ArrowLeft') {
        switchPrevSlide(buttonActiveIndex);
    }

    if (event.key === 'ArrowRight') {
        switchNextSlide(buttonActiveIndex);
    }
});

let startX = null;
let activePointerId = null;

slider.addEventListener('pointerdown', function (event) {
    if (!event.isPrimary || event.button !== 0 || activePointerId !== null) {
        return;
    }

    startX = event.clientX;
    activePointerId = event.pointerId;
});

document.addEventListener('pointerup', function (event) {
    if (startX === null) {
        return;
    }

    if (event.pointerId !== activePointerId) {
        return;
    }

    const endX = event.clientX;
    const deltaX = endX - startX;

    startX = null;
    activePointerId = null;

    if (Math.abs(deltaX) < 50) {
        return;
    }

    const buttonActiveIndex = getButtonActiveIndex();

    if (deltaX >= 50) {
        switchPrevSlide(buttonActiveIndex);
    }

    if (deltaX <= -50) {
        switchNextSlide(buttonActiveIndex);
    }
});

document.addEventListener('pointercancel', function (event) {
    if (event.pointerId !== activePointerId) {
        return;
    }

    startX = null;
    activePointerId = null;
});

desktopMediaQuery.addEventListener('change', sliderScrolling);
