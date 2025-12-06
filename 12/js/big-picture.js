const body = document.body;
const modal = document.querySelector('.big-picture');
const modalImg = modal.querySelector('.big-picture__img img');
const likesCount = modal.querySelector('.likes-count');
const commentsCount = modal.querySelector('.comments-count'); // <span class="comments-count">
const caption = modal.querySelector('.social__caption');
const commentsList = modal.querySelector('.social__comments');
const commentCountBlock = modal.querySelector('.social__comment-count'); // "X из <span class='comments-count'>Y</span> комментариев"
const commentsLoader = modal.querySelector('.comments-loader');
const closeBtn = modal.querySelector('#picture-cancel');

const COMMENTS_STEP = 5;

let currentComments = [];
let shownCount = 0;

function isEsc(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}

function renderComment({ avatar, name, message }) {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = avatar;
  img.alt = name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.className = 'social__text';
  p.textContent = message;

  li.append(img, p);
  return li;
}

function updateCounter() {
  const total = currentComments.length;
  const shown = Math.min(shownCount, total);

  commentsCount.textContent = String(total);

  commentCountBlock.innerHTML = `${shown} из <span class="comments-count">${total}</span> комментариев`;
}

function renderNextPortion() {
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

  if (shownCount >= total) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function onEscKeydown(evt) {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onCommentsLoaderClick() {
  renderNextPortion();
}

function closeBigPicture() {
  modal.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onEscKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  currentComments = [];
  shownCount = 0;
}

export function openBigPicture(photo) {
  const { url, description = '', likes = 0, comments = [] } = photo;

  modalImg.src = url;
  modalImg.alt = description;
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
}

closeBtn.addEventListener('click', closeBigPicture);
