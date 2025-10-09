// Импорт функции генерации временных данных (моков)
import { generateMockPhotos } from './data.js';

// Генерация массива из 25 объектов (фотографий)
const photos = generateMockPhotos();

window.mockPhotos = photos;
