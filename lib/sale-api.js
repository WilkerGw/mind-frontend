// lib/sale-api.js
// A URL da API deve apontar para as suas Next.js API Routes
// E em produção, a aplicação Next.js deve ser servida via HTTPS.
// 'http://localhost:3000/api' seria para desenvolvimento local com rewrites.
// Em produção, isso se resolveria para o próprio domínio da sua aplicação Next.js.
const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL || '/api'; // Use um caminho relativo ou URL absoluta para seu Next.js API Routes
// Em produção, NEXT_PUBLIC_FRONTEND_API_URL seria 'https://www.seuerp.com/api' ou apenas '/api' se no mesmo domínio.

// Função auxiliar para lidar com as respostas da API
async function handleResponse(response) {
  if (!response.ok) {
    // Tenta parsear o erro do backend para uma mensagem mais específica
    const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro na comunicação com a API' }));
    throw new Error(errorData.error || `Erro de servidor: ${response.status}`);
  }
  if (response.status === 204) return null; // No Content para DELETE
  return response.json();
}

// Busca todas as vendas
export async function getSales() {
  const response = await fetch(`${API_BASE_URL}/sales`);
  return handleResponse(response);
}

// Busca uma venda por ID
export async function getSaleById(id) {
  const response = await fetch(`${API_BASE_URL}/sales/${id}`);
  return handleResponse(response);
}

// Cria uma nova venda
export async function createSale(data) {
  const response = await fetch(`${API_BASE_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Deleta uma venda
export async function deleteSale(id) {
  const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// Busca histórico de vendas (para o gráfico)
export async function getSalesHistory() {
  // Garanta que esta rota também seja protegida no app/api
  const response = await fetch(`${API_BASE_URL}/sales/history`, { cache: 'no-store' });
  return handleResponse(response);
}