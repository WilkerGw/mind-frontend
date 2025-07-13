import { useState, useEffect, useCallback } from 'react';
import { getSalesHistory, getDailySales, getMonthlySales } from '../../lib/sale-api';
import { getMonthlyBirthdays } from '../../lib/client-api';
import { getOverdueBoletos, getDueSoonBoletos } from '../../lib/boleto-api';
import { getTodaysAppointments } from '../../lib/agendamento-api';

export const useDashboardData = () => {
  const [data, setData] = useState({
    dailyTotal: 0,
    monthlyTotal: 0,
    birthdayClients: [],
    overdueBoletos: [],
    dueSoonBoletos: [],
    todaysAppointments: [],
    salesHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        dailySalesResponse,
        monthlySalesResponse,
        salesHistoryResponse,
        birthdaysResponse,
        overdueResponse,
        dueSoonResponse,
        todaysAppointmentsResponse,
      ] = await Promise.all([
        getDailySales(),
        getMonthlySales(),
        getSalesHistory(),
        getMonthlyBirthdays(),
        getOverdueBoletos(),
        getDueSoonBoletos(),
        getTodaysAppointments(),
      ]);

      const dailyTotal = dailySalesResponse?.dailyTotal || 0;
      const monthlyTotal = monthlySalesResponse?.monthlyTotal || 0;

      let salesArray = Array.isArray(salesHistoryResponse)
        ? salesHistoryResponse
        : salesHistoryResponse?.sales || salesHistoryResponse?.history || [];

      if (!Array.isArray(salesArray)) {
        console.error("Dados inesperados da API de histórico de vendas:", salesHistoryResponse);
        salesArray = [];
      }
      
      const formattedHistory = salesArray.map(item => ({
        name: new Date(item.day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        Total: item.sales,
      }));

      let todaysAppointmentsArray = Array.isArray(todaysAppointmentsResponse)
        ? todaysAppointmentsResponse
        : todaysAppointmentsResponse?.appointments || [];

      if (!Array.isArray(todaysAppointmentsArray)) {
        console.error("Dados inesperados da API de agendamentos de hoje:", todaysAppointmentsResponse);
        todaysAppointmentsArray = [];
      }

      setData({
        dailyTotal,
        monthlyTotal,
        birthdayClients: birthdaysResponse || [], 
        overdueBoletos: overdueResponse || [],
        dueSoonBoletos: dueSoonResponse || [],
        todaysAppointments: todaysAppointmentsArray,
        salesHistory: formattedHistory,
      });

    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError(err.message || "Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, error, refreshData: fetchData };
};