// ф-ция отправки запроса на сервер, получение ответа с сервера в виде
// promise и далее возвращает и конвертирует в json
const postData = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST', // каким образом
    headers: {
      'Content-type': 'application/json',
    },
    body: data, // что именно
  });

  return await res.json();
};

// ф-ция получения данных с сервера. Делаем запрос на сервер,
// дожидаемся окончания, обрабатываем ошибку и трансформируем в json
const getResource = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }

  return await res.json();
};

export { postData };
export { getResource };
