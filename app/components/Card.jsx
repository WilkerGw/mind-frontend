import styles from './styles/Card.module.css';

export default function Card({ children, className }) {
  // Combina classes passadas como prop com as classes do módulo
  const combinedClassName = `${styles.card} ${className || ''}`;
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}