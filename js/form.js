import { isEscapeKey } from './util.js';

const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('#upload-file');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('#upload-cancel');
const body = document.body;

const hashtagInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
});

// --- открытие формы ---
const openForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

// --- закрытие формы ---
const closeForm = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  form.reset();
  pristine.reset();
  fileInput.value = '';
};

// --- обработка Esc ---
function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !evt.target.closest('.text__hashtags') && !evt.target.closest('.text__description')) {
    evt.preventDefault();
    closeForm();
  }
}

// --- блокируем Esc внутри полей ---
[hashtagInput, descriptionInput].forEach((input) => {
  input.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });
});

// --- загрузка файла ---
fileInput.addEventListener('change', () => {
  if (!fileInput.files || fileInput.files.length === 0) {
    return;
  }
  openForm();
});

// --- кнопка "Закрыть" ---
cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// --- валидация хэштегов ---
function validateHashtags(value) {
  if (!value) {
    return true;
  }

  const hashtags = value
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

  if (hashtags.length > 5) {
    return false;
  }

  const hashtagPattern = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  const lowerCaseTags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueTags = new Set(lowerCaseTags);

  return hashtags.every((tag) => hashtagPattern.test(tag)) && uniqueTags.size === hashtags.length;
}

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  'Неверный формат тегов. Не более 5, без спецсимволов, не повторяются.'
);

// --- валидация комментария ---
function validateDescription(value) {
  return value.length <= 140;
}

pristine.addValidator(
  descriptionInput,
  validateDescription,
  'Комментарий не должен превышать 140 символов.'
);

// --- отправка формы ---
form.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
});
