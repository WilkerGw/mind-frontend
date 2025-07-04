import React, { useState, useEffect } from "react";
import { mask } from "remask";
import Card from "./Card";
import styles from "./styles/ClientForm.module.css";

// Converte a data de YYYY-MM-DD para o formato do input (e vice-versa se necessário)
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return "";
  }
};

const ClientForm = ({ onSubmit, initialData, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    fullName: "", cpf: "", phone: "", birthDate: "", gender: "", address: "", cep: "", notes: "",
    possuiReceita: false,
    longe: { esfericoDireito: "", cilindricoDireito: "", eixoDireito: "", esfericoEsquerdo: "", cilindricoEsquerdo: "", eixoEsquerdo: "", adicao: "" },
    perto: { esfericoDireito: "", cilindricoDireito: "", eixoDireito: "", esfericoEsquerdo: "", cilindricoEsquerdo: "", eixoEsquerdo: "", adicao: "" },
    vencimentoReceita: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        birthDate: formatDateForInput(initialData.birthDate),
        vencimentoReceita: formatDateForInput(initialData.vencimentoReceita),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (name === "cpf") finalValue = mask(value, ["999.999.999-99"]);
    else if (name === "phone") finalValue = mask(value, ["(99) 99999-9999"]);
    else if (name === "cep") finalValue = mask(value, ["99999-999"]);
    
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };
  
  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Componente interno para os campos de receita
  const ReceitaFields = ({ type, data, onChange }) => (
    <div className={styles.receitaGrid}>
      <h4 className={styles.receitaSubtitle}>{type === 'longe' ? 'Olho Direito (OD)' : 'Olho Esquerdo (OE)'}</h4>
       <div className={styles.inputGroup}>
        <label>Esférico</label>
        <input type="text" name={`${type}.esfericoDireito`} value={data.esfericoDireito} onChange={onChange} />
      </div>
       <div className={styles.inputGroup}>
        <label>Cilíndrico</label>
        <input type="text" name={`${type}.cilindricoDireito`} value={data.cilindricoDireito} onChange={onChange} />
      </div>
       <div className={styles.inputGroup}>
        <label>Eixo</label>
        <input type="text" name={`${type}.eixoDireito`} value={data.eixoDireito} onChange={onChange} />
      </div>
      <h4 className={styles.receitaSubtitle}>{type === 'longe' ? 'Olho Esquerdo (OE)' : 'Olho Esquerdo (OE)'}</h4>
       <div className={styles.inputGroup}>
        <label>Esférico</label>
        <input type="text" name={`${type}.esfericoEsquerdo`} value={data.esfericoEsquerdo} onChange={onChange} />
      </div>
       <div className={styles.inputGroup}>
        <label>Cilíndrico</label>
        <input type="text" name={`${type}.cilindricoEsquerdo`} value={data.cilindricoEsquerdo} onChange={onChange} />
      </div>
       <div className={styles.inputGroup}>
        <label>Eixo</label>
        <input type="text" name={`${type}.eixoEsquerdo`} value={data.eixoEsquerdo} onChange={onChange} />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Card>
        <h2 className={styles.cardTitle}>Dados Pessoais</h2>
        <div className={styles.grid}>
          <div className={styles.gridSpan2}>
            <label>Nome Completo</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div>
            <label>CPF</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </div>
          <div>
            <label>Telefone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label>Data de Nascimento</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          </div>
          <div>
            <label>Gênero</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className={styles.cardTitle}>Endereço e Observações</h2>
         <div className={styles.grid}>
           <div>
              <label>CEP</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
            </div>
            <div className={styles.gridSpan2}>
              <label>Endereço</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className={styles.gridSpan3}>
              <label>Observações</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
            </div>
        </div>
      </Card>
      
      <Card>
         <div className={styles.checkboxContainer}>
            <input type="checkbox" id="possuiReceita" name="possuiReceita" checked={formData.possuiReceita} onChange={handleChange} />
            <label htmlFor="possuiReceita">Possui Receita Oftalmológica?</label>
        </div>

        {formData.possuiReceita && (
          <div className={styles.receitaContainer}>
            <h3 className={styles.sectionTitle}>Longe</h3>
            <ReceitaFields type="longe" data={formData.longe} onChange={handleNestedChange} />
             <div className={styles.inputGroup}>
                <label>Adição</label>
                <input type="text" name="longe.adicao" value={formData.longe.adicao} onChange={handleNestedChange} />
             </div>

            <h3 className={styles.sectionTitle}>Perto</h3>
            <ReceitaFields type="perto" data={formData.perto} onChange={handleNestedChange} />
             <div className={styles.inputGroup}>
                <label>Adição</label>
                <input type="text" name="perto.adicao" value={formData.perto.adicao} onChange={handleNestedChange} />
             </div>

            <div>
              <label>Vencimento da Receita</label>
              <input type="date" name="vencimentoReceita" value={formData.vencimentoReceita} onChange={handleChange} />
            </div>
          </div>
        )}
      </Card>
      
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;