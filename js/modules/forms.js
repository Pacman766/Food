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