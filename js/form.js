import { isEscapeKey } from './util.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const Effect = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

const COMMENT_MAX_LENGTH = 140;

const formElement = document.querySelector('.img-upload__form');
const fileInputElement = formElement.querySelector('#upload-file');
const overlayElement = formElement.querySelector('.img-upload__overlay');
const cancelButtonElement = formElement.querySelector('#upload-cancel');
const bodyElement = document.body;

const hashtagInputElement = formElement.querySelector('.text__hashtags');
const descriptionInputElement = formElement.querySelector('.text__description');

const scaleSmallerButtonElement = formElement.querySelector('.scale__control--smaller');
const scaleBiggerButtonElement = formElement.querySelector('.scale__control--bigger');
const scaleControlValueElement = formElement.querySelector('.scale__control--value');

const imagePreviewElement = formElement.querySelector('.img-upload__preview img');
const effectPreviewElements = formElement.querySelectorAll('.effects__preview');

const effectsListElement = formElement.querySelector('.effects__list');
const effectLevelContainerElement = formElement.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = effectLevelContainerElement.querySelector('.effect-level__slider');
const effectLevelValueElement = effectLevelContainerElement.querySelector('.effect-level__value');

const submitButtonElement = formElement.querySelector('#upload-submit');

const pristine = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
});

let currentImageUrl = '';
let currentEffect = Effect.NONE;

const EffectSliderOptions = {
  [Effect.CHROME]: { range: { min: 0, max: 1 }, start: 1, step: 0.1 },
  [Effect.SEPIA]: { range: { min: 0, max: 1 }, start: 1, step: 0.1 },
  [Effect.MARVIN]: { range: { min: 0, max: 100 }, start: 100, step: 1 },
  [Effect.PHOBOS]: { range: { min: 0, max: 3 }, start: 3, step: 0.1 },
  [Effect.HEAT]: { range: { min: 1, max: 3 }, start: 3, step: 0.1 },
};

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

  currentImageUrl = URL.createObjectURL(file);
  imagePreviewElement.src = currentImageUrl;

  effectPreviewElements.forEach((previewElement) => {
    previewElement.style.backgroundImage = `url('${currentImageUrl}')`;
  });
};

const getScaleValue = () => {
  const numericValue = parseInt(scaleControlValueElement.value, 10);
  return Number.isNaN(numericValue) ? SCALE_DEFAULT : numericValue;
};

const applyScale = (value) => {
  const clampedValue = Math.min(Math.max(value, SCALE_MIN), SCALE_MAX);
  scaleControlValueElement.value = `${clampedValue}%`;
  imagePreviewElement.style.transform = `scale(${clampedValue / 100})`;
  imagePreviewElement.style.transformOrigin = 'center center';
};

const resetScale = () => {
  applyScale(SCALE_DEFAULT);
};

const onScaleSmallerButtonClick = () => {
  applyScale(getScaleValue() - SCALE_STEP);
};

const onScaleBiggerButtonClick = () => {
  applyScale(getScaleValue() + SCALE_STEP);
};

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
  }

  imagePreviewElement.style.filter = cssFilter;
};

const createEffectSlider = () => {
  noUiSlider.create(effectLevelSliderElement, {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    connect: 'lower',
  });

  effectLevelSliderElement.noUiSlider.on('update', () => {
    const sliderValue = Number(effectLevelSliderElement.noUiSlider.get());
    effectLevelValueElement.value = sliderValue;

    if (currentEffect === Effect.NONE) {
      imagePreviewElement.style.filter = 'none';
      return;
    }

    applyEffect(currentEffect, sliderValue);
  });
};

const updateSliderOptionsForEffect = (effect) => {
  const options = EffectSliderOptions[effect];

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: options.range,
    start: options.start,
    step: options.step,
  });

  effectLevelValueElement.value = options.start;
  applyEffect(effect, options.start);
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
  setEffect(EffectSliderOptions[selectedEffect] ? selectedEffect : Effect.NONE);
};

const resetEffects = () => {
  setEffect(Effect.NONE);

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
  });

  effectLevelValueElement.value = '';
};

function closeForm() {
  overlayElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  formElement.reset();
  pristine.reset();

  fileInputElement.value = '';
  resetScale();
  resetEffects();
}

function onDocumentKeydown(evt) {
  const isInTextField =
    evt.target.closest('.text__hashtags') || evt.target.closest('.text__description');

  if (isEscapeKey(evt) && !isInTextField) {
    evt.preventDefault();
    closeForm();
  }
}

const openForm = () => {
  overlayElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  resetScale();
  resetEffects();
};

[hashtagInputElement, descriptionInputElement].forEach((inputElement) => {
  inputElement.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });
});

fileInputElement.addEventListener('change', () => {
  if (!fileInputElement.files || fileInputElement.files.length === 0) {
    return;
  }

  updateImagePreview();
  openForm();
});

cancelButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

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

const setSubmitButtonState = (isDisabled) => {
  submitButtonElement.disabled = isDisabled;
  submitButtonElement.textContent = isDisabled ? 'Публикую...' : 'Опубликовать';
};

const dispatchUploadSuccess = () => {
  if (!currentImageUrl) {
    return;
  }

  const scaleFactor = getScaleValue() / 100;

  const uploadedPhoto = {
    url: currentImageUrl,
    description: descriptionInputElement.value.trim(),
    likes: 0,
    comments: [],
    filter: imagePreviewElement.style.filter || 'none',
    scale: scaleFactor,
  };

  document.dispatchEvent(new CustomEvent('photo-upload-success', { detail: uploadedPhoto }));
};

const handleFormSuccess = () => {
  dispatchUploadSuccess();
  setSubmitButtonState(false);
  closeForm();
  showSuccessMessage();
};

const handleFormFail = () => {
  setSubmitButtonState(false);
  showErrorMessage();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  setSubmitButtonState(true);

  sendData(handleFormSuccess, handleFormFail, new FormData(formElement));
};

formElement.addEventListener('submit', onFormSubmit);

createEffectSlider();
effectLevelContainerElement.classList.add('hidden');
resetScale();

scaleSmallerButtonElement.addEventListener('click', onScaleSmallerButtonClick);
scaleBiggerButtonElement.addEventListener('click', onScaleBiggerButtonClick);
effectsListElement.addEventListener('change', onEffectsListChange);
