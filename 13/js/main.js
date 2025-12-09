import { getData } from './api.js';
import { renderPictures } from './render.js';
import './form.js';
import { showAlert, debounce } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;
const RERENDER_DELAY = 500;

const FilterId = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const imgFiltersElement = document.querySelector('.img-filters');
const filtersFormElement = imgFiltersElement.querySelector('.img-filters__form');

let originalPhotos = [];
let currentFilterId = FilterId.DEFAULT;

// функции для разных фильтров

const getRandomPhotos = (photos) => {
  const photosCopy = photos.slice();
  const result = [];
  const count = Math.min(RANDOM_PHOTOS_COUNT, photosCopy.length);

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * photosCopy.length);
    const randomPhoto = photosCopy.splice(randomIndex, 1)[0];
    result.push(randomPhoto);
  }

  return result;
};

const getDiscussedPhotos = (photos) =>
  photos
    .slice()
    .sort((first, second) => second.comments.length - first.comments.length);

const getFilteredPhotos = () => {
  switch (currentFilterId) {
    case FilterId.RANDOM:
      return getRandomPhotos(originalPhotos);
    case FilterId.DISCUSSED:
      return getDiscussedPhotos(originalPhotos);
    case FilterId.DEFAULT:
    default:
      return originalPhotos.slice();
  }
};

// перерисовка с учётом фильтра

const renderFilteredPhotos = () => {
  const photos = getFilteredPhotos();
  renderPictures(photos);
};

const debouncedRenderFilteredPhotos = debounce(renderFilteredPhotos, RERENDER_DELAY);

// управление активной кнопкой

const setActiveFilterButton = (filterId) => {
  const buttons = filtersFormElement.querySelectorAll('.img-filters__button');

  buttons.forEach((button) => {
    if (button.id === filterId) {
      button.classList.add('img-filters__button--active');
    } else {
      button.classList.remove('img-filters__button--active');
    }
  });
};

// обработчик кликов по фильтрам

const onFiltersFormClick = (evt) => {
  const target = evt.target;

  if (!target.classList.contains('img-filters__button')) {
    return;
  }

  const selectedFilterId = target.id;

  if (selectedFilterId === currentFilterId) {
    return;
  }

  currentFilterId = selectedFilterId;
  setActiveFilterButton(currentFilterId);
  debouncedRenderFilteredPhotos();
};

// инициализация фильтров

const initFilters = () => {
  imgFiltersElement.classList.remove('img-filters--inactive');
  setActiveFilterButton(FilterId.DEFAULT);
  filtersFormElement.addEventListener('click', onFiltersFormClick);
};

// добавление нового фото после успешной загрузки

const onPhotoUploadSuccess = (evt) => {
  const newPhoto = evt.detail;

  if (!newPhoto) {
    return;
  }

  // новое фото в начало списка
  originalPhotos = [newPhoto, ...originalPhotos];

  // перерисовываем галерею с учётом текущего фильтра
  debouncedRenderFilteredPhotos();
};

document.addEventListener('photo-upload-success', onPhotoUploadSuccess);

// загрузка данных с сервера и старт приложения

getData(
  (photos) => {
    originalPhotos = photos.slice();

    // первый рендер - по умолчанию
    renderPictures(originalPhotos);

    // включаем фильтры
    initFilters();
  },
  (errorMessage) => {
    showAlert(errorMessage);
  },
);
