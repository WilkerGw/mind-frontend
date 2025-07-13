"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const Clock = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);


    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div className={styles.dateContainer}>
      <p className={styles.dateText}>

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