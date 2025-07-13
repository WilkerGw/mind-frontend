"use client";
import Card from '../../components/Card';
import { CalendarClock } from 'lucide-react';
import styles from './InfoList.module.css'; 

const UpcomingAppointments = ({ appointments, loading }) => {
  return (
    <Card className={styles.infoCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Agendamentos de Hoje</h3>
        <CalendarClock className={styles.cardIcon} />
      </div>
      <div className={styles.listContainer}>
        {loading ? (
          <p className={styles.emptyMessage}>Carregando...</p>
        ) : appointments && appointments.length > 0 ? (
          <ul className={styles.list}>
            {appointments.map((ag, index) => (
              <li key={ag._id || ag.id || index} className={styles.listItem}>
                <span className={styles.itemName}>{ag.client?.fullName || ag.name || 'Nome Indisponível'}</span>
                <span className={styles.itemDate}>{ag.hour || 'Hora Indisponível'}</span>
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