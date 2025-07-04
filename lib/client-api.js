const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Função auxiliar para lidar com as respostas da API de forma padronizada
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro na comunicação com a API' }));
    throw new Error(errorData.error || `Erro de servidor: ${response.status}`);
  }
  // Se a resposta for 204 (No Content), como em um DELETE, não há corpo para ler
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

// Busca todos os clientes
export async function getClients() {
  const response = await fetch(`${API_URL}/clients`);
  return handleResponse(response);
}

// Busca um cliente por ID
export async function getClientById(id) {
  const response = await fetch(`${API_URL}/clients/${id}`);
  return handleResponse(response);
}

// Cria um novo cliente
export async function createClient(data) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Atualiza um cliente
export async function updateClient(id, data) {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Deleta um cliente
export async function deleteClient(id) {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}