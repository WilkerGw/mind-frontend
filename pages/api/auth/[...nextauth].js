import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


export const authOptions = { 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {

        const hardcodedUsers = [
          { id: '1', name: 'Nilton Jr', email: 'njbil2005@hotmail.com', password: 'maggiesol2025' },
          { id: '2', name: 'Wilker Martins', email: 'jane@example.com', password: 'maggiesol1992' },
          { id: '3', name: 'Alice Johnson', email: 'alice@example.com', password: 'password3' },
        ];
        const user = hardcodedUsers.find(u => u.email === credentials.email && u.password === credentials.password);

        if (user) {

          return user;
        } else {
          return null; 
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

      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', 
    error: '/auth/error', 
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);