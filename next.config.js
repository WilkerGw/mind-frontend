/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remova ou comente a seção 'async rewrites()' se existir, pois não será mais necessária
  // já que todas as chamadas de API do frontend vão para as Next.js API Routes.
  // async rewrites() {
  //   return [
  //     // Você pode remover tudo aqui
  //   ];
  // },
};

module.exports = nextConfig;