// js/util.js

const ALERT_SHOW_TIME = 5000;

// Возвращает случайное целое число из диапазона [min, max] включительно
export const getRandomIntInclusive = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

// Возвращает случайный элемент из переданного массива
export const getRandomArrayElement = (items) =>
  items[getRandomIntInclusive(0, items.length - 1)];

// Генератор последовательных уникальных идентификаторов
export const createIdGenerator = (start = 1) => {
  let current = start - 1;
  return () => {
    current += 1;
    return current;
  };
};

// Проверка нажатия клавиши Esc
export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

// Показ простого алерта об ошибке загрузки данных (ТЗ 4.2)
export const showAlert = (message) => {
  const alertElement = document.createElement('div');
  alertElement.style.position = 'fixed';
  alertElement.style.left = '0';
  alertElement.style.top = '0';
  alertElement.style.right = '0';
  alertElement.style.zIndex = '100';
  alertElement.style.padding = '10px 3px';
  alertElement.style.fontSize = '16px';
  alertElement.style.textAlign = 'center';
  alertElement.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  alertElement.style.color = '#ffffff';

  alertElement.textContent = message;

  document.body.append(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, ALERT_SHOW_TIME);
};
