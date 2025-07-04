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

// Busca todos os agendamentos
export async function getAgendamentos() {
  const response = await fetch(`${API_URL}/agendamento`);
  return handleResponse(response);
}

// Busca um agendamento por ID
export async function getAgendamentoById(id) {
  const response = await fetch(`${API_URL}/agendamento/${id}`);
  return handleResponse(response);
}

// Cria um novo agendamento
export async function createAgendamento(data) {
  const response = await fetch(`${API_URL}/agendamento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Atualiza um agendamento
export async function updateAgendamento(id, data) {
  const response = await fetch(`${API_URL}/agendamento/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Deleta um agendamento
export async function deleteAgendamento(id) {
  const response = await fetch(`${API_URL}/agendamento/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function getTodaysAppointments() {
  const response = await fetch(`${API_URL}/agendamento/today`, { cache: 'no-store' });
  return handleResponse(response);
}