// js/form.js

import { isEscapeKey } from './util.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

// поддерживаемые типы файлов для превью
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

// константы масштаба
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

// перечисление эффектов
const Effect = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

// максимальная длина комментария
const COMMENT_MAX_LENGTH = 140;

// --- базовые элементы формы ---
const formElement = document.querySelector('.img-upload__form');
const fileInputElement = formElement.querySelector('#upload-file');
const overlayElement = formElement.querySelector('.img-upload__overlay');
const cancelButtonElement = formElement.querySelector('#upload-cancel');
const bodyElement = document.body;

const hashtagInputElement = formElement.querySelector('.text__hashtags');
const descriptionInputElement = formElement.querySelector('.text__description');

// элементы масштаба
const scaleSmallerButtonElement = formElement.querySelector('.scale__control--smaller');
const scaleBiggerButtonElement = formElement.querySelector('.scale__control--bigger');
const scaleControlValueElement = formElement.querySelector('.scale__control--value');

// превью изображения и мини-превью эффектов
const imagePreviewElement = formElement.querySelector('.img-upload__preview img');
const effectPreviewElements = formElement.querySelectorAll('.effects__preview');

// элементы для эффектов и слайдера
const effectsListElement = formElement.querySelector('.effects__list');
const effectLevelContainerElement = formElement.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = effectLevelContainerElement.querySelector('.effect-level__slider');
const effectLevelValueElement = effectLevelContainerElement.querySelector('.effect-level__value');

// кнопка отправки
const submitButtonElement = formElement.querySelector('#upload-submit');

// Pristine
const pristine = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
});

// === ПРЕВЬЮ ЗАГРУЖЕННОГО ИЗОБРАЖЕНИЯ ===

const updateImagePreview = () => {
  const file = fileInputElement.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((extension) => fileName.endsWith(extension));

  if (!matches) {
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  imagePreviewElement.src = imageUrl;

  effectPreviewElements.forEach((previewElement) => {
    previewElement.style.backgroundImage = `url('${imageUrl}')`;
  });
};

// === МАСШТАБ ===

const getScaleValue = () => {
  const valueWithPercent = scaleControlValueElement.value;
  const numericValue = parseInt(valueWithPercent, 10);
  return Number.isNaN(numericValue) ? SCALE_DEFAULT : numericValue;
};

const applyScale = (value) => {
  const clampedValue = Math.min(Math.max(value, SCALE_MIN), SCALE_MAX);
  scaleControlValueElement.value = `${clampedValue}%`;

  const scaleFactor = clampedValue / 100;
  imagePreviewElement.style.transform = `scale(${scaleFactor})`;
};

const resetScale = () => {
  applyScale(SCALE_DEFAULT);
};

const onScaleSmallerButtonClick = () => {
  const currentValue = getScaleValue();
  applyScale(currentValue - SCALE_STEP);
};

const onScaleBiggerButtonClick = () => {
  const currentValue = getScaleValue();
  applyScale(currentValue + SCALE_STEP);
};

// === ЭФФЕКТЫ ===

const EffectSliderOptions = {
  [Effect.CHROME]: {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  },
  [Effect.SEPIA]: {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  },
  [Effect.MARVIN]: {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
  },
  [Effect.PHOBOS]: {
    range: {
      min: 0,
      max: 3,
    },
    start: 3,
    step: 0.1,
  },
  [Effect.HEAT]: {
    range: {
      min: 1,
      max: 3,
    },
    start: 3,
    step: 0.1,
  },
};

let currentEffect = Effect.NONE;

const applyEffect = (effect, value) => {
  let cssFilter = 'none';

  switch (effect) {
    case Effect.CHROME:
      cssFilter = `grayscale(${value})`;
      break;
    case Effect.SEPIA:
      cssFilter = `sepia(${value})`;
      break;
    case Effect.MARVIN:
      cssFilter = `invert(${value}%)`;
      break;
    case Effect.PHOBOS:
      cssFilter = `blur(${value}px)`;
      break;
    case Effect.HEAT:
      cssFilter = `brightness(${value})`;
      break;
    case Effect.NONE:
    default:
      cssFilter = 'none';
      break;
  }

  imagePreviewElement.style.filter = cssFilter;
};

const createEffectSlider = () => {
  noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
    connect: 'lower',
  });

  effectLevelSliderElement.noUiSlider.on('update', () => {
    const sliderValueString = effectLevelSliderElement.noUiSlider.get();
    const sliderValue = Number(sliderValueString);

    effectLevelValueElement.value = sliderValue;

    if (currentEffect !== Effect.NONE) {
      applyEffect(currentEffect, sliderValue);
    } else {
      imagePreviewElement.style.filter = 'none';
    }
  });
};

