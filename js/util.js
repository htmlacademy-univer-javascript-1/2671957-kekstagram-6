const ALERT_SHOW_TIME = 5000;

export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const showAlert = (message) => {
  const alertElement = document.createElement('div');
  alertElement.style.position = 'fixed';
  alertElement.style.left = '0';
  alertElement.style.top = '0';
  alertElement.style.right = '0';
  alertElement.style.zIndex = '100';
  alertElement.style.padding = '10px 3px';
  alertElement.style.fontSize = '16px';
  alertElement.style.textAlign = 'center';
  alertElement.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  alertElement.style.color = '#ffffff';

  alertElement.textContent = message;

  document.body.append(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, ALERT_SHOW_TIME);
};

export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...rest), timeoutDelay);
  };
};
