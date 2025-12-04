import { getData } from './api.js';
import { renderPictures } from './render.js';
import './form.js';
import { showAlert } from './util.js';

const imgFiltersElement = document.querySelector('.img-filters');

getData(
  (photos) => {
    // Отрисовываем миниатюры
    renderPictures(photos);

    // Показываем блок фильтров только после загрузки данных
    if (imgFiltersElement) {
      imgFiltersElement.classList.remove('img-filters--inactive');
    }
  },
  () => {
    // Сообщение об ошибке загрузки данных
    showAlert('Не удалось загрузить данные. Попробуйте обновить страницу.');
  },
);
