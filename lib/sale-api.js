const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Função auxiliar para lidar com as respostas da API
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro na comunicação com a API' }));
    throw new Error(errorData.error || `Erro de servidor: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

// Busca todas as vendas
export async function getSales() {
  const response = await fetch(`${API_URL}/sales`);
  return handleResponse(response);
}

// Busca uma venda por ID
export async function getSaleById(id) {
  const response = await fetch(`${API_URL}/sales/${id}`);
  return handleResponse(response);
}

// Cria uma nova venda
export async function createSale(data) {
  const response = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Deleta uma venda
export async function deleteSale(id) {
  const response = await fetch(`${API_URL}/sales/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function getSalesHistory() {
  const response = await fetch(`${API_URL}/sales/history`, { cache: 'no-store' });
  return handleResponse(response);
}