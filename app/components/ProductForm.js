import React, { useState, useCallback } from 'react';
import styles from '../components/Styles/FormAgendamento.module.css';

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    costPrice: '',
    type: '',
    design: '',
    material: '',
    stock: ''
  });

  const formatProductCode = useCallback((code) => {
    const cleanedCode = code.replace(/-/g, ''); // Remove hífens existentes
    if (cleanedCode.length > 2) {
      const prefix = cleanedCode.slice(0, -2);
      const suffix = cleanedCode.slice(-2);
      return `${prefix}-${suffix}`;
    }
    return cleanedCode;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'code') {
      setFormData({
        ...formData,
        [name]: formatProductCode(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
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
          Código do Produto
          <input
            type="text"
            name="code"
            placeholder=""
            value={formData.code}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nome Completo
          <input
            type="text"
            name="name"
            placeholder=""
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Preço do Produto
          <input
            type="number"
            name="price"
            placeholder="Preço"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Preço de Custo
          <input
            type="number"
            name="costPrice"
            placeholder="Preço de Custo"
            value={formData.costPrice}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tipo
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um tipo</option>
            <option value="Óculos de Sol">Óculos de Sol</option>
            <option value="Aramação de Grau">Aramação de Grau</option>
            <option value="Lente">Lente</option>
            <option value="Serviço/Conserto">Serviço/Conserto</option>
          </select>
        </label>
        <label>
          Design
          <select
            name="design"
            value={formData.design}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um design</option>
            <option value="Quadrado">Quadrado</option>
            <option value="Redondo">Redondo</option>
            <option value="Hexagonal">Hexagonal</option>
            <option value="Gatinho">Gatinho</option>
            <option value="Ballgriff">Ballgriff</option>
          </select>
        </label>
        <label>
          Material
          <select
            name="material"
            value={formData.material}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um material</option>
            <option value="Acetato">Acetato</option>
            <option value="TR-90">TR-90</option>
            <option value="Metal">Metal</option>
            <option value="TR-90+METAL">TR-90+METAL</option>
            <option value="ACETATO+METAL">ACETATO+METAL</option>
          </select>
        </label>
        <label>
          Quantidade em Estoque
          <input
            type="number"
            name="stock"
            placeholder=""
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};

export default ProductForm;