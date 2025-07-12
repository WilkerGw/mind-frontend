import Card from '../../components/Card';
import { Gift } from 'lucide-react';
import styles from './InfoList.module.css'; // Usaremos um estilo compartilhado

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
};

const BirthdayList = ({ clients }) => {
  return (
    <Card className={styles.infoCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Aniversariantes do Mês</h3>
        <Gift className={styles.cardIcon} />
      </div>
      <div className={styles.listContainer}>
        {clients && clients.length > 0 ? (
          <ul className={styles.list}>
            {clients.map(client => (
              <li key={client._id} className={styles.listItem}>
                <span className={styles.itemName}>{client.fullName}</span>
                <span className={styles.itemDate}>{formatDate(client.birthDate)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>Nenhum aniversariante este mês.</p>
        )}
      </div>
    </Card>
  );
};

export default BirthdayList;