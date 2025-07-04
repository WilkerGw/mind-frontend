import React, { useState, useEffect } from 'react';
import { getClients } from '../../lib/client-api';
import Card from './Card';
import SearchableSelect from './ui/SearchableSelect';
// A LINHA MAIS IMPORTANTE: Garanta que esta linha exista!
// Ela conecta o seu componente ao arquivo de estilos dele.
import styles from './styles/InstallmentForm.module.css';

const InstallmentForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    client: '',
    valorTotal: '',
    valorEntrada: '',
    numeroParcelas: '1',
    dataPrimeiroVencimento: new Date().toISOString().split('T')[0],
  });
  const [allClients, setAllClients] = useState([]);
  const [installmentsPreview, setInstallmentsPreview] = useState([]);
  const [valorCalculadoParcela, setValorCalculadoParcela] = useState(0);

  useEffect(() => {
    async function fetchClients() {
      const clientsData = await getClients();
      setAllClients(clientsData || []);
    }
    fetchClients();
  }, []);

  useEffect(() => {
    const { valorTotal, valorEntrada, numeroParcelas, dataPrimeiroVencimento } = formData;
    
    const total = parseFloat(valorTotal) || 0;
    const entrada = parseFloat(valorEntrada) || 0;
    const parcelas = parseInt(numeroParcelas, 10);
    
    if (total > 0 && total >= entrada && parcelas > 0 && dataPrimeiroVencimento) {
      const valorRestante = total - entrada;
      const valorParcela = valorRestante / parcelas;
      setValorCalculadoParcela(valorParcela);
      
      const newPreview = Array.from({ length: parcelas }, (_, i) => {
        const dataVencimento = new Date(dataPrimeiroVencimento);
        dataVencimento.setUTCHours(12,0,0,0);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);
        
        return {
          numero: i + 1,
          valor: valorParcela,
          vencimento: dataVencimento.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        };
      });
      setInstallmentsPreview(newPreview);
    } else {
      setInstallmentsPreview([]);
      setValorCalculadoParcela(0);
    }
  }, [formData]);

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
      <div className={styles.grid}>
        <div className={styles.mainColumn}>
            <Card>
                <h2 className={styles.cardTitle}>Dados da Venda e Cliente</h2>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="client">Cliente</label>
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
                        <label htmlFor="valorTotal">Valor Total da Venda (R$)</label>
                        <input id="valorTotal" name="valorTotal" type="number" step="0.01" value={formData.valorTotal} onChange={handleChange} required />
                    </div>
                     <div className={styles.formGroup}>
                        <label htmlFor="valorEntrada">Valor da Entrada (R$)</label>
                        <input id="valorEntrada" name="valorEntrada" type="number" step="0.01" value={formData.valorEntrada} onChange={handleChange} />
                    </div>
                </div>
            </Card>
             <Card>
                <h2 className={styles.cardTitle}>Configuração do Parcelamento</h2>
                 <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="numeroParcelas">Nº de Parcelas</label>
                        <input id="numeroParcelas" name="numeroParcelas" type="number" min="1" value={formData.numeroParcelas} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="dataPrimeiroVencimento">Data do 1º Vencimento</label>
                        <input id="dataPrimeiroVencimento" name="dataPrimeiroVencimento" type="date" value={formData.dataPrimeiroVencimento} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Valor por Parcela (Calculado)</label>
                        <input type="text" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorCalculadoParcela)} readOnly className={styles.readOnlyInput} />
                    </div>
                </div>
            </Card>
        </div>
        <div className={styles.sidebarColumn}>
          <Card>
            <h2 className={styles.cardTitle}>Prévia das Parcelas</h2>
            {installmentsPreview.length > 0 ? (
              <ul className={styles.previewList}>
                {installmentsPreview.map(p => (
                  <li key={p.numero} className={styles.previewItem}>
                    <span>Parcela {p.numero}</span>
                    <span className={styles.previewValue}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}</span>
                    <span className={styles.previewDate}>Vence em: {p.vencimento}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noPreview}>Preencha os dados para ver a prévia.</p>
            )}
          </Card>
        </div>
      </div>
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting || installmentsPreview.length === 0}>
          {isSubmitting ? 'Gerando...' : 'Gerar Boletos'}
        </button>
      </div>
    </form>
  );
};

export default InstallmentForm;