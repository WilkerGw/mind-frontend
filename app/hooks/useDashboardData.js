// app/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; // Será '/api'

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
      // Estas chamadas agora irão para as Next.js API Routes
      const clientsRes = await fetch(`${API_URL}/api/clients`);
      const productsRes = await fetch(`${API_URL}/api/products`);
      const salesRes = await fetch(`${API_URL}/api/sales`);
      const agendamentosRes = await fetch(`${API_URL}/api/agendamento`); // Ajuste se for outro endpoint no backend
      const boletosRes = await fetch(`${API_URL}/api/boletos/upcoming`); // Exemplo de endpoint específico
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