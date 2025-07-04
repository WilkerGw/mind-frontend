const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro' }));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

// Busca todos os boletos
export async function getBoletos() {
  const response = await fetch(`${API_URL}/boletos`, { cache: 'no-store' });
  return handleResponse(response);
}

// Busca boletos vencidos
export async function getOverdueBoletos() {
  const response = await fetch(`${API_URL}/boletos/overdue`, { cache: 'no-store' });
  return handleResponse(response);
}

// Busca boletos que vencem em breve
export async function getDueSoonBoletos() {
  const response = await fetch(`${API_URL}/boletos/due-soon`, { cache: 'no-store' });
  return handleResponse(response);
}

// Atualiza o status de um boleto
export async function updateBoletoStatus(id, status) {
  const response = await fetch(`${API_URL}/boletos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });
  return handleResponse(response);
}

// Deleta um boleto
export async function deleteBoleto(id) {
  const response = await fetch(`${API_URL}/boletos/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  return handleResponse(response);
}

// Cria um ou mais boletos
export async function createInstallmentPlan(boletosArray) {
  const response = await fetch(`${API_URL}/boletos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boletosArray),
    cache: 'no-store',
  });
  return handleResponse(response);
}