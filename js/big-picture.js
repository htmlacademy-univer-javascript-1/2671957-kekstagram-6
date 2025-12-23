import { isEscapeKey } from './util.js';

const AVATAR_SIZE = 35;
const COMMENTS_STEP = 5;

const body = document.body;
const modal = document.querySelector('.big-picture');
const modalImg = modal.querySelector('.big-picture__img img');
const likesCount = modal.querySelector('.likes-count');
const caption = modal.querySelector('.social__caption');

const commentsList = modal.querySelector('.social__comments');
const commentCountBlock = modal.querySelector('.social__comment-count');
const commentsShownElement = commentCountBlock.querySelector('.comments-count');
const commentsTotalElement = commentCountBlock.querySelector('.comments-total');

const commentsLoader = modal.querySelector('.comments-loader');
const closeBtn = modal.querySelector('#picture-cancel');

let currentComments = [];
let shownCount = 0;

const renderComment = ({ avatar, name, message }) => {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = avatar;
  img.alt = name;
  img.width = AVATAR_SIZE;
  img.height = AVATAR_SIZE;

  const p = document.createElement('p');
  p.className = 'social__text';
  p.textContent = message;

  li.append(img, p);
  return li;
};

const updateCounter = () => {
  commentsShownElement.textContent = String(shownCount);
  commentsTotalElement.textContent = String(currentComments.length);
};

const toggleLoader = () => {
  commentsLoader.classList.toggle('hidden', shownCount >= currentComments.length);
};

const renderNextPortion = () => {
  const total = currentComments.length;
  const start = shownCount;
  const end = Math.min(shownCount + COMMENTS_STEP, total);

  if (start >= end) {
    return;
  }

  const fragment = document.createDocumentFragment();
  for (let i = start; i < end; i++) {
    fragment.append(renderComment(currentComments[i]));
  }

  commentsList.append(fragment);
  shownCount = end;

  updateCounter();
  toggleLoader();
};

const onCommentsLoaderClick = () => {
  renderNextPortion();
};

function onEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

const closeBigPicture = () => {
  modal.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  currentComments = [];
  shownCount = 0;
};

export const openBigPicture = (photo) => {
  const {
    url,
    description = '',
    likes = 0,
    comments = [],
    filter = 'none',
    scale = 1,
  } = photo;

  modalImg.src = url;
  modalImg.alt = description;

  modalImg.style.filter = filter || 'none';
  modalImg.style.transform = `scale(${scale})`;
  modalImg.style.transformOrigin = 'center center';

  likesCount.textContent = String(likes);
  caption.textContent = description;

  currentComments = Array.isArray(comments) ? comments : [];
  shownCount = 0;
  commentsList.innerHTML = '';

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  updateCounter();
  renderNextPortion();

  modal.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeydown);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

closeBtn.addEventListener('click', closeBigPicture);
