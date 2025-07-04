const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Função auxiliar para lidar com as respostas da API
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

// Busca todos os produtos
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
}

// Busca um produto por ID
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
}

// Cria um novo produto
export async function createProduct(data) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Atualiza um produto
export async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Deleta um produto
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}