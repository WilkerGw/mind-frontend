// lib/product-api.js
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

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
}

export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
}

export async function createProduct(data) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}