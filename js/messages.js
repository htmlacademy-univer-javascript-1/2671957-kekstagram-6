let closeMessage = null;

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    if (closeMessage) {
      closeMessage();
    }
  }
};

const onOutsideClick = (evt) => {
  const target = evt.target;

  if (target.classList.contains('success') || target.classList.contains('error')) {
    if (closeMessage) {
      closeMessage();
    }
  }
};

const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`).content.cloneNode(true);

  const messageElement = template.querySelector('section');
  const buttonElement = messageElement.querySelector('button');

  document.body.append(messageElement);

  closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    messageElement.removeEventListener('click', onOutsideClick);
    closeMessage = null;
  };

  buttonElement.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onDocumentKeydown);
  messageElement.addEventListener('click', onOutsideClick);
};

export const showSuccessMessage = () => showMessage('success');
export const showErrorMessage = () => showMessage('error');
