// frontend\app\components\SaleForm.jsx
"use client"; // Necessário para componentes que usam hooks como useState e useEffect no Next.js App Router

import React, { useState, useEffect } from 'react';
import { getClients } from '../../lib/client-api';
import { getProducts } from '../../lib/product-api';
import Card from './Card';
import SearchableSelect from './ui/SearchableSelect';
import { Plus, Trash2 } from 'lucide-react';
import styles from './SaleForm.module.css';

const SaleForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    client: '',
    products: [],
    seller: '',
    paymentMethod: '',
    saleDate: new Date().toISOString().split('T')[0], // Define a data atual como padrão
    notes: ''
  });
  const [allClients, setAllClients] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);

  // Hook para buscar dados iniciais de clientes e produtos
  useEffect(() => {
    async function fetchData() {
      try {
        const clientsData = await getClients();
        const productsData = await getProducts();
        setAllClients(clientsData || []);
        setAllProducts(productsData || []);
      } catch (error) {
        console.error("Erro ao buscar dados para o formulário:", error);
      }
    }
    fetchData();
  }, []); // Executa apenas uma vez ao montar o componente

  // Hook para recalcular o total da venda sempre que os produtos mudam
  useEffect(() => {
    const newTotal = formData.products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.quantity) || 1)), 0);
    setTotal(newTotal);
  }, [formData.products]); // Depende de formData.products

  // Lida com mudanças em campos de texto e seleção simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lida com a mudança do cliente selecionado no SearchableSelect
  const handleClientChange = (clientId) => {
    setFormData(prev => ({ ...prev, client: clientId }));
  };

  // Lida com a mudança de campos para produtos individuais (ID, quantidade, preço)
  const handleProductChange = (index, field, value) => {
    let updatedProducts = [...formData.products];
    const product = updatedProducts[index];

    if (field === 'id') {
      // Se o ID do produto muda, busca os dados do produto selecionado
      const selectedProduct = allProducts.find(p => p._id === value);
      product.product = selectedProduct?._id || '';
      product.name = selectedProduct?.name || '';
      product.price = selectedProduct?.price || 0; // Define o preço padrão do produto
    } else if (field === 'price') {
      // Converte o valor do preço para float
      product.price = parseFloat(value) || 0;
    } else {
      product[field] = value;
    }

    // Garante que a quantidade não seja menor que 1
    if (product.quantity < 1) {
      product.quantity = 1;
    }

    updatedProducts[index] = product;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  // Adiciona uma nova linha de produto ao formulário
  const addProductRow = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { product: '', name: '', price: 0, quantity: 1 }]
    }));
  };

  // Remove uma linha de produto do formulário
  const removeProductRow = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Lida com o envio final do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, total };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <Card>
            <h2 className={styles.cardTitle}>Cliente e Vendedor</h2>
            <div className={styles.inlineGrid}>
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
                <label htmlFor="seller">Vendedor(a)</label>
                <input
                  id="seller"
                  name="seller"
                  type="text"
                  value={formData.seller}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className={styles.cardTitle}>Itens da Venda</h2>
            <div className={styles.productRowsContainer}>
              {formData.products.map((p, index) => (
                <div key={index} className={styles.productRow}>
                  <SearchableSelect
                    options={allProducts}
                    value={p.product}
                    onChange={(selectedId) => handleProductChange(index, 'id', selectedId)}
                    placeholder="Busque por nome ou código..."
                    displayKey="name"
                    searchKeys={['name', 'code']}
                  />
                  <input
                    className={styles.quantityInput}
                    type="number"
                    min="1"
                    value={p.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                    required
                  />
                  {/* Campo de preço agora é editável */}
                  <input
                    type="number"
                    value={p.price || 0}
                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    step="0.01" // Permite valores decimais (centavos)
                    min="0" // Garante que o preço não seja negativo
                    className={styles.priceInput} // Nova classe para estilização específica do preço
                  />
                  <button type="button" onClick={() => removeProductRow(index)} className={styles.removeButton}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addProductRow} className={styles.addButton}>
              <Plus size={16} /> Adicionar Produto
            </button>
          </Card>
        </div>

        <div className={styles.sidebarColumn}>
          <Card>
            <h2 className={styles.cardTitle}>Pagamento</h2>
            <div className={styles.formGroup}>
              <label htmlFor="paymentMethod">Método</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="PIX">PIX</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="saleDate">Data da Venda</label>
              <input
                id="saleDate"
                name="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={handleChange}
                required
              />
            </div>
            <hr className={styles.divider} />
            <div className={styles.totalContainer}>
              <span>Total</span>
              <span className={styles.totalValue}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </span>
            </div>
          </Card>
        </div>
      </div>
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Finalizar Venda'}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;