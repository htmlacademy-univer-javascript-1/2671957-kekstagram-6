const ALERT_SHOW_TIME = 5000;

// Возвращает случайное целое число из диапазона [min, max] включительно
const getRandomIntInclusive = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

// Возвращает случайный элемент из переданного массива
const getRandomArrayElement = (items) =>
  items[getRandomIntInclusive(0, items.length - 1)];

// Генератор последовательных уникальных идентификаторов
const createIdGenerator = (start = 1) => {
  let current = start - 1;
  return () => {
    current += 1;
    return current;
  };
};

// Проверка нажатия клавиши Esc
const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

// Показ простого алерта об ошибке загрузки данных (ТЗ 4.2)
const showAlert = (message) => {
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

// Функция устранения дребезга
const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Функция пропуска кадров
const throttle = (callback, delayBetweenFrames) => {
  let lastTime = 0;

  return (...rest) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
};

export {
  getRandomIntInclusive,
  getRandomArrayElement,
  createIdGenerator,
  isEscapeKey,
  showAlert,
  debounce,
  throttle
};
