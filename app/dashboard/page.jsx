"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import styles from "../Styles/Dashboard.module.css";

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Total geral
        const totalResponse = await axios.get("/api/sales/total");
        setTotalSales(totalResponse.data.total);
        // Total diário
        const dailyResponse = await axios.get("/api/sales/daily");
        setDailyTotal(dailyResponse.data.dailyTotal);
        // Total mensal
        const monthlyResponse = await axios.get("/api/sales/monthly");
        setMonthlyTotal(monthlyResponse.data.monthlyTotal);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
        setLoading(false);
      }
    };
    fetchData();

    // Atualiza a data e hora a cada segundo
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  let dailySalesClass;
  if (dailyTotal < 2500) {
    dailySalesClass = styles.red;
  } else if (dailyTotal >= 2500 && dailyTotal <= 5000) {
    dailySalesClass = styles.orange;
  } else if (dailyTotal > 5000) {
    dailySalesClass = styles.green;
  } else {
    dailySalesClass = styles.default; // caso contrário, mantém o padrão
  }

  const formattedDateTime = currentDateTime.toLocaleString();

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.statsContainer}>
            <div className={styles.dateContainer}>
              <p className={styles.dateText}>{formattedDateTime}</p>
            </div>
            <div className={styles.totalPanel}>
              <h2 className={styles.totalTitle}>Total Diário</h2>
              <div className={styles.totalValue}>
                <p className={`${styles.ptotalValue} ${dailySalesClass}`}>
                  R$ {dailyTotal.toFixed(2)}
                </p>
              </div>
            </div>
            <div className={styles.totalPanel}>
              <h2 className={styles.totalTitle}>Total Mensal</h2>
              <div className={styles.totalValue}>
                <p className={styles.ptotalValue}>R$ {monthlyTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}