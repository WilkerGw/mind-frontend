// lib/agendamento-api.js
const API_BASE_URL = '/api'; // Sempre chamar as próprias API Routes do Next.js
// Remova process.env.NEXT_PUBLIC_API_URL daqui, pois ele deve ser usado apenas nas API Routes para o backend.

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erro na API: ${response.status}`);
  }
  return response.json();
}

export async function getAgendamentos() {
  // Chama a API Route do Next.js: /api/agendamento (que por sua vez chama o backend)
  const response = await fetch(`${API_BASE_URL}/agendamento`); 
  return handleResponse(response);
}

export async function getAgendamentoById(id) {
  // Chama a API Route do Next.js: /api/agendamento/[id]
  const response = await fetch(`${API_BASE_URL}/agendamento/${id}`);
  return handleResponse(response);
}

export async function createAgendamento(agendamentoData) {
  // Chama a API Route do Next.js: POST /api/agendamento
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
  // Chama a API Route do Next.js: PUT /api/agendamento/[id]
  const response = await fetch(`${API_BASE_URL}/agendamento/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteAgendamento(id) {
  // Chama a API Route do Next.js: DELETE /api/agendamento/[id]
  const response = await fetch(`${API_BASE_URL}/agendamento/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// **NOVA ROTA NECESSÁRIA NO BACKEND**
// Seu frontend está tentando chamar /api/agendamento/today, mas essa rota não existe no backend.
// Para resolver isso, você precisará adicionar uma nova rota ao seu backend (em controllers/agendamento.js e routes/agendamento.js)
// OU remover a chamada getTodaysAppointments() do seu frontend se ela não for essencial.
export async function getTodaysAppointments() {
  // Esta chamada irá para a API Route do Next.js: /api/agendamento/today
  // VOCÊ PRECISARÁ CRIAR ESSA ROTA NO SEU BACKEND OU REMOVER ESTA CHAMADA SE ELA NÃO FOR USADA/NECESSÁRIA.
  const response = await fetch(`${API_BASE_URL}/agendamento/today`, { cache: 'no-store' });
  return handleResponse(response);
}