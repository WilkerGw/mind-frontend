import styles from './Card.module.css';

export default function Card({ children, className }) {
  const combinedClassName = `${styles.card} ${className || ''}`;
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}