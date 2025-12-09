// js/api.js

const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  DATA: '/data',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу.',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз.',
};

const load = (route, method, body = null) =>
  fetch(`${BASE_URL}${route}`, {
    method,
    body,
  });

export const getData = (onSuccess, onFail) => {
  load(Route.DATA, Method.GET)
    .then((response) => {
      if (!response.ok) {
        throw new Error(ErrorText.GET_DATA);
      }
      return response.json();
    })
    .then((photos) => {
      onSuccess(photos);
    })
    .catch(() => {
      onFail(ErrorText.GET_DATA);
    });
};

export const sendData = (onSuccess, onFail, body) => {
  load('', Method.POST, body)
    .then((response) => {
      if (!response.ok) {
        throw new Error(ErrorText.SEND_DATA);
      }
      onSuccess();
    })
    .catch(() => {
      onFail(ErrorText.SEND_DATA);
    });
};
