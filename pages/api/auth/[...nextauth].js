import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyUserCredentials } from '../../../lib/auth-api';

export const authOptions = { 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        try {
          const user = await verifyUserCredentials(credentials.email, credentials.password);

          if (user && user.id) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || 'Erro de autenticação.');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt', 
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
            id: token.id,
            name: token.name,
            email: token.email,
        };
        session.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', 
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);