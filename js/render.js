import { openBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document
  .querySelector('#picture')
  .content
  .querySelector('.picture');

export const renderPictures = (photos) => {
  picturesContainer
    .querySelectorAll('.picture')
    .forEach((element) => element.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach(({ url, description, likes, comments, filter }) => {
    const element = pictureTemplate.cloneNode(true);
    const imgElement = element.querySelector('.picture__img');

    imgElement.src = url;
    imgElement.alt = description;

    // применяем фильтр к миниатюре, если он есть
    imgElement.style.filter = filter || 'none';

    element.querySelector('.picture__likes').textContent = String(likes);
    element.querySelector('.picture__comments').textContent = String(comments.length);

    element.addEventListener('click', (evt) => {
      evt.preventDefault();
      // передаём фильтр дальше в полноэкранный просмотр
      openBigPicture({ url, description, likes, comments, filter });
    });

    fragment.append(element);
  });

  picturesContainer.append(fragment);
};
