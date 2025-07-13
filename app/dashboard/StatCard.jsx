import Image from "next/image";
import styles from "./page.module.css";

const StatCard = ({ title, value, iconSrc, colorClass }) => {
  return (
    <div className={styles.totalPanel}>
      <div className={styles.panelInfo}>
        <Image src={iconSrc} alt={`${title} icon`} width={30} height={30} className={styles.dashIcon} />
        <h2 className={styles.totalTitle}>{title}</h2>
      </div>
      <div className={styles.totalValue}>
        <p className={`${styles.ptotalValue} ${styles[colorClass] || ''}`}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </p>
      </div>
    </div>
  );
};

export default StatCard;