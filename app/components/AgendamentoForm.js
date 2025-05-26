import React, { useState, useCallback } from 'react';
import styles from '../components/styles/Form.module.css';

const AgendamentoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
    date: '',
    hour: '',
    observation: ''
  });

  const formatTelephone = useCallback((tel) => {
    const cleaned = ('' + tel).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + ' ' + match[3] + '-' + match[4];
    }
    return tel;
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'telephone') {
      setFormData({
        ...formData,
        [name]: formatTelephone(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nome Completo
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Telefone/WhatsApp
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Data
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Hora
          <input
            type="time"
            name="hour"
            value={formData.hour}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Observação
          <input
            type="text"
            name="observation"
            value={formData.observation}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};

export default AgendamentoForm;