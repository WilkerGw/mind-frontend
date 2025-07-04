import React, { useState, useEffect } from 'react';
import Card from './Card';
import styles from './styles/ProductForm.module.css';

const ProductForm = ({ onSubmit, initialData, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    code: '', name: '', price: '', costPrice: '',
    type: '', design: '', material: '', stock: ''
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

  const productTypes = ['Óculos de Sol', 'Aramação de Grau', 'Lente', 'Serviço/Conserto'];
  const designTypes = ['Quadrado', 'Redondo', 'Hexagonal', 'Gatinho', 'Ballgriff'];
  const materialTypes = ['Acetato', 'TR-90', 'Metal', 'TR-90+METAL', 'ACETATO+METAL'];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="code">Código</label>
            <input id="code" name="code" type="text" value={formData.code} onChange={handleChange} required />
          </div>
          <div className={`${styles.formGroup} ${styles.gridSpan2}`}>
            <label htmlFor="name">Nome do Produto</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Preço de Venda (R$)</label>
            <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="costPrice">Preço de Custo (R$)</label>
            <input id="costPrice" name="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stock">Estoque</label>
            <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {productTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="design">Design</label>
            <select id="design" name="design" value={formData.design} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {designTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="material">Material</label>
            <select id="material" name="material" value={formData.material} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {materialTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </Card>
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;