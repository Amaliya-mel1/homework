(function () {

    //бургер меню

    document.addEventListener('click', burgerInit)

    function burgerInit(e) {

        const burgerIcon = e.target.closest('.burger-icon');
        const burgerNavLink = e.target.closest('.nav__link');
        const body = document.body;

        if (!burgerIcon && !burgerNavLink) return;
        if (document.documentElement.clientWidth > 1100) return;

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
})()