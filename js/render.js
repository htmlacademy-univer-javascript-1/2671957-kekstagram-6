const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

export const renderPictures = (photos) => {
  picturesContainer.querySelectorAll('.picture').forEach((el) => el.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach(({ url, description, likes, comments }) => {
    const element = pictureTemplate.cloneNode(true);
    const img = element.querySelector('.picture__img');

    img.src = url;
    img.alt = description;

    element.querySelector('.picture__likes').textContent = String(likes);
    element.querySelector('.picture__comments').textContent = String(comments.length);

    fragment.append(element);
  });

  picturesContainer.append(fragment);
};

