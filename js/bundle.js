/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator.js":
/*!**********************************!*\
  !*** ./js/modules/calculator.js ***!
  \**********************************/
/***/ ((module) => {

function calculator() {
  // Calculator

  const result = document.querySelector('.calculating__result span');

  let sex, height, weight, age, ratio;

  // устанавливаем значение по умолчанию в пол
  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
  } else {
    sex = 'female';
    localStorage.setItem('sex', 'female');
  }

  // устанавливаем значение по умолчанию в активность
  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
  } else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375);
  }

  function calcTotal() {
    // если какое либо из данных не введено то  предупреждаем пользователя
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = 'Введите все данные';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round(
        (447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
      );
    } else {
      result.textContent = Math.round(
        (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
      );
    }
  }

  calcTotal();

  function initLocalsettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    // сначала удаляем всем эл-там класс активности, а потом
    // добавляем при условии что этот атрибут есть в
    // localStorage
    elements.forEach((elem) => {
      elem.classList.remove(activeClass);
      if (elem.getAttribute('id') === localStorage.getItem('sex')) {
        elem.classList.add(activeClass);
      }
      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        elem.classList.add(activeClass);
      }
    });
  }

  initLocalsettings('#gender div', 'calculating__choose-item_active');
  initLocalsettings(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  );

  function getStaticInformation(selector, activeClass) {
    // получаем эл-ты внтури блока selector
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        // если пользователь кликнул на какую то из активностей,
        // то мы вытаскиваем эту активность
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
          // поместить выбранную активность в localStorage
          localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
        } else {
          sex = e.target.getAttribute('id');
          // поместить выбранную активность в localStorage
          localStorage.setItem('sex', e.target.getAttribute('id'));
        }

        // со всех эл-тов убираем класс активности и
        // только на кликнутый - возвращаем
        elements.forEach((elem) => {
          elem.classList.remove(activeClass);
        });

        e.target.classList.add(activeClass);

        calcTotal();
      });
    });
  }

  // 2 раза вызываем фунцию сначала для выбора пола а потом для выбора активности
  getStaticInformation('#gender div', 'calculating__choose-item_active');
  getStaticInformation(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  );

  // каждый раз когда мы что то вводим в Input, мы отслеживаем это событие
  // с помощью уникального id и записываем в соответствующую переменную
  function getDynamicInformation(selector) {
    const input = document.querySelector(selector);

    input.addEventListener('input', () => {
      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }

      switch (input.getAttribute('id')) {
        case 'height':
          height = +input.value;
          break;
        case 'weight':
          weight = +input.value;
          break;
        case 'age':
          age = +input.value;
          break;
      }

      calcTotal();
    });
  }

  getDynamicInformation('#height');
  getDynamicInformation('#weight');
  getDynamicInformation('#age');
}

module.exports = calculator;


