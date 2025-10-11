// Импорт функции генерации временных данных (моков)
import { generateMockPhotos } from './data.js';
// Импорт функции для отрисовки миниатюр
import { renderPictures } from './render.js';

// Генерация массива из 25 объектов (фотографий)
const photos = generateMockPhotos();

// Отрисовка миниатюр на странице
renderPictures(photos);

window.mockPhotos = photos;
