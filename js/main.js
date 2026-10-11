/* =========================================================
   CHICKEN — скрипты лендинга
   1. Бургер-меню
   2. Тень у шапки при скролле
   3. Появление секций при скролле
   4. Подсветка активного пункта меню
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Бургер-меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeMenu() {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  function openMenu() {
    nav.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // клик по пункту меню — закрыть панель
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Esc — закрыть
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // вернулись на десктоп — сбросить состояние
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- 2. Тень у шапки при скролле ---------- */
  var header = document.getElementById('header');

  function onScroll() {
    if (!header) return;
    // переключаемся не сразу, а когда шапка реально сошла с первого экрана
    if (window.scrollY > 48) {
      header.classList.add('is-stuck');
    } else {
      header.classList.remove('is-stuck');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Появление секций при скролле ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    // старый браузер — просто показываем всё
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ---------- 4. Активный пункт меню ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          var isCurrent = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', isCurrent);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------- 5. Слайдер фотографий кафе ---------- */
  var slider = document.getElementById('aboutSlider');

  if (slider) {
    var slides = slider.querySelectorAll('.slider__slide');
    var dots = slider.querySelectorAll('.slider__dot');
    var current = 0;
    var timer = null;
    var DELAY = 5000;

    function showSlide(i) {
      current = (i + slides.length) % slides.length;

      slides.forEach(function (slide, n) {
        var active = n === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dots.forEach(function (dot, n) {
        var active = n === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function stopSlider() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startSlider() {
      stopSlider();
      timer = setInterval(function () {
        showSlide(current + 1);
      }, DELAY);
    }

    // клик по точке — показать нужное фото и отсчитать паузу заново
    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        showSlide(n);
        startSlider();
      });
    });

    // навёл мышь — листание останавливается
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);

    // вкладку свернули — не крутим впустую
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopSlider();
      } else {
        startSlider();
      }
    });

    // если в системе стоит «уменьшить движение» — листаем только по точкам
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startSlider();
    }
  }

  /* ---------- 6. Бронь столика ---------- */
  var bookForm = document.getElementById('bookForm');

  if (bookForm) {
    var dateInput = document.getElementById('bookDate');

    // забронировать можно только на сегодня или позже
    if (dateInput) {
      var now = new Date();
      var today = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
      dateInput.min = today;
      if (!dateInput.value) {
        dateInput.value = today;
      }
    }

    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(bookForm);
      var text = [
        'Бронь столика — CHICKEN',
        'Имя: ' + data.get('name'),
        'Телефон: ' + data.get('phone'),
        'Дата: ' + data.get('date'),
        'Время: ' + data.get('time'),
        'Гостей: ' + data.get('guests')
      ].join('\n');

      window.open(
        'https://t.me/chickenalmalyk_bot?text=' + encodeURIComponent(text),
        '_blank',
        'noopener'
      );
    });
  }

});
