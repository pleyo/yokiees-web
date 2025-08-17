export default (request) => {
  const auth = request.headers.get('Authorization');
  const validCredentials = 'Basic ' + btoa('yokiees:sweet2025');

  if (auth === validCredentials) {
    return fetch(request);
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic' },
  });
};