window.addEventListener('DOMContentLoaded', () => {
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

  // Slider

  let offsetSlider = 0;
  const parentSlider = document.querySelector('.offer__slider-wrapper');

  document
    .querySelector('.offer__slider-next img')
    .addEventListener('click', () => {
      offsetSlider += 390;
      if (offsetSlider > 1560) {
        offsetSlider = 0;
      }
      parentSlider.style.up = -offsetSlider + 'px';
    });

  document
    .querySelector('.offer__slider-prev img')
    .addEventListener('click', () => {
      offsetSlider -= 390;
      if (offsetSlider < 0) {
        offsetSlider = 1560;
      }
      parentSlider.style.up = -offsetSlider + 'px';
    });

  // document.querySelector('.offer__slider-next img').addEventListener('click', () => {
  //   offsetSlider -= 390;
  //   if(offsetSlider < 0) {
  //     offsetSlider = 1560;
  //   }
  //   parentSlider.style.up = -offsetSlider + 'px';
  // });

  // document.querySelector('.offer__slider-next img').addEventListener('click', () => {
  //   offsetSlider -= 390;
  //   if(offsetSlider < 0) {
  //     offsetSlider = 1560;
  //   }
  //   parentSlider.style.up = -offsetSlider + 'px';
  // });

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
});
