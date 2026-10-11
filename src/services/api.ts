
const API_URL = 'https://budget-app-backend-z0kz.onrender.com';
const API_URL_test = 'http://localhost:3000';

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL_test}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  return response.json() as Promise<T>;
}