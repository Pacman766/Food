window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tabheader__item'), // табы
    tabsContent = document.querySelectorAll('.tabcontent'), // картинки табов
    tabsParent = document.querySelectorAll('.tabheader__items'); // ролдитель табов

  // ф-ция для скрытия табов. Для этого назначаем каждому эл-ту display = none, а также удаляем класс активности с помощью classList.remove().
  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.style.display = 'none';
    });

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }
  // ф-ция для показа первого эл-та табов. Для этого i-му эл-ту назначаем display = block, а также добавляем класс активности classList.add().
  function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

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
});
