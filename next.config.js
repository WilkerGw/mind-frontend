/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/sales/:path*',
        destination: 'http://localhost:5000/api/sales/:path*', // Certifique-se de que a porta está correta
      },
      {
        source: '/api/agendamento/:path*',
        destination: 'http://localhost:5000/api/agendamento/:path*', // Adicione esta linha
      },
    ];
  },
};

module.exports = nextConfig;