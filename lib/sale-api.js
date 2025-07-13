const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL || '/api'; 

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro na comunicação com a API' }));
    throw new Error(errorData.error || `Erro de servidor: ${response.status}`);
  }
  if (response.status === 204) return null; 
  return response.json();
}

export async function getSales() {
  const response = await fetch(`${API_BASE_URL}/sales`);
  return handleResponse(response);
}

export async function getSaleById(id) {
  const response = await fetch(`${API_BASE_URL}/sales/${id}`);
  return handleResponse(response);
}

export async function createSale(data) {
  const response = await fetch(`${API_BASE_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteSale(id) {
  const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function getSalesHistory() {
  const response = await fetch(`${API_BASE_URL}/sales/history`, { cache: 'no-store' });
  return handleResponse(response);
}