(function () {

    //бургер меню

    document.addEventListener('click', burgerInit)

    function burgerInit(e) {

        const burgerIcon = e.target.closest('.burger-icon');
        const burgerNavLink = e.target.closest('.nav__link');
        const body = document.body;

        if (!burgerIcon && !burgerNavLink) return;
        if (document.documentElement.clientWidth > 900) return;

        if (burgerNavLink) {
            body.classList.remove('body--opened-menu');
            return;
        }

        if (burgerIcon) {
            if (!body.classList.contains('body--opened-menu')) {
                body.classList.add('body--opened-menu');
            } else {
                body.classList.remove('body--opened-menu');
            }
        }
    }



         //Табы

    const tabControls = document.querySelector('.tab-controls')

    tabControls.addEventListener('click', toggleTab)

    function toggleTab(e) {

        const tabControl = e.target.closest('.tab-controls__link')

        if (!tabControl) return
        e.preventDefault()
        if (tabControl.classList.contains('tab-controls__link--active')) return

        const tabContentID = tabControl.getAttribute('href')
        const tabContent = document.querySelector(tabContentID)
        const activeControl = document.querySelector('.tab-controls__link--active')
        const activeContent = document.querySelector('.tab-content--show')



        if (activeControl) {
            activeControl.classList.remove('tab-controls__link--active')
        }
        if (activeContent) {
            activeContent.classList.remove('tab-content--show')
        }

        tabControl.classList.add('tab-controls__link--active')
        tabContent.classList.add('tab-content--show')
    }

    // clider

    // new Swiper('.estimates__slider', {

    //     spaceBetween: 0,
    //     slidesPerView: 1,
    //     centeredSlides: true,


    //     navigation: {
    //         nextEl: '.estimates__next',
    //         prevEl: '.estimates__prev',
    //     },

    //     scrollbar: {
    //         el: '.swiper-scrollbar',
    //         draggable: true,
    //     },

    //     breakpoints: {
    //         901: {
    //             slidesPerView: 1.5,
    //         },
    //         1201: {
    //             slidesPerView: 2.1,
    //         }
    //     }
    // });
})()