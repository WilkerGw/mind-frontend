"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const Clock = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Cria um intervalo que atualiza o estado a cada segundo
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Função de limpeza: remove o intervalo quando o componente "morre"
    // Isso é muito importante para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez (na montagem)

  return (
    <div className={styles.dateContainer}>
      <p className={styles.dateText}>
        {/* Formata a data e hora para o padrão brasileiro */}
        {currentDateTime.toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        {' | '}
        {currentDateTime.toLocaleTimeString('pt-BR')}
      </p>
    </div>
  );
};

export default Clock;