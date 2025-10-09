/*
  Генерация временных данных для "Кекстаграм":
  — 25 фотографий с уникальными id и уникальными url (photos/1.jpg ... photos/25.jpg)
  — описание, лайки 15..200
  — комментарии (0..30 шт): уникальный id, avatar img/avatar-1..6.svg, message (1–2 предложения), name (случайное)
*/

/* Утилиты */
const getRandomIntInclusive = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomArrayElement = (arr) => arr[getRandomIntInclusive(0, arr.length - 1)];

const createIdGenerator = (start = 1) => {
  let current = start - 1;
  return () => {
    current += 1;
    return current;
  };
};

/* Источники данных */
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const NAMES = [
  'Кекс', 'Артём', 'Марина', 'Илья', 'София', 'Даня', 'Алиса', 'Мира', 'Фёдор', 'Ева', 'Роман', 'Ольга',
];

const DESCRIPTIONS = Array.from({ length: 25 }, (_, i) => `Снимок #${i + 1} — тестовые данные`);

/* Генераторы ID */
const genPhotoId = createIdGenerator(1);
const genCommentId = createIdGenerator(1);

/* Сообщение: 1 или 2 случайных предложения (без полного повтора подряд) */
const makeMessage = () => {
  const count = getRandomIntInclusive(1, 2);
  if (count === 1) {
    return getRandomArrayElement(MESSAGES);
  }

  const first = getRandomArrayElement(MESSAGES);
  let second = getRandomArrayElement(MESSAGES);
  let guard = 0;
  while (second === first && guard < 5) {
    second = getRandomArrayElement(MESSAGES);
    guard += 1;
  }
  return `${first} ${second}`;
};

/* Комментарий */
const createComment = () => ({
  id: genCommentId(),
  avatar: `img/avatar-${getRandomIntInclusive(1, 6)}.svg`,
  message: makeMessage(),
  name: getRandomArrayElement(NAMES),
});

/* Фото */
const createPhoto = (i) => ({
  id: genPhotoId(),
  url: `photos/${i}.jpg`,
  description: DESCRIPTIONS[i - 1],
  likes: getRandomIntInclusive(15, 200),
  comments: Array.from({ length: getRandomIntInclusive(0, 30) }, createComment),
});

/* Итог: 25 объектов */
const mockPhotos = Array.from({ length: 25 }, (_, idx) => createPhoto(idx + 1));

/* Глобально (для проверки/далейшей отрисовки) */
window.mockPhotos = mockPhotos;
