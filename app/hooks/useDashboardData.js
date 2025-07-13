import { useState, useEffect, useCallback } from 'react'; 
const API_URL = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL || ''; 

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

      const clientsRes = await fetch(`${API_URL}/api/clients`); 
      const productsRes = await fetch(`${API_URL}/api/products`); 
      const salesRes = await fetch(`${API_URL}/api/sales`); 
      const agendamentosRes = await fetch(`${API_URL}/api/agendamento`); 
      const boletosRes = await fetch(`${API_URL}/api/boletos/upcoming`); 
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
        totalClients: clientsData.length, 
        totalProducts: productsData.length, 
        totalSales: salesData.length, 
        totalAgendamentos: agendamentosData.length, 
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