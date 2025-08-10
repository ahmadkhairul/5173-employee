// Employee API service for CRUD operations
const API_URL = 'http://localhost:3000/api/v1/employees';

function getToken() {
  return localStorage.getItem('jwtToken');
}

function authHeaders() {
  const token = getToken();
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

export async function getEmployees() {
  const res = await fetch(API_URL, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function addEmployee(employee) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to add employee');
  return res.json();
}

export async function updateEmployee(id, employee) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete employee');
  return res.json();
}