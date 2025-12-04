let closeMessage;

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeMessage();
  }
};

const onOutsideClick = (evt) => {
  const target = evt.target;

  if (target.classList.contains('success') ||
      target.classList.contains('error')) {
    closeMessage();
  }
};

const showMessage = (templateId) => {
  const template = document
    .querySelector(`#${templateId}`)
    .content
    .cloneNode(true);

  const messageElement = template.querySelector('section');
  const buttonElement = messageElement.querySelector('button');

  document.body.append(messageElement);

  closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    messageElement.removeEventListener('click', onOutsideClick);
  };

  buttonElement.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onDocumentKeydown);
  messageElement.addEventListener('click', onOutsideClick);
};

export const showSuccessMessage = () => showMessage('success');
export const showErrorMessage = () => showMessage('error');
