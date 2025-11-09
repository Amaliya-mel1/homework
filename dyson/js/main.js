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

    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
    // Навигация фильтра

    const native = document.querySelector('.special-offers__list-option');
    if (!native) return;

    // строим кастомный из нативного
    const wrap = document.createElement('div');
    wrap.className = 'cs';
    wrap.setAttribute('data-cs', 'select');
    native.insertAdjacentElement('afterend', wrap);

    // кнопка
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cs__button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');

    const btnLabel = document.createElement('span');
    btnLabel.className = 'cs__label';
    btnLabel.textContent = native.options[native.selectedIndex]?.text || '';

    const arrow = document.createElement('span');
    arrow.className = 'cs__arrow';

    btn.appendChild(btnLabel);
    btn.appendChild(arrow);
    wrap.appendChild(btn);

    // список
    const list = document.createElement('ul');
    list.className = 'cs__list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('tabindex', '-1');
    wrap.appendChild(list);

    // пункты
    const makeOption = (opt, idx) => {
        const li = document.createElement('li');
        li.className = 'cs__option';
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', opt.value);
        li.textContent = opt.textContent.trim();
        if (opt.disabled) li.setAttribute('aria-disabled', 'true');
        if (opt.selected) {
            li.setAttribute('aria-selected', 'true');
            list.setAttribute('aria-activedescendant', `csopt-${idx}`);
        }
        li.id = `csopt-${idx}`;
        return li;
    };

    [...native.options].forEach((opt, i) => list.appendChild(makeOption(opt, i)));

    // helpers
    const open = () => {
        wrap.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        list.focus({ preventScroll: true });
        // подсветка текущего
        const sel = list.querySelector('[aria-selected="true"]') || list.firstElementChild;
        if (sel) { sel.setAttribute('aria-current', 'true'); sel.scrollIntoView({ block: 'nearest' }); }
    };
    const close = () => {
        wrap.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus({ preventScroll: true });
        [...list.children].forEach(el => el.removeAttribute('aria-current'));
    };
    const toggle = () => (wrap.classList.contains('is-open') ? close() : open());

    const selectValue = (li) => {
        if (!li || li.getAttribute('aria-disabled') === 'true') return;
        // снять флажки
        list.querySelectorAll('[aria-selected="true"]').forEach(el => el.removeAttribute('aria-selected'));
        li.setAttribute('aria-selected', 'true');
        btnLabel.textContent = li.textContent.trim();
        native.value = li.getAttribute('data-value');
        native.dispatchEvent(new Event('change', { bubbles: true }));
        close();
    };

    // события
    btn.addEventListener('click', toggle);

    list.addEventListener('click', (e) => {
        const li = e.target.closest('.cs__option');
        if (li) selectValue(li);
    });

    // Клавиатура (кнопка)
    btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); if (!wrap.classList.contains('is-open')) open(); move(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); if (!wrap.classList.contains('is-open')) open(); move(-1); }
    });

    // Клавиатура (список)
    const items = () => [...list.querySelectorAll('.cs__option')];
    const move = (delta) => {
        const it = items();
        let idx = Math.max(0, it.findIndex(x => x.getAttribute('aria-current') === 'true'));
        idx = (idx + delta + it.length) % it.length;
        it.forEach(el => el.removeAttribute('aria-current'));
        it[idx].setAttribute('aria-current', 'true');
        it[idx].scrollIntoView({ block: 'nearest' });
    };

    list.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        if (e.key === 'Enter') { e.preventDefault(); selectValue(list.querySelector('[aria-current="true"]')); }
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        if (e.key === 'Home') { e.preventDefault(); items().forEach(el => el.removeAttribute('aria-current')); items()[0].setAttribute('aria-current', 'true'); }
        if (e.key === 'End') { e.preventDefault(); const it = items(); it.forEach(el => el.removeAttribute('aria-current')); it[it.length - 1].setAttribute('aria-current', 'true'); }
    });

    // клик вне — закрыть
    document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) close();
    });

    // если значение меняют программно — обновим UI
    native.addEventListener('change', () => {
        const li = list.querySelector(`.cs__option[data-value="${native.value}"]`);
        if (li) {
            list.querySelectorAll('[aria-selected="true"]').forEach(el => el.removeAttribute('aria-selected'));
            li.setAttribute('aria-selected', 'true');
            btnLabel.textContent = li.textContent.trim();
        }
    });

    // первоначальная обёртка: ставим рядом с нативным
    wrap.parentNode.insertBefore(wrap, native.nextSibling);




    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
    // Навигация кнопки (показать еще)


    // document.addEventListener('DOMContentLoaded', function () {
    //     document.querySelectorAll('.special-offers__nav').forEach(function (nav) {
    //         const list = nav.querySelector('.special-offers__list');
    //         if (!list) return;

    //         // гарантируем перенос и корректную раскладку для авто-отступа кнопки
    //         list.style.flexWrap = 'wrap';
    //         list.style.justifyContent = 'flex-start'; // нужно, чтобы margin-left:auto работал

    //         const CHUNK = 4;     // сколько видно по умолчанию
    //         const STEP = 4;     // сколько раскрывать за клик
    //         let shown = CHUNK; // текущее количество видимых
    //         let expandedAll = false;

    //         const items = () => Array.from(list.querySelectorAll('.special-offers__item'));

    //         // --- КНОПКА внутри UL на одной линии -----------------------------------
    //         const moreLi = document.createElement('li');
    //         moreLi.style.marginLeft = 'auto';     // уезжает в правый край текущей строки
    //         moreLi.style.alignSelf = 'center';
    //         moreLi.style.listStyle = 'none';     // чтобы не появлялся маркер
    //         // чтобы между строками кнопка тоже имела зазор, унаследует gap от ul

    //         const moreA = document.createElement('a');
    //         moreA.href = '#';
    //         moreA.textContent = 'Показать ещё';
    //         // лёгкие inline-стили под макет (не трогаем твой CSS)
    //         moreA.style.textDecoration = 'underline';
    //         moreA.style.color = '#c83c91';
    //         moreA.style.cursor = 'pointer';
    //         moreA.style.userSelect = 'none';

    //         moreLi.appendChild(moreA);
    //         list.appendChild(moreLi);             // кнопка — такой же flex-элемент, как и чипы
    //         // ------------------------------------------------------------------------

    //         // если элементов мало — прячем кнопку
    //         if (items().length <= CHUNK) {
    //             moreLi.remove();
    //             return;
    //         }

    //         function applyVisibility() {
    //             const it = items();
    //             it.forEach((li, i) => li.hidden = expandedAll ? false : (i >= shown));
    //             // если всё раскрыто — меняем текст
    //             moreA.textContent = expandedAll ? 'Свернуть' : 'Показать ещё';
    //             moreA.setAttribute('aria-expanded', expandedAll ? 'true' : 'false');
    //         }

    //         // начальная раскладка
    //         applyVisibility();

    //         // клик по кнопке
    //         moreA.addEventListener('click', function (e) {
    //             e.preventDefault();

    //             const count = items().length;

    //             if (!expandedAll) {
    //                 // показать следующий блок
    //                 shown = Math.min(shown + STEP, count);
    //                 if (shown >= count) expandedAll = true;
    //             } else {
    //                 // свернуть обратно к первым CHUNK
    //                 expandedAll = false;
    //                 shown = CHUNK;
    //                 list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    //             }
    //             applyVisibility();
    //         });

    //         // на случай динамического добавления пунктов — поддерживаем состояние
    //         const obs = new MutationObserver(() => {
    //             const count = items().length;
    //             // если все раскрыты — держим показанными и новые тоже
    //             if (expandedAll) shown = count;
    //             // если пунктов стало меньше/больше — обновим кнопку/видимость
    //             if (count <= CHUNK) {
    //                 moreLi.remove();
    //             } else if (!list.contains(moreLi)) {
    //                 list.appendChild(moreLi);
    //             }
    //             applyVisibility();
    //         });
    //         obs.observe(list, { childList: true });
    //     });
    // });















    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.special-offers__nav').forEach(function (nav) {
          const list = nav.querySelector('.special-offers__list');
          if (!list) return;
      
          // корректная раскладка для авто-отступа кнопки
          list.style.flexWrap = 'wrap';
          list.style.justifyContent = 'flex-start';
      
          // динамический CHUNK: до 700px — 3, после — 4
          const getChunk = () => (window.innerWidth <= 700 ? 3 : 4);
      
          let shown = getChunk();     // текущее кол-во видимых
          let expandedAll = false;    // раскрыто всё?
          const items = () => Array.from(list.querySelectorAll('.special-offers__item'));
      
          // --- КНОПКА внутри UL на одной линии -----------------------------------
          const moreLi = document.createElement('li');
          moreLi.style.marginLeft = 'auto';
          moreLi.style.alignSelf = 'center';
          moreLi.style.listStyle = 'none';
      
          const moreA = document.createElement('a');
          moreA.href = '#';
          moreA.textContent = 'Показать ещё';
          moreA.style.textDecoration = 'underline';
          moreA.style.color = '#c83c91';
          moreA.style.cursor = 'pointer';
          moreA.style.userSelect = 'none';
      
          moreLi.appendChild(moreA);
          list.appendChild(moreLi);
          // ------------------------------------------------------------------------
      
          function updateButtonVisibility() {
            const count = items().length;
            const chunk = getChunk();
            // если элементов не больше базового лимита — кнопка не нужна
            if (count <= chunk) {
              if (moreLi.parentNode) moreLi.remove();
            } else {
              if (!moreLi.parentNode) list.appendChild(moreLi);
            }
          }
      
          function applyVisibility() {
            const it = items();
            it.forEach((li, i) => {
              li.hidden = expandedAll ? false : (i >= shown);
            });
            moreA.textContent = expandedAll ? 'Свернуть' : 'Показать ещё';
            moreA.setAttribute('aria-expanded', expandedAll ? 'true' : 'false');
            updateButtonVisibility();
          }
      
          // начальная раскладка
          shown = getChunk();
          applyVisibility();
      
          // клик по кнопке
          moreA.addEventListener('click', function (e) {
            e.preventDefault();
            const count = items().length;
      
            if (!expandedAll) {
              // раскрыть ВСЕ оставшиеся
              expandedAll = true;
              shown = count;
            } else {
              // свернуть к состоянию по умолчанию для текущей ширины
              expandedAll = false;
              shown = getChunk();
              list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            applyVisibility();
          });
      
          // наблюдаем за изменениями списка (динамическое добавление/удаление)
          const obs = new MutationObserver(() => {
            const count = items().length;
            if (expandedAll) shown = count;        // держим всё раскрытым
            updateButtonVisibility();
            applyVisibility();
          });
          obs.observe(list, { childList: true });
      
          // обработка ресайза: если свернуто — пересчитать базовый лимит; если раскрыто — оставляем раскрытым
          let rAF = null;
          window.addEventListener('resize', () => {
            if (rAF) cancelAnimationFrame(rAF);
            rAF = requestAnimationFrame(() => {
              if (!expandedAll) {
                shown = getChunk();
                applyVisibility();
              } else {
                // если всё раскрыто — просто убедимся, что кнопка остаётся доступной для сворачивания
                updateButtonVisibility();
              }
            });
          });
        });
      });









    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
    // Навигация счетчика и кнопки

    // Инициализация всех счетчиков на странице
    document.querySelectorAll('.qty').forEach(initQty);

    function initQty(el) {
        const btnDec = el.querySelector('[data-action="dec"]');
        const btnInc = el.querySelector('[data-action="inc"]');
        const out = el.querySelector('.qty__value');
        const input = el.querySelector('.qty__input');

        const min = parseFloat(el.dataset.min || '1');
        const max = el.dataset.max === "" ? Infinity : parseFloat(el.dataset.max);
        const step = parseFloat(el.dataset.step || '1');

        let value = input ? parseFloat(input.value || min) : min;
        render();

        btnDec.addEventListener('click', () => change(-step));
        btnInc.addEventListener('click', () => change(+step));

        // Удержание мыши/тача для ускоренного изменения (опционально, но приятно)
        holdable(btnDec, () => change(-step));
        holdable(btnInc, () => change(+step));

        // Клавиатура на контейнере: ←/↓ —, →/↑ +, Home=min, End=max
        el.tabIndex = 0;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); change(-step); }
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); change(+step); }
            if (e.key === 'Home') { e.preventDefault(); set(min); }
            if (e.key === 'End') { e.preventDefault(); set(max); }
        });

        function change(delta) { set(value + delta); }
        function set(next) {
            next = clamp(roundToStep(next, step, min), min, max);
            if (next === value) return;
            value = next;
            render();
            el.dispatchEvent(new CustomEvent('change', { detail: { value } }));
        }
        function render() {
            out.textContent = format(value);
            if (input) input.value = value;
            btnDec.disabled = value <= min;
            btnInc.disabled = value >= max;
        }
    }

    // ===== utils =====
    function clamp(x, a, b) { return Math.min(Math.max(x, a), b); }
    function roundToStep(v, step, base) { return Math.round((v - base) / step) * step + base; }
    function format(n) { return Number.isInteger(n) ? n : n.toFixed(2); }

    // Удержание кнопки: первый шаг сразу, затем ускорение
    function holdable(btn, fn) {
        let t1, t2, down = false;
        const start = (e) => {
            if (btn.disabled) return;
            down = true; fn();            // мгновенный клик
            t1 = setTimeout(() => {
                if (!down) return;
                fn();
                t2 = setInterval(fn, 60);   // автоповтор
            }, 400);
            e.preventDefault();
        };
        const stop = () => { down = false; clearTimeout(t1); clearInterval(t2); };
        btn.addEventListener('mousedown', start);
        btn.addEventListener('touchstart', start, { passive: false });
        document.addEventListener('mouseup', stop);
        document.addEventListener('touchend', stop);
        document.addEventListener('touchcancel', stop);
    }





    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */













    // document.addEventListener('DOMContentLoaded', function () {
    //     const wrap = document.querySelector('.special-offers__wrapper');
    //     if (!wrap) return;

    //     const PAGE_SIZE = 6; // 3×2 как на макете
    //     const getCards = () => Array.from(wrap.querySelectorAll('.special-offers__card'));
    //     let page = 1, pages = 1;

    //     // Панель навигации (СНИЗУ, слева)
    //     const nav = document.createElement('div');
    //     nav.setAttribute('aria-label', 'Навигация по карточкам');
    //     Object.assign(nav.style, {
    //         display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    //         gap: '16px', marginTop: '24px', userSelect: 'none', width: '100%'
    //     });

    //     const btnPrev = document.createElement('button');
    //     btnPrev.type = 'button';
    //     btnPrev.innerHTML = '&#8592;';
    //     Object.assign(btnPrev.style, baseBtnStyle());

    //     const label = document.createElement('span');
    //     Object.assign(label.style, { font: '400 16px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color: '#111' });

    //     const btnNext = document.createElement('button');
    //     btnNext.type = 'button';
    //     btnNext.innerHTML = '&#8594;';
    //     Object.assign(btnNext.style, baseBtnStyle());

    //     nav.append(btnPrev, label, btnNext);

    //     // ВСТАВЛЯЕМ НАВИГАЦИЮ ПОСЛЕ ГРИДА (внизу)
    //     wrap.insertAdjacentElement('afterend', nav);

    //     function render() {
    //         const list = getCards();
    //         pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    //         page = Math.min(Math.max(page, 1), pages);

    //         const from = (page - 1) * PAGE_SIZE;
    //         const to = from + PAGE_SIZE;
    //         list.forEach((card, i) => card.hidden = !(i >= from && i < to));

    //         label.textContent = `${page} из ${pages}`;
    //         btnPrev.disabled = page === 1;
    //         btnNext.disabled = page === pages;

    //         btnPrev.style.opacity = btnPrev.disabled ? '.35' : '1';
    //         btnNext.style.opacity = btnNext.disabled ? '.35' : '1';
    //         btnPrev.style.cursor = btnPrev.disabled ? 'default' : 'pointer';
    //         btnNext.style.cursor = btnNext.disabled ? 'default' : 'pointer';
    //     }

    //     btnPrev.addEventListener('click', () => { if (page > 1) { page--; render(); } });
    //     btnNext.addEventListener('click', () => { if (page < pages) { page++; render(); } });

    //     nav.tabIndex = 0;
    //     nav.addEventListener('keydown', (e) => {
    //         if (e.key === 'ArrowLeft') { e.preventDefault(); btnPrev.click(); }
    //         if (e.key === 'ArrowRight') { e.preventDefault(); btnNext.click(); }
    //     });

    //     const obs = new MutationObserver(render);
    //     obs.observe(wrap, { childList: true });

    //     render();

    //     function baseBtnStyle() {
    //         return {
    //             width: '36px', height: '36px', border: '1px solid #111', background: '#fff',
    //             color: '#111', borderRadius: '4px', display: 'grid', placeItems: 'center',
    //             font: '600 18px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    //             cursor: 'pointer', transition: 'transform .05s ease, opacity .2s'
    //         };
    //     }
    // });






    // document.addEventListener('DOMContentLoaded', function () {
    //     const wrap = document.querySelector('.special-offers__wrapper');
    //     if (!wrap) return;

    //     // панель снизу по центру
    //     const pager = document.createElement('div');
    //     pager.className = 'special-offers__pager';

    //     const prev = document.createElement('button');
    //     prev.type = 'button';
    //     prev.className = 'special-offers__pager-btn';
    //     prev.innerHTML = '&#8592;';

    //     const label = document.createElement('span');
    //     label.className = 'special-offers__pager-label';

    //     const next = document.createElement('button');
    //     next.type = 'button';
    //     next.className = 'special-offers__pager-btn';
    //     next.innerHTML = '&#8594;';

    //     pager.append(prev, label, next);
    //     wrap.insertAdjacentElement('afterend', pager);

    //     const cards = () => Array.from(wrap.querySelectorAll('.special-offers__card'));
    //     let page = 1, pages = 1;

    //     // тот же брейкпоинт, что и в CSS (≥600px → 3 колонки)
    //     const mq600 = window.matchMedia('(min-width: 600px)');
    //     const perPage = () => (mq600.matches ? 6 : 4);   // 0–599 → 4; ≥600 → 6

    //     function render(){
    //       const list = cards();
    //       const pp = perPage();
    //       pages = Math.max(1, Math.ceil(list.length / pp));
    //       page = Math.min(Math.max(page, 1), pages);

    //       const start = (page - 1) * pp;
    //       const end   = start + pp;
    //       list.forEach((card, i) => card.hidden = !(i >= start && i < end));

    //       label.textContent = `${page} из ${pages}`;
    //       prev.disabled = page === 1;
    //       next.disabled = page === pages;
    //     }

    //     prev.addEventListener('click', () => { if (page > 1) { page--; render(); } });
    //     next.addEventListener('click', () => { if (page < pages) { page++; render(); } });

    //     // пересчёт при смене ширины/брейкпоинта и при изменении набора карточек
    //     let t;
    //     window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { page = 1; render(); }, 120); });
    //     (mq600.addEventListener ? mq600.addEventListener('change', () => { page = 1; render(); })
    //                             : mq600.addListener(() => { page = 1; render(); })); // старые браузеры
    //     new MutationObserver(() => { page = 1; render(); }).observe(wrap, { childList:true });

    //     render();
    //   });
































    // document.addEventListener('click', function (e) {
    //     const btn = e.target.closest('.special-offers__card-btn');
    //     if (!btn) return;

    //     // Не даём кнопке случайно отправить форму (если она внутри form)
    //     e.preventDefault();

    //     const bottom = btn.closest('.special-offers__card-botom');
    //     const qty = bottom && bottom.querySelector('.qty');
    //     if (!qty) return;

    //     // Показать/скрыть фильтр
    //     const shown = qty.classList.toggle('is-shown');

    //     // Доступность
    //     btn.setAttribute('aria-expanded', shown ? 'true' : 'false');

    //     // При показе — фокус на «+», чтобы сразу можно было клацать клавиатурой
    //     if (shown) {
    //         const plus = qty.querySelector('[data-action="inc"]');
    //         plus && plus.focus();
    //     }
    // });


    // document.addEventListener('DOMContentLoaded', () => {
    //     const wrap = document.querySelector('.special-offers__wrapper');
    //     if (!wrap) return;

    //     // Убираем старые панели, чтобы не было дублей
    //     document.querySelectorAll('.special-offers__pager').forEach(p => p.remove());

    //     // Создаём панель снизу слева (классы уже стилизованы у тебя в CSS)
    //     const pager = document.createElement('div');
    //     pager.className = 'special-offers__pager';

    //     const prev = document.createElement('button');
    //     prev.type = 'button';
    //     prev.className = 'special-offers__pager-btn';
    //     prev.innerHTML = '&#8592;';

    //     const label = document.createElement('span');
    //     label.className = 'special-offers__pager-label';

    //     const next = document.createElement('button');
    //     next.type = 'button';
    //     next.className = 'special-offers__pager-btn';
    //     next.innerHTML = '&#8594;';

    //     pager.append(prev, label, next);
    //     wrap.insertAdjacentElement('afterend', pager);

    //     const getCards = () => Array.from(wrap.querySelectorAll('.special-offers__card'));
    //     const PER_PAGE = 6;               // ← всегда 6 карточек на страницу
    //     let page = 1, pages = 1;

    //     function render() {
    //         const cards = getCards();
    //         pages = Math.max(1, Math.ceil(cards.length / PER_PAGE));
    //         if (page > pages) page = pages;
    //         if (page < 1) page = 1;

    //         const start = (page - 1) * PER_PAGE;
    //         const end = start + PER_PAGE;

    //         // показываем только текущие 6
    //         cards.forEach((card, i) => {
    //             const visible = i >= start && i < end;
    //             card.hidden = !visible;      // работает вместе с CSS [.special-offers__card[hidden]]
    //         });

    //         label.textContent = `${page} из ${pages}`;
    //         prev.disabled = page === 1;
    //         next.disabled = page === pages;
    //     }

    //     prev.addEventListener('click', () => { if (page > 1) { page--; render(); } });
    //     next.addEventListener('click', () => { if (page < pages) { page++; render(); } });

    //     // Клавиатура
    //     pager.tabIndex = 0;
    //     pager.addEventListener('keydown', (e) => {
    //         if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    //         if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    //         if (e.key === 'Home') { e.preventDefault(); page = 1; render(); }
    //         if (e.key === 'End') { e.preventDefault(); page = pages; render(); }
    //     });

    //     // На случай динамического добавления/удаления карточек
    //     new MutationObserver(() => { page = 1; render(); })
    //         .observe(wrap, { childList: true });

    //     render();
    // });











    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
    // Навигация слайдера карточек товаров


    // Показ/скрытие фильтра (делегирование)
    document.addEventListener('click', e => {
        const btn = e.target.closest('.special-offers__card-btn');
        if (!btn) return;
        e.preventDefault();

        const bottom = btn.closest('.special-offers__card-botom');
        const qty = bottom?.querySelector('.qty');
        if (!qty) return;

        const shown = qty.classList.toggle('is-shown');
        bottom.classList.toggle('has-qty', shown);     // для мобилки-стека
        btn.setAttribute('aria-expanded', shown ? 'true' : 'false');
        if (shown) bottom.querySelector('[data-action="inc"]')?.focus();
    });

    // ПАГИНАЦИЯ (твоя же логика; только добавил авто-закрытие фильтра у скрытых карточек)
    document.addEventListener('DOMContentLoaded', () => {
        const wrap = document.querySelector('.special-offers__wrapper');
        if (!wrap) return;

        document.querySelectorAll('.special-offers__pager').forEach(p => p.remove());
        const pager = document.createElement('div');
        pager.className = 'special-offers__pager';
        pager.innerHTML = `
      <button type="button" class="special-offers__pager-btn" data-nav="prev">&#8592;</button>
      <span class="special-offers__pager-label"></span>
      <button type="button" class="special-offers__pager-btn" data-nav="next">&#8594;</button>`;
        wrap.after(pager);

        const label = pager.querySelector('.special-offers__pager-label');
        const cards = () => [...wrap.querySelectorAll('.special-offers__card')];
        const PER_PAGE = 6;
        let page = 1, pages = 1;

        function render() {
            const list = cards();
            pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
            page = Math.min(Math.max(page, 1), pages);
            const from = (page - 1) * PER_PAGE, to = from + PER_PAGE;

            list.forEach((card, i) => {
                const visible = i >= from && i < to;
                card.hidden = !visible;

                // авто-закрыть фильтр у скрытых карточек
                if (!visible) {
                    const bottom = card.querySelector('.special-offers__card-botom');
                    const qty = bottom?.querySelector('.qty');
                    const btn = bottom?.querySelector('.special-offers__card-btn');
                    if (qty?.classList.contains('is-shown')) {
                        qty.classList.remove('is-shown');
                        bottom.classList.remove('has-qty');
                        btn?.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            label.textContent = `${page} из ${pages}`;
            pager.querySelector('[data-nav="prev"]').disabled = page === 1;
            pager.querySelector('[data-nav="next"]').disabled = page === pages;
        }

        pager.addEventListener('click', e => {
            const dir = e.target.closest('[data-nav]')?.dataset.nav;
            if (!dir) return;
            page += dir === 'next' ? 1 : -1;
            render();
        });

        pager.tabIndex = 0;
        pager.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); page--; }
            else if (e.key === 'ArrowRight') { e.preventDefault(); page++; }
            else if (e.key === 'Home') { e.preventDefault(); page = 1; }
            else if (e.key === 'End') { e.preventDefault(); page = pages; }
            else return;
            render();
        });

        new MutationObserver(() => { page = 1; render(); }).observe(wrap, { childList: true });
        render();
    });






    function equalizeRowHeights() {
        const wrap = document.querySelector('.special-offers__wrapper');
        if (!wrap) return;

        // Сбрасываем прежние высоты
        wrap.querySelectorAll('.special-offers__card').forEach(c => c.style.height = '');

        // Берём только видимые (не hidden)
        const visible = [...wrap.querySelectorAll('.special-offers__card:not([hidden])')];
        if (!visible.length) return;

        // Группируем карточки по рядам (по одинаковому .top)
        const rows = [];
        visible.forEach(card => {
            const top = Math.round(card.getBoundingClientRect().top);
            let row = rows.find(r => r.top === top);
            if (!row) rows.push(row = { top, items: [] });
            row.items.push(card);
        });

        // Для каждого ряда выставляем одинаковую высоту = max
        rows.forEach(row => {
            const maxH = Math.max(...row.items.map(c => c.offsetHeight));
            row.items.forEach(c => c.style.height = maxH + 'px');
        });
    }

    /* Хуки: после клика по кнопке (показ/скрытие qty), после пагинации и на ресайзе */
    document.addEventListener('click', (e) => {
        if (e.target.closest('.special-offers__card-btn')) {
            // Небольшая задержка, чтобы браузер пересчитал layout
            requestAnimationFrame(equalizeRowHeights);
        }
    });

    window.addEventListener('resize', () => {
        // дебаунс
        clearTimeout(window.__eqTimer);
        window.__eqTimer = setTimeout(equalizeRowHeights, 100);
    });

    /* Если у тебя есть функция render() пагинации — вызови её в конце */
    const __origRender = window.render;
    if (typeof __origRender === 'function') {
        window.render = function () {
            __origRender.apply(this, arguments);
            requestAnimationFrame(equalizeRowHeights);
        }
    } else {
        // На всякий случай выравниваем при загрузке
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(equalizeRowHeights));
    }




















    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */




    // document. addEventListener ('DOMContentLoaded', () => (
    //     const accordionItems = document. querySelectorAll (' accordion-item'); // Получаем все элементы аккордеона
    //     const offset = 10; // Отступ при прокрутке после раскрытия
    //     // Перебираем все айтемы
    //     accordionItems. forEach ( (item) →> {
    //     const header = item. querySelector (' accordion-header'); // Заголовок айтема
    //     const content = item. querySelector (' accordion-content'); / / Контент айтема
    //     // Проверяем: есть ли у айтема
    //     контент
    //     if (!content) return; // Если нет - ничего не делаем
    //     // === 1. Создаём иконку и добавляем её в header ===
    //     const icon = document.createElement (' span'); // Создаём ‹span>
    //     icon. classList.add ('icon'); // Добавляем класс "icon"
    //     icon. textContent = '+'; // Устанавливаем текст
    //     "+"
    //     header.appendChild (icon); // Вставляем иконку в заголовок
    //     // === 2. Назначаем обработчик клика по заголовку ===
    //     header addEventListener ('click', () => {
    //     const isActive = item.classList.contains ('active'); // Проверяем, активен
    //     ли айтем
    //     // =-= 3. Если уже активен - закрываем ===
    //     if (isActive)
    //     item. classList. remove ('active'); // Убираем класс активности
    //     header. classList. remove ('active'); // То же с заголовком
    //     return; // Выходим (не скроллим)
    //     ;
    //     1) ;
    //     }) ;












    // Аккордион




    // document.addEventListener('DOMContentLoaded', () => {
    //     const accordionItems = document.querySelectorAll('.accordion__item');
    //     const offset = 0;


    //     accordionItems.forEach((item) => {
    //         const header = item.querySelector('accordion__header');
    //         const content = item.querySelector('accordion__content');


    //         if (!content) return;


    //         const icon = document.createElement('span');
    //         icon.classList.add('icon');
    //         icon.textContent = '+';
    //         header.appendChild(icon);

    //         header.addEventListener('click', () => {
    //             const isActive = item.classList.contains('active');
    //             if (isActive) {
    //                 item.classList.remove('active');
    //                 header.classList.remove('active');
    //                 return;
    //             }


    //             accordionItems.forEach((otherItem) => {
    //                 otherItem.classList.remove('active');
    //                 const otherHeader = otheItem.querySelector('.accordion__header');
    //                 if (otherHeader) otherHeader.classList.remove('active');
    //             });

    //             item.classList.add('active');
    //             header.classList.add('active');

    //             setTimeout(() => {
    //                 const rect = item.getBoundingClientRect();
    //                 const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //                 let targetScroll = scrollTop + rect.top - offset;


    //                 const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    //                 if (targetScroll < 0) targetScroll = 0;
    //                 if (targetScroll > maxScroll) targetScroll = maxScroll;

    //                 window.scrollTo({
    //                     top: targetScroll,
    //                     behavior: 'smooth',
    //                 });
    //             });
    //         });
    //     });
    // });


    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
    // Аккордион
    const boxes = document.querySelectorAll(".accordion__box");

    boxes.forEach((box) => {
        const label = box.querySelector(".accordion__label");
        const content = box.querySelector(".accordion__content");

        // Открыть/закрыть текущий блок
        label.addEventListener("click", () => {
            const willOpen = !box.classList.contains("active");
            box.classList.toggle("active", willOpen);
            content.style.maxHeight = willOpen ? content.scrollHeight + "px" : 0;
        });
    });

    // Пересчитать высоты при ресайзе (чтобы открытые панели не обрезались)
    window.addEventListener("resize", () => {
        document
            .querySelectorAll(".accordion__box.active .accordion__content")
            .forEach((content) => {
                content.style.maxHeight = content.scrollHeight + "px";
            });
    });


























    // вычисляем высоту N строк (для 4 строк по умолчанию)
    //   function heightOfLines(el, lines = 4){
    //     const lh = parseFloat(getComputedStyle(el).lineHeight);
    //     return Math.round(lh * lines + 2); // небольшой запас
    //   }

    //   // Инициализация "Читать далее" с плавным открытием/закрытием
    //   function initExpanders(){
    //     document.querySelectorAll('.news__card').forEach(card => {
    //       const text = card.querySelector('[data-text]');
    //       const btn  = card.querySelector('[data-expand]');
    //       if(!text || !btn) return;

    //       const collapsedH = () => heightOfLines(text, 4);

    //       // старт: ограничение 4 строк
    //       text.style.maxHeight = collapsedH() + 'px';

    //       // если текста мало — кнопку прячем
    //       if (text.scrollHeight <= collapsedH() + 1) {
    //         btn.style.display = 'none';
    //       }

    //       btn.addEventListener('click', () => {
    //         const isOpen = text.classList.contains('is-expanded');

    //         if (isOpen) {
    //           // Плавное закрытие: из полной высоты в высоту 4 строк
    //           text.style.maxHeight = text.scrollHeight + 'px';
    //           requestAnimationFrame(() => {
    //             text.classList.remove('is-expanded');
    //             text.style.maxHeight = collapsedH() + 'px';
    //           });
    //           btn.textContent = 'Читать далее';
    //           btn.setAttribute('aria-expanded', 'false');
    //         } else {
    //           // Плавное открытие: из 4 строк в полную высоту
    //           text.style.maxHeight = collapsedH() + 'px';
    //           requestAnimationFrame(() => {
    //             text.classList.add('is-expanded');
    //             text.style.maxHeight = text.scrollHeight + 'px';
    //           });
    //           btn.textContent = 'Скрыть';
    //           btn.setAttribute('aria-expanded', 'true');
    //         }
    //       });

    //       // Пересчёт высот при ресайзе (чтобы отступы не съезжали)
    //       window.addEventListener('resize', () => {
    //         if (text.classList.contains('is-expanded')) {
    //           text.style.maxHeight = text.scrollHeight + 'px';
    //         } else {
    //           text.style.maxHeight = collapsedH() + 'px';
    //         }
    //       });
    //     });
    //   }

    //   // Показ остальных карточек с плавным появлением
    //   function initShowMore(){
    //     const grid = document.getElementById('newsGrid');
    //     const cards = Array.from(grid.querySelectorAll('.news__card'));
    //     const btn = document.getElementById('showMore');

    //     // Скрыть всё после первых трёх
    //     cards.forEach((c, i) => { if (i > 2) c.classList.add('is-hidden'); });
    //     if (cards.length <= 3) { btn.style.display = 'none'; return; }

    //     btn.addEventListener('click', () => {
    //       const hidden = cards.filter(c => c.classList.contains('is-hidden'));

    //       hidden.forEach((card, idx) => {
    //         // возвращаем в поток
    //         card.classList.remove('is-hidden');

    //         // старт анимации
    //         card.style.opacity = '0';
    //         card.style.transform = 'translateY(10px)';

    //         // в следующем кадре — плавно показываем (лёгкий каскад)
    //         requestAnimationFrame(() => {
    //           setTimeout(() => {
    //             card.style.transition = 'opacity .35s ease, transform .35s ease';
    //             card.style.opacity = '1';
    //             card.style.transform = 'translateY(0)';
    //           }, idx * 70);
    //         });
    //       });

    //       btn.style.display = 'none';
    //     });
    //   }

    //   initExpanders();
    //   initShowMore();







    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
    // Навигация кнопок <читать далее> и <показать еще>

    // --- утилиты ---
    function getDefaultVisibleCount() {
        return window.innerWidth <= 550 ? 2 : 3; // <=550px → 2; иначе → 3
    }
    function heightOfLines(el, lines = 4) {
        const lh = parseFloat(getComputedStyle(el).lineHeight);
        return Math.round(lh * lines + 2);
    }

    // --- раскрытие текста в карточке (плавно и в обе стороны) ---
    function initExpanders() {
        document.querySelectorAll('.news__card').forEach(card => {
            const text = card.querySelector('[data-text]');
            const btn = card.querySelector('[data-expand]');
            if (!text || !btn) return;

            const collapsedH = () => heightOfLines(text, 4);

            // старт: ограничение 4 строки
            text.style.maxHeight = collapsedH() + 'px';

            // если текст короткий — скрыть кнопку
            if (text.scrollHeight <= collapsedH() + 1) {
                btn.style.display = 'none';
            }

            btn.addEventListener('click', () => {
                const isOpen = text.classList.contains('is-expanded');

                if (isOpen) {
                    // закрытие
                    text.style.maxHeight = text.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        text.classList.remove('is-expanded');
                        text.style.maxHeight = collapsedH() + 'px';
                    });
                    btn.textContent = 'Читать далее';
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    // открытие
                    text.style.maxHeight = collapsedH() + 'px';
                    requestAnimationFrame(() => {
                        text.classList.add('is-expanded');
                        text.style.maxHeight = text.scrollHeight + 'px';
                    });
                    btn.textContent = 'Скрыть';
                    btn.setAttribute('aria-expanded', 'true');
                }
            });

            // пересчёт при ресайзе
            window.addEventListener('resize', () => {
                if (text.classList.contains('is-expanded')) {
                    text.style.maxHeight = text.scrollHeight + 'px';
                } else {
                    text.style.maxHeight = collapsedH() + 'px';
                }
            });
        });
    }

    // --- показ/скрытие карточек (с учётом ширины) ---
    function initShowMore() {
        const grid = document.getElementById('newsGrid');
        const btn = document.getElementById('showMore');
        let cards = Array.from(grid.querySelectorAll('.news__card'));
        let expanded = false; // состояние «раскрыто всё» / «по умолчанию»

        function applyDefaultState() {
            const visibleCount = getDefaultVisibleCount();
            cards.forEach((card, i) => {
                if (i < visibleCount) {
                    // показываем базовые карточки
                    card.classList.remove('is-hidden');
                    card.style.opacity = '';
                    card.style.transform = '';
                    card.style.transition = '';
                } else {
                    // скрываем остальные
                    card.classList.add('is-hidden');
                    card.style.opacity = '';
                    card.style.transform = '';
                    card.style.transition = '';
                }
            });

            expanded = false;
            // кнопка видна, если есть что скрывать/показывать
            if (cards.length > visibleCount) {
                btn.style.display = '';
                btn.textContent = 'Показать еще';
                btn.setAttribute('aria-expanded', 'false');
            } else {
                btn.style.display = 'none';
            }
        }

        function expandAll() {
            const hidden = cards.filter(c => c.classList.contains('is-hidden'));
            hidden.forEach((card, idx) => {
                card.classList.remove('is-hidden');
                // анимация появления
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        card.style.transition = 'opacity .35s ease, transform .35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, idx * 60); // каскад
                });
            });
            expanded = true;
            btn.textContent = 'Скрыть';
            btn.setAttribute('aria-expanded', 'true');
        }

        function collapseToDefault() {
            const visibleCount = getDefaultVisibleCount();
            // скрываем всё, что сверх дефолтного
            cards.forEach((card, i) => {
                if (i >= visibleCount) {
                    // анимация скрытия
                    card.style.transition = 'opacity .25s ease, transform .25s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    // по окончании — убрать из потока
                    setTimeout(() => {
                        card.classList.add('is-hidden');
                        card.style.opacity = '';
                        card.style.transform = '';
                        card.style.transition = '';
                    }, 250);
                }
            });
            expanded = false;
            btn.textContent = 'Показать еще';
            btn.setAttribute('aria-expanded', 'false');
        }

        // клик по кнопке — переключаем состояние
        btn.addEventListener('click', () => {
            if (expanded) {
                collapseToDefault();
            } else {
                expandAll();
            }
        });

        // первичная инициализация
        applyDefaultState();

        // на ресайз — если мы в «по умолчанию», пересчитать видимые; если раскрыто — оставить всё раскрытым
        window.addEventListener('resize', () => {
            cards = Array.from(grid.querySelectorAll('.news__card'));
            if (!expanded) applyDefaultState();
        });
    }

    // запуск
    initExpanders();
    initShowMore();


    /* =============================================================================================== */
    /* =============================================================================================== */
    /* =============================================================================================== */