/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
  // Карточки (работа с сервером)

  class MenuCard {
    constructor(
      src,
      alt,
      title,
      descr,
      price,
      parentSelector,
      ...classes /*rest оператор*/
    ) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes; // св-во для rest оператора
      this.parent = document.querySelector(parentSelector); // родительский класс, куда будет запихиваться HTML
      this.transfer = 27; // курс
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    // ф-ция, где создаем эл-т div, далее внутрь его помещаем html с подставлением вышеобъявленных переменных
    render() {
      const element = document.createElement('div');
      // проверяем, если никакой класс не добавлен, то вписываем дэфолтный класс menu__item,
      // или добавляем тот класс который внесли
      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }
      element.innerHTML = `
        <img src=${this.src} alt=${this.alt} />
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">
          ${this.descr}
        </div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(element); // добавляем в родительский класс структуру html - element.
    }
  }

  // ф-ция получения данных с сервера. Делаем запрос на сервер,
  // дожидаемся окончания, обрабатываем ошибку и трансформируем в json
  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // делаем запрос на сервер, создаем объект с соответствущими каждому блоку параметрами и вызываем
  // на нем метод render()
  getResource('http://localhost:3000/menu').then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuCard(
        img,
        altimg,
        title,
        descr,
        price,
        '.menu .container'
      ).render();
    });
  });
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
  // Forms (работа с сервером)

  const forms = document.querySelectorAll('form');

  // сообщения завершения операции
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Всё хорошо, мы скоро с вами свяжемся',
    failure: 'Что-то пошло не так...',
  };

  // на каждую форму подвязываем ф-цию bindPostData
  forms.forEach((item) => {
    bindPostData(item);
  });

  // ф-ция отправки запроса на сервер, получение ответа с сервера в виде
  // promise и далее возвращает и конвертирует в json
  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST', // каким образом
      headers: {
        'Content-type': 'application/json',
      },
      body: data, // что именно
    });

    return await res.json();
  };

  // отправка данных пол-ля на сервер и ответ с сервера в виде
  // вспылвающего окна
  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // откл дэфолтное поведение браузера

      const statusMessage = document.createElement('img'); // создаем спинер
      statusMessage.src = message.loading; // подставляем путь для спинера
      statusMessage.style.cssText = `
          display : block;
          margin: 0 auto;
        `; // устанавливаем img по центру
      form.insertAdjacentElement('afterend', statusMessage); // добавляем спиннер снизу от формы

      const formData = new FormData(form); // формируем данные которые задал пол-тель

      // 1. в массив массивов, 2. в объект, 3. в JSON
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      // отправляем запрос с данными json на сервер, с помощью промисов
      // обрабатываем данные от пол-ля (выводим данные в консоль, отобращаем
      // showThanksModal, удаляем спиннер), обрабатываем неудачный рез-т,
      // очищаем форму
      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    // находим класс modal__dialog
    const prevModalDialog = document.querySelector('.modal__dialog');

    // скрываем prevModalDialog
    prevModalDialog.classList.add('hide');
    openModal();

    // создаем модальное окно на основе существующего modal__dialog
    // вносим HTML и выводимое сообщение
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
          <div class = "modal__content">
            <div class = "modal__close" data-close>×</div>
            <div class = "modal__title">${message}</div>
          </div>
      `;

    // помещаем создаенное окно после основного класса modal
    // устанавливаем таймаут
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
  // Modal

  const modalBtn = document.querySelectorAll('[data-modal]'), // кнопка открытия модал. окна
    modal = document.querySelector('.modal'); // родитель модального окна

  // ф-ция открытия модального окна
  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  // Вешаем обработчик событий на все кнопки modalBtn
  modalBtn.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  // ф-ция для закрытия модального окна
  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // обработчик события для закрытия окна при нажатии на пустую область экрана
  // или на крестик
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  // вешаем обработчик событий на закрытие при помощи кнопки Esc
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
  // Slider

  const slides = document.querySelectorAll('.offer__slide'), // картинки слайдов
    slider = document.querySelector('.offer__slider'), // осн. род. класс
    next = document.querySelector('.offer__slider-next'), // стрелка вперед
    prev = document.querySelector('.offer__slider-prev'), // стрелка назад
    total = document.querySelector('#total'), // номер общий/всего
    current = document.querySelector('#current'), // номер текущий
    slidesWrapper = document.querySelector('.offer__slider-wrapper'), // общая обертка
    slidesField = document.querySelector('.offer__slider-inner'), // обертка слайдов
    width = window.getComputedStyle(slidesWrapper).width; // ширина окошка  со слайдами (ширина 1 слайда)

  let slideIndex = 1;
  let offset = 0;

  // инициализция начальных цифр в слайдера
  // подставление 0 в total если цирфа <10
  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }

  // задаем длину всех слайдов и другие инлайн стили
  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  slidesWrapper.style.overflow = 'hidden';

  slides.forEach((slide) => {
    slide.style.width = width;
  });

  // возиционируем основной род. эл-т, чтобы точки были всегда поверх
  slider.style.position = 'relative';

  // создаем эл-т разметки ol, пустой массив для точек
  // и создаем класс для indicators
  const indicators = document.createElement('ol'),
    dots = [];
  indicators.classList.add('carousel-indicators');

  // прописываем стили для indicators и добавляем их
  // в конец эл-ьа slider
  indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
  `;
  slider.append(indicators);

  // с помощью цикла пробегаемся по слайдам, создаем и устанавливаем
  // точки в соответствии с каждым слайдом а также соответствующие атрибуты
  // прописываем data-slide-to атрибут с соответствеующим
  // значением, а также инлайн стили
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
      box-sizing: content-box;
      flex: 0 1 auto;
      width: 30px;
      height: 6px;
      margin-right: 3px;
      margin-left: 3px;
      cursor: pointer;
      background-color: #fff;
      background-clip: padding-box;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      opacity: .5;
      transition: opacity .6s ease;
    `;
    // если мы на 1й итерации, то
    // прозрачность ставим на 1 (по умолчанию 0.5)
    if (i == 0) {
      dot.style.opacity = 1;
    }
    // вставляем точки в конец indicators(ol)
    // вставляем точки в массив dots
    indicators.append(dot);
    dots.push(dot);
  }

  function onlyDigits(str) {
    return +str.replace(/\D/g, '');
  }

  // сначала всему массиву устанавливаем прозрачность 0.5
  // потом по очереди каждому dot уст. прозрачность 1
  function dotsOpacity() {
    dots.forEach((dots) => (dots.style.opacity = '0.5'));
    dots[slideIndex - 1].style.opacity = 1;
  }

  next.addEventListener('click', () => {
    // если слайд сдвинулся в конец то перемещаем в начало
    if (offset == onlyDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      // в противном случае просто двигаем слайд вперед
      offset += onlyDigits(width);
    }
    // сдвигаем слайды
    slidesField.style.transform = `translateX(-${offset}px)`;

    // если мы долистали слайды до конца, то переключаемся на 1й
    // в противном случае листаем вперед
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    // подставляем ноль если кол-во слайдов <10
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }

    dotsOpacity();
  });

  prev.addEventListener('click', () => {
    // если слайд на первой позиции и двигаем назад, то нас перекидывает на посл слайд
    if (offset == 0) {
      offset = onlyDigits(width) * (slides.length - 1);
    } else {
      // в противном случае просто двигаем слайд назад
      offset -= onlyDigits(width);
    }
    // сдвигаем слайды
    slidesField.style.transform = `translateX(-${offset}px)`;

    // из 1й позиции переход на 4й слайд при обратном движении слайдов
    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    // подставляем ноль если кол-во слайдов <10
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }

    dotsOpacity();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      // находим элемент по которому был клик
      const slideTo = e.target.getAttribute('data-slide-to');
      // сопоставляем номер слайда и точки
      slideIndex = slideTo;

      // смещение точек
      offset = onlyDigits(width) * (slideTo - 1);
      // смещение слайдера
      slidesField.style.transform = `translateX(-${offset}px)`;

      // подставляем ноль если кол-во слайдов <10
      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }

      dotsOpacity();
    });
  });

  // простой слайдер (без переменных)
  // showSlides(slideIndex);

  // // подставление 0 в total если цирфа <10
  // if (slides.length < 10) {
  //   total.textContent = `0${slides.length}`;
  // } else {
  //   total.textContent = slides.length;
  // }

  // function showSlides(n) {
  //   if (n > slides.length) { // переключение с 04 на 01
  //     slideIndex = 1;
  //   }
  //   if (n < 1) {
  //     slideIndex = slides.length;
  //   }
  //   // скрыть все слайды
  //   slides.forEach((item) => (item.style.display = 'none'));
  //   // отобразить 1й слайд
  //   slides[slideIndex - 1].style.display = 'block';

  //   // подставление 0 в current если цифра <10
  //   if (slides.length < 10) { //
  //     current.textContent = `0${slideIndex}`;
  //   } else {
  //     current.textContent = slideIndex;
  //   }
  // }
  // // изменение индекса
  // function plusSlides(n) {
  //   showSlides(slideIndex += n);
  // }

  // // обработчик событий на клик
  // prev.addEventListener('click', () => {
  //   plusSlides(-1);
  // });
  // next.addEventListener('click', () => {
  //   plusSlides(1);
  // });
}

