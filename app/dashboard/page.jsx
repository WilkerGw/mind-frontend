"use client";
import { DollarSign, Wallet } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import styles from './page.module.css';
import StatCard from './components/StatCard';
import SalesChart from './components/SalesChart';
import BirthdayList from './components/BirthdayList';
import BoletoAlertList from './components/BoletoAlertList';
import UpcomingAppointments from './components/UpcomingAppointments';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function Dashboard() {
  const { 
    dailyTotal, 
    monthlyTotal, 
    birthdayClients,
    overdueBoletos,
    dueSoonBoletos,
    todaysAppointments,
    salesHistory,
    loading, 
    error 
  } = useDashboardData();

  if (loading) return <div className={styles.statusMessage}>Carregando Dashboard...</div>;
  if (error) return <div className={`${styles.statusMessage} ${styles.error}`}>{error}</div>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      
      <div className={styles.dashboardGrid}>
        <StatCard 
          title="Vendas de Hoje"
          value={formatCurrency(dailyTotal)}
          icon={DollarSign}
          description="Total vendido na data de hoje."
        />
          <StatCard 
          title="Vendas do Mês"
          value={formatCurrency(monthlyTotal)}
          icon={Wallet}
          description="Total vendido no mês corrente."
        />
        
        <div className={styles.gridSpan2}>
            <BoletoAlertList
              title="Boletos Vencidos"
              boletos={overdueBoletos}
              type="overdue"
              loading={loading}
            />
        </div>
        <div className={styles.gridSpan2}>
          <BoletoAlertList
              title="Vencem nos Próximos 7 Dias"
              boletos={dueSoonBoletos}
              type="due-soon"
              loading={loading}
            />
        </div>

        <div className={styles.gridSpan4}>
          <SalesChart data={salesHistory} />
        </div>
        
        <div className={styles.gridSpan2}>
            <UpcomingAppointments appointments={todaysAppointments} loading={loading} />
        </div>
        <div className={styles.gridSpan2}>
            <BirthdayList clients={birthdayClients} />
        </div>
      </div>
    </div>
  );
}