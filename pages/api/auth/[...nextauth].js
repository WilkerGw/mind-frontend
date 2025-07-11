// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Você precisará criar e importar esta função que se comunicará com seu backend real
// Exemplo: import { verifyUserCredentials } from '../../../lib/auth-api'; 

export const authOptions = { // Renomeado para 'authOptions' para ser facilmente importável
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // IMPORTANTE: REMOVA OS USUÁRIOS HARDCODED EM PRODUÇÃO!
        // Esta é uma VULNERABILIDADE GRAVE se mantida.
        // Em vez disso, faça uma chamada segura ao seu backend para verificar as credenciais.
        // O backend DEVE armazenar senhas HASHEADAS (ex: com bcrypt) e não em texto claro.
        
        // Exemplo CONCEITUAL: substitua por uma chamada real à sua API de backend
        // const user = await verifyUserCredentials(credentials.email, credentials.password);
        
        // APENAS PARA EXEMPLO E TESTE INICIAL - NÃO USE EM PRODUÇÃO:
        const hardcodedUsers = [
          { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password1' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password2' },
          { id: '3', name: 'Alice Johnson', email: 'alice@example.com', password: 'password3' },
        ];
        const user = hardcodedUsers.find(u => u.email === credentials.email && u.password === credentials.password);

        if (user) {
          // Em um cenário real, 'user' viria do seu banco de dados e conteria informações
          // como o ID e, possivelmente, papéis/permissões.
          return user;
        } else {
          return null; // Credenciais inválidas
        }
      }
    })
  ],
  session: {
    strategy: 'jwt', // Usando JWT para gestão de sessão
  },
  callbacks: {
    // Adiciona o ID do usuário ao token JWT
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        // Se seu backend retornar roles/permissões, adicione-as aqui:
        // token.roles = user.roles; 
      }
      return token;
    },
    // Adiciona o ID (e roles, se existirem) à sessão acessível no cliente
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        // session.user.roles = token.roles; // Se você adicionou roles no JWT
      }
      return session;
    },
  },
  // Configura páginas customizadas para lidar com fluxos de autenticação
  pages: {
    signIn: '/', // Página de login principal
    error: '/auth/error', // Você precisará criar esta página para exibir mensagens de erro genéricas
  },
  // Opcional: configurar secret para proteger os tokens JWT
  // Em produção, use uma string longa e complexa gerada de forma segura
  secret: process.env.NEXTAUTH_SECRET, // DEVE ser definida no .env.local em produção
};

export default NextAuth(authOptions);