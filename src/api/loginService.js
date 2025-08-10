const LOGIN_URL = 'http://localhost:3000/api/v1/login';
const BASIC_AUTH_USER = import.meta.env.VITE_APP_BASIC_AUTH_USER; // replace with your actual user
const BASIC_AUTH_PASS = import.meta.env.VITE_APP_BASIC_AUTH_PASS; // replace with your actual pass

export function setToken(token) {
  if (token) {
    localStorage.setItem('jwtToken', token);
  } else {
    localStorage.removeItem('jwtToken');
  }
}

export function getToken() {
  return localStorage.getItem('jwtToken');
}

export async function login(username, password) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(BASIC_AUTH_USER + ':' + BASIC_AUTH_PASS),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  setToken(data.token);
  return data;
}

export function logout() {
  setToken(null);
}