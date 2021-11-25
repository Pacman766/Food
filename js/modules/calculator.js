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
