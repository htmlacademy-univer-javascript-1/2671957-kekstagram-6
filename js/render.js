import { openBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

export const renderPictures = (photos) => {
  picturesContainer.querySelectorAll('.picture').forEach((element) => element.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach(({ url, description, likes, comments, filter, scale }) => {
    const element = pictureTemplate.cloneNode(true);
    const imgElement = element.querySelector('.picture__img');

    imgElement.src = url;
    imgElement.alt = description;

    imgElement.style.filter = filter || 'none';

    if (typeof scale === 'number') {
      imgElement.style.transform = `scale(${scale})`;
      imgElement.style.transformOrigin = 'center center';
    } else {
      imgElement.style.transform = '';
    }

    element.querySelector('.picture__likes').textContent = String(likes);
    element.querySelector('.picture__comments').textContent = String(comments.length);

    element.addEventListener('click', (evt) => {
      evt.preventDefault();
      openBigPicture({ url, description, likes, comments, filter, scale });
    });

    fragment.append(element);
  });

  picturesContainer.append(fragment);
};
