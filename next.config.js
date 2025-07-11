/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/sales/:path*',
        destination: 'http://localhost:5000/api/sales/:path*', // Em produção, mude para HTTPS da sua API real
      },
      {
        source: '/api/agendamento/:path*',
        destination: 'http://localhost:5000/api/agendamento/:path*', // Em produção, mude para HTTPS da sua API real
      },
      // Adicione rewrites para outras APIs se estiverem no mesmo domínio e você quiser proxy
      // Exemplo:
      // {
      //   source: '/api/products/:path*',
      //   destination: 'http://localhost:5000/api/products/:path*',
      // },
      // {
      //   source: '/api/clients/:path*',
      //   destination: 'http://localhost:5000/api/clients/:path*',
      // },
      // {
      //   source: '/api/boletos/:path*',
      //   destination: 'http://localhost:5000/api/boletos/:path*',
      // },
      // {
      //   source: '/api/promotions/:path*',
      //   destination: 'http://localhost:5000/api/promotions/:path*',
      // },
      // {
      //   source: '/api/clients-birthday/:path*',
      //   destination: 'http://localhost:5000/api/clients/birthday/monthly',
      // },
    ];
  },
};

module.exports = nextConfig;