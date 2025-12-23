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

const getRandomPhotos = (photos) => {
  const photosCopy = photos.slice();
  const result = [];
  const count = Math.min(RANDOM_PHOTOS_COUNT, photosCopy.length);

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * photosCopy.length);
    result.push(photosCopy.splice(randomIndex, 1)[0]);
  }

  return result;
};

const getDiscussedPhotos = (photos) =>
  photos.slice().sort((a, b) => b.comments.length - a.comments.length);

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

const renderFilteredPhotos = () => {
  renderPictures(getFilteredPhotos());
};

const debouncedRenderFilteredPhotos = debounce(renderFilteredPhotos, RERENDER_DELAY);

const setActiveFilterButton = (filterId) => {
  filtersFormElement.querySelectorAll('.img-filters__button').forEach((button) => {
    button.classList.toggle('img-filters__button--active', button.id === filterId);
  });
};

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

const initFilters = () => {
  imgFiltersElement.classList.remove('img-filters--inactive');
  setActiveFilterButton(FilterId.DEFAULT);
  filtersFormElement.addEventListener('click', onFiltersFormClick);
};

const onPhotoUploadSuccess = (evt) => {
  const newPhoto = evt.detail;
  if (!newPhoto) {
    return;
  }

  originalPhotos = [newPhoto, ...originalPhotos];
  debouncedRenderFilteredPhotos();
};

document.addEventListener('photo-upload-success', onPhotoUploadSuccess);

getData(
  (photos) => {
    originalPhotos = photos.slice();
    renderPictures(originalPhotos);
    initFilters();
  },
  (errorMessage) => {
    showAlert(errorMessage);
  }
);
