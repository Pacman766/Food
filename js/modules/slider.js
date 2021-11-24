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
