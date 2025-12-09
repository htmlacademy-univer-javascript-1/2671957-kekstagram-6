import {
  getRandomIntInclusive,
  getRandomArrayElement,
  createIdGenerator,
} from './util.js';

// Массивы исходных данных
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

const DESCRIPTIONS = Array.from(
  { length: 25 },
  (_, i) => `Снимок #${i + 1} — тестовые данные`,
);

// Генераторы уникальных id
const genPhotoId = createIdGenerator(1);
const genCommentId = createIdGenerator(1);

// Создание текста комментария
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

// Создание одного комментария
const createComment = () => ({
  id: genCommentId(),
  avatar: `img/avatar-${getRandomIntInclusive(1, 6)}.svg`,
  message: makeMessage(),
  name: getRandomArrayElement(NAMES),
});

// Создание одной фотографии
const createPhoto = (i) => ({
  id: genPhotoId(),
  url: `photos/${i}.jpg`,
  description: DESCRIPTIONS[i - 1],
  likes: getRandomIntInclusive(15, 200),
  comments: Array.from(
    { length: getRandomIntInclusive(0, 30) },
    createComment,
  ),
});

// Генерация массива из 25 фотографий
export const generateMockPhotos = (count = 25) =>
  Array.from({ length: count }, (_, idx) => createPhoto(idx + 1));
