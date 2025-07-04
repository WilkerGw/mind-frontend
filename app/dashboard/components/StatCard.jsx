import Card from "../../components/Card";
import styles from '../page.module.css';

const StatCard = ({ title, value, icon, description }) => {
  const Icon = icon; // Permite usar o componente do ícone passado como prop
  return (
    <Card>
      <div className={styles.statCardHeader}>
        <h3 className={styles.statCardTitle}>{title}</h3>
        <Icon className={styles.statCardIcon} />
      </div>
      <div className={styles.statCardContent}>
        <p className={styles.statCardValue}>{value}</p>
        {description && <p className={styles.statCardDescription}>{description}</p>}
      </div>
    </Card>
  );
};

export default StatCard;