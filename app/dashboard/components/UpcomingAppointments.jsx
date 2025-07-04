"use client";
import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { CalendarClock } from 'lucide-react';
import { getTodaysAppointments } from '../../../lib/agendamento-api';
import styles from './styles/InfoList.module.css'; // Reutilizando o mesmo estilo

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTodaysAppointments();
        setAppointments(data || []);
      } catch (error) {
        console.error("Erro ao buscar agendamentos do dia:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className={styles.infoCard}>
       <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Agendamentos de Hoje</h3>
        <CalendarClock className={styles.cardIcon} />
      </div>
       <div className={styles.listContainer}>
        {loading ? (
          <p className={styles.emptyMessage}>Carregando...</p>
        ) : appointments.length > 0 ? (
          <ul className={styles.list}>
            {appointments.map(ag => (
              <li key={ag._id} className={styles.listItem}>
                <span className={styles.itemName}>{ag.name}</span>
                <span className={styles.itemDate}>{ag.hour}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>Nenhum agendamento para hoje.</p>
        )}
      </div>
    </Card>
  );
};

export default UpcomingAppointments;