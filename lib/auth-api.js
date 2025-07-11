// lib/auth-api.js
// Este é um arquivo CONCEITUAL. Você precisará implementá-lo de acordo
// com a sua API de backend REAL.

const BACKEND_AUTH_URL = process.env.BACKEND_AUTH_URL || 'http://localhost:5000/api/auth';
// Em produção, esta URL DEVE ser HTTPS. Ex: 'https://api.seuerp.com/api/auth'

export async function verifyUserCredentials(email, password) {
  try {
    const response = await fetch(`${BACKEND_AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro de autenticação no servidor.' }));
      throw new Error(errorData.message || 'Credenciais inválidas.');
    }

    const userData = await response.json();
    // O backend deve retornar um objeto de usuário que inclua pelo menos um 'id'.
    // Idealmente, também retornaria informações sobre roles/permissões.
    return userData; 

  } catch (error) {
    console.error("Erro ao verificar credenciais com o backend:", error);
    throw error;
  }
}