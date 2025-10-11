// Импорт функции генерации временных данных (моков)
import { generateMockPhotos } from './data.js';
// Импорт функции для отрисовки миниатюр
import { renderPictures } from './render.js';
// Импорт функции открытия полноразмерного фото
import { openBigPicture } from './big-picture.js';

// Генерация массива из 25 объектов (фотографий)
const photos = generateMockPhotos();

// Отрисовка миниатюр на странице + добавление обработки клика
renderPictures(photos, openBigPicture);

window.mockPhotos = photos;
