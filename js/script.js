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

  // Modal

  const modalBtn = document.querySelectorAll('[data-modal]'), // кнопка открытия модал. окна
    modal = document.querySelector('.modal'), // родитель модального окна
    modalCloseBtn = document.querySelector('[data-close]'); // кнопка закрыть (крестик)

  // ф-ция открытия модального окна
  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    // clearInterval(modalTimerId);
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

  // закрытие при нажатии на крестик
  modalCloseBtn.addEventListener('click', closeModal);

  // обработчик события для закрытия окна при нажатии на пустую область экрана
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // вешаем обработчик событий на закрытие при помощи кнопки Esc
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // const modalTimerId = setTimeout(openModal, 5000);

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

  // Используем классы для карточек

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

  // создаем объект с соответствущими каждому блоку параметрами и вызываем
  // на нем метод render()
  new MenuCard(
    'img/tabs/vegy.jpg',
    'vegy',
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Этоабсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    '.menu .container'
  ).render();

  new MenuCard(
    'img/tabs/elite.jpg',
    'elite',
    'Меню “Премиум”',
    'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    14,
    '.menu .container'
  ).render();

  new MenuCard(
    'img/tabs/post.jpg',
    'post',
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    21,
    '.menu .container'
  ).render();

  // Forms (работа с сервером)

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'Загрузка',
    success: 'Всё хорошо, мы скоро с вами свяжемся',
    failure: 'Что-то пошло не так...',
  };

  // на каждую форму подвязываем ф-цию postData
  forms.forEach((item) => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // откл дэфолтное поведение браузера

      const statusMessage = document.createElement('div');
      statusMessage.classList.add('status');
      statusMessage.textContent = message.loading;
      form.appendChild(statusMessage); // добавляем сообщение загрузки в конец формы

      const request = new XMLHttpRequest(); // создаем запрос
      request.open('POST', 'server.php'); // открываем запрос с сервером

      request.setRequestHeader(
        'Content-type',
        'application/json; charset=utf-8'
      ); // формируем заголовок
      const formData = new FormData(form); // формируем данные которые задал пол-тель

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });
      const json = JSON.stringify(object);

      request.send(json);

      request.addEventListener('load', () => {
        if (request.status === 200) {
          console.log(request.response);
          statusMessage.textContent = message.success;
          form.reset(); // очищаем форму
          setTimeout(() => { // таймаут на удаление сообщения
            statusMessage.remove();
          }, 2000);
        } else {
          statusMessage.textContent = message.failure;
        }
      });
    });
  }


});
