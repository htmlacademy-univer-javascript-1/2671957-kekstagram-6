const body = document.body;
const modal = document.querySelector('.big-picture');
const modalImg = modal.querySelector('.big-picture__img img');
const likesCount = modal.querySelector('.likes-count');
const commentsCount = modal.querySelector('.comments-count');
const caption = modal.querySelector('.social__caption');
const commentsList = modal.querySelector('.social__comments');
const commentCountBlock = modal.querySelector('.social__comment-count');
const commentsLoader = modal.querySelector('.comments-loader');
const closeBtn = modal.querySelector('#picture-cancel');

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

function onEscKeydown(evt) {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

function closeBigPicture() {
  modal.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeydown);
}

export function openBigPicture(photo) {
  modalImg.src = photo.url;
  modalImg.alt = photo.description;
  likesCount.textContent = String(photo.likes);
  commentsCount.textContent = String(photo.comments.length);
  caption.textContent = photo.description;

  commentsList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  photo.comments.forEach((c) => fragment.append(renderComment(c)));
  commentsList.append(fragment);

  commentCountBlock.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  modal.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeydown);
}

closeBtn.addEventListener('click', closeBigPicture);
