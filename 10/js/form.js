// Импорт утилиты для проверки Escape
import { isEscapeKey } from './util.js';

// 9.13: поддерживаемые типы файлов для превью
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

// 9.13: константы масштаба
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

// 9.13: перечисление эффектов
const Effect = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

// 9.13: константа максимальной длины комментария
const COMMENT_MAX_LENGTH = 140;

// --- базовые элементы формы ---
const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('#upload-file');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('#upload-cancel');
const body = document.body;

const hashtagInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');

// 9.13: элементы масштаба
const scaleSmallerButtonElement = form.querySelector('.scale__control--smaller');
const scaleBiggerButtonElement = form.querySelector('.scale__control--bigger');
const scaleControlValueElement = form.querySelector('.scale__control--value');

// 9.13: превью изображения и мини-превью эффектов
const imagePreviewElement = form.querySelector('.img-upload__preview img');
const effectPreviewElements = form.querySelectorAll('.effects__preview');

// 9.13: элементы для эффектов и слайдера
const effectsListElement = form.querySelector('.effects__list');
const effectLevelContainerElement = form.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = effectLevelContainerElement.querySelector('.effect-level__slider');
const effectLevelValueElement = effectLevelContainerElement.querySelector('.effect-level__value');

// Pristine
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
});

// 9.13: превью загруженного изображения

const updateImagePreview = () => {
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((ext) => fileName.endsWith(ext));

  if (!matches) {
    // Формат файла не поддерживается - просто не меняем превью
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  // Обновляем основное превью
  imagePreviewElement.src = imageUrl;

  // Обновляем мини-превью в списке эффектов
  effectPreviewElements.forEach((previewElement) => {
    previewElement.style.backgroundImage = `url('${imageUrl}')`;
  });
};

// 9.13: масштабирование изображения

const getScaleValue = () => {
  const valueWithPercent = scaleControlValueElement.value; // например "75%"
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

// 9.13: эффекты и настройки слайдера

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
  // Создаем слайдер один раз при инициализации модуля
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
    // Оригинал: скрываем слайдер и снимаем фильтр
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

  // Возвращаем слайдер в дефолтную конфигурацию
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

// ОТКРЫТИЕ / ЗАКРЫТИЕ ФОРМЫ

// 9.13: добавил сброс масштаба и эффектов при открытии
const openForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  resetScale();
  resetEffects();
};

// 9.13: сбрасываем форму, масштаб, эффекты и input файла
const closeForm = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  form.reset();
  pristine.reset();
  fileInput.value = '';
  resetScale();
  resetEffects();
};

// обработка Esc
function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !evt.target.closest('.text__hashtags') && !evt.target.closest('.text__description')) {
    evt.preventDefault();
    closeForm();
  }
}

// блокируем Esc внутри полей
[hashtagInput, descriptionInput].forEach((input) => {
  input.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });
});

// загрузка файла
// 9.13: добавил updateImagePreview()
fileInput.addEventListener('change', () => {
  if (!fileInput.files || fileInput.files.length === 0) {
    return;
  }

  updateImagePreview();
  openForm();
});

// кнопка "Закрыть"
cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// ВАЛИДАЦИЯ ХЭШТЕГОВ И КОММЕНТАРИЯ

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
  'Неверный формат тегов. Не более 5, без спецсимволов, не повторяются.',
);

function validateDescription(value) {
  return value.length <= COMMENT_MAX_LENGTH;
}

pristine.addValidator(
  descriptionInput,
  validateDescription,
  `Комментарий не должен превышать ${COMMENT_MAX_LENGTH} символов.`,
);

// отправка формы
form.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
});

// 9.13: инициализация слайдера и навешивание обработчиков масштаба/эффектов

createEffectSlider();
effectLevelContainerElement.classList.add('hidden'); // по умолчанию слайдер скрыт
resetScale();

scaleSmallerButtonElement.addEventListener('click', onScaleSmallerButtonClick);
scaleBiggerButtonElement.addEventListener('click', onScaleBiggerButtonClick);
effectsListElement.addEventListener('change', onEffectsListChange);