// утилита: простая отправка (замени на fetch к своему backend)
async function mockSend(data) {
    // имитация запроса
    await new Promise(r => setTimeout(r, 700));
    return { ok: true };
  }
  
  function handleForm(form, { onSuccessMsgSelector }) {
    const note = form.querySelector(onSuccessMsgSelector);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // HTML5-валидация
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
  
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';
  
      // собираем данные
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        // ЗАМЕНИ ЭТО на свой реальный запрос:
        // const res = await fetch('/api/your-endpoint', { method:'POST', body: formData });
        const res = await mockSend(data);
  
        if (res.ok) {
          // показываем сообщение и очищаем поля
          if (note) {
            note.hidden = false;
            // спрячем уведомление через 3 сек (по желанию)
            setTimeout(() => note.hidden = true, 3000);
          }
          form.reset();
        } else {
          alert('Не удалось отправить. Попробуйте ещё раз.');
        }
      } catch (err) {
        console.error(err);
        alert('Ошибка сети. Попробуйте ещё раз.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
  
  // подключаем обработчики к обеим формам
  handleForm(document.querySelector('.form--contact'), { onSuccessMsgSelector: '.form__note--contact' });
  handleForm(document.querySelector('.form--subscribe'), { onSuccessMsgSelector: '.form__note--subscribe' });
})()