const updateSliderOptionsForEffect = (effect) => {
  if (effect === Effect.NONE) {
    return;
  }

  const options = EffectSliderOptions[effect];

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: options.range,
    start: options.start,
    step: options.step,
  });

  const defaultValue = options.start;
  effectLevelValueElement.value = defaultValue;
  applyEffect(effect, defaultValue);
};

const setEffect = (effect) => {
  currentEffect = effect;

  if (currentEffect === Effect.NONE) {
    effectLevelContainerElement.classList.add('hidden');
    imagePreviewElement.style.filter = 'none';
    effectLevelValueElement.value = '';
    return;
  }

  effectLevelContainerElement.classList.remove('hidden');
  updateSliderOptionsForEffect(currentEffect);
};

const onEffectsListChange = (evt) => {
  const target = evt.target;

  if (!target.classList.contains('effects__radio')) {
    return;
  }

  const selectedEffect = target.value;

  switch (selectedEffect) {
    case Effect.CHROME:
    case Effect.SEPIA:
    case Effect.MARVIN:
    case Effect.PHOBOS:
    case Effect.HEAT:
    case Effect.NONE:
      setEffect(selectedEffect);
      break;
    default:
      setEffect(Effect.NONE);
  }
};

const resetEffects = () => {
  setEffect(Effect.NONE);

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  });

  effectLevelValueElement.value = '';
};

// === ОТКРЫТИЕ / ЗАКРЫТИЕ ФОРМЫ ===

const openForm = () => {
  overlayElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  resetScale();
  resetEffects();
};

const closeForm = () => {
  overlayElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  formElement.reset();
  pristine.reset();
  fileInputElement.value = '';
  resetScale();
  resetEffects();
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) &&
    !evt.target.closest('.text__hashtags') &&
    !evt.target.closest('.text__description')) {
    evt.preventDefault();
    closeForm();
  }
}

// блокируем Esc внутри полей ввода
[hashtagInputElement, descriptionInputElement].forEach((inputElement) => {
  inputElement.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });
});

// загрузка файла
fileInputElement.addEventListener('change', () => {
  if (!fileInputElement.files || fileInputElement.files.length === 0) {
    return;
  }

  updateImagePreview();
  openForm();
});

// кнопка "Закрыть"
cancelButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// === ВАЛИДАЦИЯ ХЭШТЕГОВ И КОММЕНТАРИЯ ===

const validateHashtags = (value) => {
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

  return hashtags.every((tag) => hashtagPattern.test(tag)) &&
    uniqueTags.size === hashtags.length;
};

pristine.addValidator(
  hashtagInputElement,
  validateHashtags,
  'Неверный формат тегов. Не более 5, без спецсимволов, не повторяются.',
);

const validateDescription = (value) => value.length <= COMMENT_MAX_LENGTH;

pristine.addValidator(
  descriptionInputElement,
  validateDescription,
  `Комментарий не должен превышать ${COMMENT_MAX_LENGTH} символов.`,
);

// === БЛОКИРОВКА КНОПКИ ОТПРАВКИ ===

const setSubmitButtonState = (isDisabled) => {
  submitButtonElement.disabled = isDisabled;
  submitButtonElement.textContent = isDisabled ? 'Публикую...' : 'Опубликовать';
};

// === ОТПРАВКА ФОРМЫ ЧЕРЕЗ FETCH ===

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (!isValid) {
    return;
  }

  setSubmitButtonState(true);

  const formData = new FormData(formElement);

  sendData(
    () => {
      setSubmitButtonState(false);
      closeForm();
      showSuccessMessage();
    },
    () => {
      setSubmitButtonState(false);
      showErrorMessage();
    },
    formData,
  );
});

// инициализация слайдера и обработчиков

createEffectSlider();
effectLevelContainerElement.classList.add('hidden');
resetScale();

scaleSmallerButtonElement.addEventListener('click', onScaleSmallerButtonClick);
scaleBiggerButtonElement.addEventListener('click', onScaleBiggerButtonClick);
effectsListElement.addEventListener('change', onEffectsListChange);
