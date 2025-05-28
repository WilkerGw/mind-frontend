"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import styles from "../Styles/Dashboard.module.css";

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [birthdayClients, setBirthdayClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalRes = await axios.get("/api/sales/total");
        const dailyRes = await axios.get("/api/sales/daily");
        const monthlyRes = await axios.get("/api/sales/monthly");
        const birthdayRes = await axios.get("/api/clients-birthday");

        setTotalSales(totalRes.data.total || 0);
        setDailyTotal(dailyRes.data.dailyTotal || 0);
        setMonthlyTotal(monthlyRes.data.monthlyTotal || 0);
        setBirthdayClients(birthdayRes.data || []);

        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  let dailySalesClass;
  if (dailyTotal < 2500) {
    dailySalesClass = styles.red;
  } else if (dailyTotal >= 2500 && dailyTotal <= 5000) {
    dailySalesClass = styles.orange;
  } else {
    dailySalesClass = styles.green;
  }

  const formattedDateTime = currentDateTime.toLocaleString();

  // Função auxiliar para parsear a data corretamente
  const parseBirthDate = (dateString) => {
    if (!dateString) return null;

    let dateObj;

    if (dateString instanceof Date && !isNaN(dateString)) {
      dateObj = dateString;
    } else if (typeof dateString === "string") {
      const parts = dateString.split(/[-/]/);
      if (parts.length >= 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // meses começam em 0
        const day = parseInt(parts[2], 10);
        dateObj = new Date(year, month, day);
      }
    }

    return isNaN(dateObj?.getTime()) ? null : dateObj;
  };

  // Ordena os aniversários na ordem cronológica (do mais próximo para o mais distante)
  const sortedBirthdays = [...birthdayClients].sort((a, b) => {
    const dateA = parseBirthDate(a.birthDate);
    const dateB = parseBirthDate(b.birthDate);

    if (!dateA || !dateB) return 0;

    const today = new Date();
    const birthAThisYear = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
    const birthBThisYear = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());

    return birthAThisYear - birthBThisYear;
  });

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.statsContainer}>
            <div className={styles.dateContainer}>
              <p className={styles.dateText}>{formattedDateTime}</p>
            </div>

            <div className={styles.totalPanel}>
              <div className={styles.iconeContainer}>
                <img
                  src="./images/dia-icon.png"
                  alt=""
                  className={styles.dashIcon}
                />
                <h2 className={styles.totalTitle}>Total Diário</h2>
              </div>
              <div className={styles.totalValue}>
                <p className={`${styles.ptotalValue} ${dailySalesClass}`}>
                  R$ {dailyTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className={styles.totalPanel}>
              <div className={styles.iconeContainer}>
                <img
                  src="./images/mes-icon.png"
                  alt=""
                  className={styles.dashIcon}
                />
                <h2 className={styles.totalTitle}>Total Mensal</h2>
              </div>
              <div className={styles.totalValue}>
                <p className={styles.ptotalValue}>
                  R$ {monthlyTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.birthdayPanel}>
            <div className={styles.iconeContainer}>
              <img
                src="./images/bolo-icon.png"
                alt="ícone de bolo"
                className={styles.dashIcon}
              />
              <h2 className={styles.totalTitle}>Aniversariantes do Mês</h2>
            </div>
            <ul className={styles.birthdayList}>
              {sortedBirthdays.length > 0 ? (
                sortedBirthdays.map((client) => {
                  const birthDate = parseBirthDate(client.birthDate);

                  if (!birthDate) {
                    return (
                      <li key={client._id} className={styles.birthdayItem}>
                        {client.fullName} -{" "}
                        <span className={styles.birthdayError}>Data inválida</span>
                      </li>
                    );
                  }

                  const today = new Date();
                  const birthThisYear = new Date(
                    today.getFullYear(),
                    birthDate.getMonth(),
                    birthDate.getDate()
                  );

                  const isToday =
                    birthThisYear.getDate() === today.getDate() &&
                    birthThisYear.getMonth() === today.getMonth();

                  const hasBirthdayPassed = birthThisYear < today;

                  return (
                    <li key={client._id} className={styles.birthdayItem}>
                      {client.fullName} {" "}
                      <span
                        className={
                          isToday
                            ? styles.birthdayToday
                            : hasBirthdayPassed
                            ? styles.birthdayPassed
                            : styles.birthdayUpcoming
                        }
                      >
                        {birthThisYear.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className={styles.birthdayItem}>Nenhum aniversariante este mês</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}