const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL || '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro na comunicação com a API' }));
    throw new Error(errorData.error || `Erro de servidor: ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function getClients() {
  const response = await fetch(`${API_BASE_URL}/clients`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function getClientById(id) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function createClient(data) {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateClient(id, data) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteClient(id) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// Nova função adicionada
export async function getMonthlyBirthdays() {
  const response = await fetch(`${API_BASE_URL}/clients-birthday`, { cache: 'no-store' });
  return handleResponse(response);
}