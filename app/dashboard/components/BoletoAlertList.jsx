"use client";
import Card from '../../components/Card';
import styles from './BoletoAlertList.module.css';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const formatRelativeDate = (dateString) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataVencimento = new Date(dateString);
  dataVencimento.setHours(0, 0, 0, 0);

  const diffTime = dataVencimento.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Vencido há ${Math.abs(diffDays)} dia(s)`;
  }
  if (diffDays === 0) {
    return 'Vence hoje';
  }
  return `Vence em ${diffDays} dia(s)`;
};

const BoletoAlertList = ({ title, boletos, type, loading }) => {
  const cardClass = type === 'overdue' ? styles.overdueCard : styles.dueSoonCard;

  return (
    <Card className={`${styles.alertCard} ${cardClass}`}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.listContainer}>
        {loading ? (
          <p className={styles.emptyMessage}>Carregando...</p>
        ) : boletos && boletos.length > 0 ? (
          <ul className={styles.list}>
            {boletos.map(boleto => (
              <li key={boleto._id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{boleto.client?.fullName || 'Cliente não encontrado'}</span>
                  <span className={styles.itemValue}>{formatCurrency(boleto.parcelValue)}</span>
                </div>
                <span className={styles.itemDate}>{formatRelativeDate(boleto.dueDate)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>Nenhum boleto encontrado.</p>
        )}
      </div>
    </Card>
  );
};

export default BoletoAlertList;