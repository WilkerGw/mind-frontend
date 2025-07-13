const BACKEND_AUTH_URL = process.env.BACKEND_AUTH_URL || 'http://localhost:5000/api/auth';


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

    return userData; 

  } catch (error) {
    console.error("Erro ao verificar credenciais com o backend:", error);
    throw error;
  }
}