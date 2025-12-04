// js/main.js

import { renderPictures } from './render.js';
import { getData } from './api.js';
import { showAlert } from './util.js';
import './form.js';

const onDataLoadSuccess = (photos) => {
  renderPictures(photos);
};

const onDataLoadFail = (message) => {
  showAlert(message);
};

getData(onDataLoadSuccess, onDataLoadFail);
