const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL || '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro' }));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getBoletos() {
  const response = await fetch(`${API_BASE_URL}/boletos`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function getOverdueBoletos() {
  const response = await fetch(`${API_BASE_URL}/boletos/overdue`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function getDueSoonBoletos() {
  const response = await fetch(`${API_BASE_URL}/boletos/due-soon`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function updateBoletoStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/boletos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });
  return handleResponse(response);
}

export async function deleteBoleto(id) {
  const response = await fetch(`${API_BASE_URL}/boletos/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  return handleResponse(response);
}

export async function createInstallmentPlan(boletosArray) {
  const response = await fetch(`${API_BASE_URL}/boletos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boletosArray),
    cache: 'no-store',
  });
  return handleResponse(response);
}