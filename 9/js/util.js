// Возвращает случайное целое число из диапазона [min, max] включительно
export const getRandomIntInclusive = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

// Возвращает случайный элемент из переданного массива
export const getRandomArrayElement = (arr) =>
  arr[getRandomIntInclusive(0, arr.length - 1)];

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
