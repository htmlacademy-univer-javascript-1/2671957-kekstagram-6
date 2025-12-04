// js/messages.js
import { isEscapeKey } from './util.js';

const successTemplate = document
  .querySelector('#success')
  .content
  .querySelector('.success');

const errorTemplate = document
  .querySelector('#error')
  .content
  .querySelector('.error');

const createMessage = (template) => {
  const messageElement = template.cloneNode(true);
  const innerElement = messageElement.querySelector('.success__inner') ||
    messageElement.querySelector('.error__inner');
  const buttonElement = messageElement.querySelector('.success__button') ||
    messageElement.querySelector('.error__button');

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    messageElement.removeEventListener('click', onOutsideClick);
  };

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeMessage();
    }
  };

  const onOutsideClick = (evt) => {
    if (!innerElement.contains(evt.target)) {
      closeMessage();
    }
  };

  buttonElement.addEventListener('click', () => {
    closeMessage();
  });

  document.addEventListener('keydown', onDocumentKeydown);
  messageElement.addEventListener('click', onOutsideClick);

  document.body.append(messageElement);
};

export const showSuccessMessage = () => createMessage(successTemplate);
export const showErrorMessage = () => createMessage(errorTemplate);
