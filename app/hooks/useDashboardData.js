// app/hooks/useDashboardData.js
import { useState, useEffect, useCallback } => 'react';

// API_URL deve apontar para as suas próprias API Routes do Next.js, não para o backend direto.
// Se process.env.NEXT_PUBLIC_API_URL estiver configurado para a URL do SEU BACKEND,
// entao API_URL deve ser ajustado para 'SEU_FRONTEND_URL/api'
// No ambiente de desenvolvimento Next.js, '/api' funciona por padrão.
// Se estiver em produção e o frontend e backend estiverem em domínios diferentes,
// este NEXT_PUBLIC_API_URL DEVE ser a URL base do seu FRONTEND (ex: https://seuapp.com)
// ou ser deixado vazio para que o default '/api' funcione.
// O proxy para o BACKEND deve ser feito APENAS NAS API ROUTES DO NEXT.JS (app/api/...)
const API_URL = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL || ''; // Deixe vazio para Next.js localmente, ou coloque a URL do seu frontend

export const useDashboardData = () => {
  const [data, setData] = useState({
    totalClients: 0,
    totalProducts: 0,
    totalSales: 0,
    totalAgendamentos: 0,
    upcomingBoletos: [],
    birthdays: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Estas chamadas agora irão para as Next.js API Routes (se NEXT_PUBLIC_FRONTEND_API_BASE_URL for vazio/URL do frontend)
      // Ou chamarão o backend diretamente (se NEXT_PUBLIC_API_URL estiver configurado para o backend)
      // O ideal é que estas chamem as API Routes do Next.js, que fazem o proxy para o backend.

      const clientsRes = await fetch(`${API_URL}/api/clients`); // Chamar sua API Route do Next.js
      const productsRes = await fetch(`${API_URL}/api/products`); // Chamar sua API Route do Next.js
      const salesRes = await fetch(`${API_URL}/api/sales`); // Chamar sua API Route do Next.js
      const agendamentosRes = await fetch(`${API_URL}/api/agendamento`); // Chamar sua API Route do Next.js
      const boletosRes = await fetch(`${API_URL}/api/boletos/upcoming`); // Chamar sua API Route do Next.js
      // CORREÇÃO AQUI: A rota da API do Next.js para aniversariantes é /api/clients-birthday
      const birthdaysRes = await fetch(`${API_URL}/api/clients-birthday`); 

      const [clientsData, productsData, salesData, agendamentosData, boletosData, birthdaysData] = await Promise.all([
        clientsRes.ok ? clientsRes.json() : Promise.reject(`Clients: ${clientsRes.status}`),
        productsRes.ok ? productsRes.json() : Promise.reject(`Products: ${productsRes.status}`),
        salesRes.ok ? salesRes.json() : Promise.reject(`Sales: ${salesRes.status}`),
        agendamentosRes.ok ? agendamentosRes.json() : Promise.reject(`Agendamentos: ${agendamentosRes.status}`),
        boletosRes.ok ? boletosRes.json() : Promise.reject(`Boletos: ${boletosRes.status}`),
        birthdaysRes.ok ? birthdaysRes.json() : Promise.reject(`Birthdays: ${birthdaysRes.status}`)
      ]);

      setData({
        totalClients: clientsData.length, // ou clientsData.total
        totalProducts: productsData.length, // ou productsData.total
        totalSales: salesData.length, // ou salesData.total
        totalAgendamentos: agendamentosData.length, // ou agendamentosData.total
        upcomingBoletos: boletosData,
        birthdays: birthdaysData
      });
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refreshData: fetchData };
};