const API_BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erro na API: ${response.status}`);
  }
  if (response.status === 204) {
    return;
  }
  return response.json();
}

export async function getAgendamentos() {
  const response = await fetch(`${API_BASE_URL}/agendamento`); 
  return handleResponse(response);
}

export async function getAgendamentoById(id) {
  const response = await fetch(`${API_BASE_URL}/agendamento/${id}`);
  return handleResponse(response);
}

export async function createAgendamento(agendamentoData) {
  const response = await fetch(`${API_BASE_URL}/agendamento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agendamentoData),
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

export async function getTodaysAppointments() {
  const response = await fetch(`${API_BASE_URL}/agendamento/today`, { cache: 'no-store' });
  return handleResponse(response);
}