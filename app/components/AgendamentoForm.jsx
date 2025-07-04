import React, { useState, useEffect } from 'react';
import Card from './Card';
import styles from './styles/AgendamentoForm.module.css';

const AgendamentoForm = ({ onSubmit, initialData, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '', telephone: '', date: '', hour: '', observation: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome Completo</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="telephone">Telefone / WhatsApp</label>
            <input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date">Data</label>
            <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="hour">Hora</label>
            <input id="hour" name="hour" type="time" value={formData.hour} onChange={handleChange} required />
          </div>
          <div className={`${styles.formGroup} ${styles.gridSpan2}`}>
            <label htmlFor="observation">Observação</label>
            <textarea id="observation" name="observation" value={formData.observation} onChange={handleChange} rows="3" />
          </div>
        </div>
      </Card>
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Agendamento'}
        </button>
      </div>
    </form>
  );
};

export default AgendamentoForm;