module.exports = slider;


/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item'), // табы
    tabsContent = document.querySelectorAll('.tabcontent'), // картинки табов
    tabsParent = document.querySelector('.tabheader__items'); // родитель табов

  // ф-ция для скрытия табов. Для этого добавляем класс hide(css) и удаляем классы show, fade (css),
  // а также убираем класс активности tabheader__item_active
  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }

  // ф-ция для показа первого эл-та табов. Для этого i-му эл-ту добавляем классы show, fade (css)
  // и удаляем класс hide (css), а также добавляем класс активности tabheader__item_active
  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  // создаем обработчик событий и с помощью делегирования вешаем обработчик на родительский
  // класс табов и проверяем, если клик произошел на нужный таб, то вызываем ф-ции hideTabContent и showTabContent.
  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
}

module.exports = tabs;


/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
  // Timer

  const deadline = '2021-12-31';

  // Вычисляем оставшееся время с помощью вычитания из конечной даты
  // текущей даты, а также конвертируем миллисекунды в соотв единицы времени.
  // Возвращаем единицы времении в виде объекта
  function getTimeRemaining(endTime) {
    const t = Date.parse(endTime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  // ф-ция для подставления 0 перед числом, если цифра <10
  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }
  // Устанавливаем время с помощью соответствующих селекторов
  // А также устанавливаем интервал в 1000 миллисек.
  function setClock(selector, endTime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock(); // вызываем ф-цию для того, чтобы после обновления страницы выводилось сразу
    // нужное время, а не то которое прописано в вёрстке

    // Создаем переменную t в виде объекта оставшегося времени,
    // помещяем соответствующее св-во объекта в HTML,
    // Проверяем не закончилось ли время, если да, то очищаем интервал clearInterval
    function updateClock() {
      const t = getTimeRemaining(endTime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
  const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
    modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
    timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
    calculator = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator.js"),
    cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
    forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
    slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");

  tabs();
  modal();
  timer();
  calculator();
  cards();
  forms();
  slider();
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map