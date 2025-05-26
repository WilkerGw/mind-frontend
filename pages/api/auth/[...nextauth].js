// my-nextjs-auth-app/pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password1' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password2' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', password: 'password3' },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

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
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
});