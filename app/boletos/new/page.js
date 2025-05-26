'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../components/styles/Form.module.css';

export default function NewBoleto() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    parcelValue: 0,
    dueDate: new Date().toISOString().split('T')[0], // Data atual
    status: 'em aberto', // Status padrão
    description: '' // Campo opcional
  });

  useEffect(() => {
    // Carregar clientes
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação de campos obrigatórios
    if (!formData.client || !formData.dueDate || formData.parcelValue <= 0) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    try {
      const response = await fetch('/api/boletos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push('/boletos');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar o boleto');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <section>
      <div className={styles.formContainer}>
        <h1>Cadastrar Boleto</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campo Cliente */}
          <label>
            Cliente:
            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.fullName}
                </option>
              ))}
            </select>
          </label>
          {/* Campo Valor da Parcela */}
          <label>
            Valor da Parcela:
            <input
              type="number"
              step="0.01"
              name="parcelValue"
              value={formData.parcelValue}
              onChange={handleChange}
              required
            />
          </label>
          {/* Campo Data de Vencimento */}
          <label>
            Data de Vencimento:
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </label>
          {/* Campo Status */}
          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="em aberto">Em Aberto</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </label>
          {/* Campo Descrição (opcional) */}
          <label>
            Descrição:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </section>
  );
}