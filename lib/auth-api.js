const BACKEND_AUTH_URL = process.env.NEXT_PUBLIC_API_URL + '/api/auth' || 'http://localhost:5000/api/auth';

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

    if (!userData.id) {
        if (userData._id) {
            userData.id = userData._id;
            delete userData._id;
        } else {
            console.error("O backend não retornou um 'id' para o usuário.");
            throw new Error("Resposta de autenticação inválida do servidor.");
        }
    }
    
    return userData; 

  } catch (error) {
    console.error("Erro ao verificar credenciais com o backend:", error);
    throw error;
  }
}

export async function registerUser(data) {
  try {
    const response = await fetch(`${BACKEND_AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro no registo.' }));
      throw new Error(errorData.message || 'Não foi possível registar o utilizador.');
    }

    return response.json();

  } catch (error) {
    console.error("Erro ao registar utilizador no backend:", error);
    throw error;
  }
}