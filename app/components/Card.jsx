// app/components/Card.jsx
import styles from './Styles/Card.module.css'; // CORRIGIDO: de './styles/' para './Styles/'

export default function Card({ children, className }) {
  // Combina classes passadas como prop com as classes do módulo
  const combinedClassName = `${styles.card} ${className || ''}`;
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}