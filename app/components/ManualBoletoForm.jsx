import React, { useState, useEffect } from 'react';
import { getClients } from '../../lib/client-api';
import Card from './Card';
import SearchableSelect from './ui/SearchableSelect';
// CAMINHO CORRIGIDO: reutilizando o estilo do formulário de parcelamento para manter a consistência.
import styles from './styles/InstallmentForm.module.css'; 

const ManualBoletoForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    client: '',
    parcelValue: '',
    dueDate: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [allClients, setAllClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const clientsData = await getClients();
      setAllClients(clientsData || []);
    }
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleClientChange = (clientId) => {
    setFormData(prev => ({ ...prev, client: clientId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {/* A classe 'formGrid' agora virá do InstallmentForm.module.css */}
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.gridSpan3}`}>
            <label htmlFor="client-manual">Cliente</label>
            <SearchableSelect
              options={allClients}
              value={formData.client}
              onChange={handleClientChange}
              placeholder="Busque por nome ou CPF..."
              displayKey="fullName"
              searchKeys={['fullName', 'cpf']}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="parcelValue-manual">Valor do Boleto (R$)</label>
            <input id="parcelValue-manual" name="parcelValue" type="number" step="0.01" value={formData.parcelValue} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate-manual">Data de Vencimento</label>
            <input id="dueDate-manual" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description-manual">Descrição (Opcional)</label>
            <input id="description-manual" name="description" type="text" value={formData.description} onChange={handleChange} placeholder="Ex: Referente à armação XYZ"/>
          </div>
        </div>
      </Card>
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Boleto Avulso'}
        </button>
      </div>
    </form>
  );
};

export default ManualBoletoForm;