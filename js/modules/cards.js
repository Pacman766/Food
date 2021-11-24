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