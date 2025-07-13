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

export async function getTodaysAppointments() {
  const response = await fetch(`${API_BASE_URL}/agendamento/today`, { cache: 'no-store' });
  return handleResponse(response);
}


export async function getAgendamentos() { 
  const response = await fetch(`${API_BASE_URL}/agendamento`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function getAllAgendamentos() { 
  const response = await fetch(`${API_BASE_URL}/agendamento`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function createAgendamento(data) {
  const response = await fetch(`${API_BASE_URL}/agendamento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateAgendamento(id, data) {
  const response = await fetch(`${API_BASE_URL}/agendamento/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteAgendamento(id) {
  const response = await fetch(`${API_BASE_URL}/agendamento/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function getAgendamentoById(id) {
    const response = await fetch(`${API_BASE_URL}/agendamento/${id}`, { cache: 'no-store' });
    return handleResponse(response);
}

export async function getAgendamentosHistory() {
    const response = await fetch(`${API_BASE_URL}/agendamento/history`, { cache: 'no-store' });
    return handleResponse(response);
}