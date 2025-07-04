import React, { useState, useEffect } from 'react';
import { getClients } from '../../lib/client-api';
import { getProducts } from '../../lib/product-api';
import Card from './Card';
import SearchableSelect from './ui/SearchableSelect'; // 1. Importar o novo componente
import { Plus, Trash2 } from 'lucide-react';
import styles from './styles/SaleForm.module.css';

const SaleForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    client: '', products: [], seller: '', paymentMethod: '', saleDate: new Date().toISOString().split('T')[0], notes: ''
  });
  const [allClients, setAllClients] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);

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
  }, []);

  useEffect(() => {
    const newTotal = formData.products.reduce((acc, p) => acc + ((p.price || 0) * (p.quantity || 1)), 0);
    setTotal(newTotal);
  }, [formData.products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (clientId) => {
    setFormData(prev => ({ ...prev, client: clientId }));
  };
  
  const handleProductChange = (index, field, value) => {
    let updatedProducts = [...formData.products];
    const product = updatedProducts[index];

    if (field === 'id') {
      const selectedProduct = allProducts.find(p => p._id === value);
      product.product = selectedProduct?._id || '';
      product.name = selectedProduct?.name || '';
      product.price = selectedProduct?.price || 0;
    } else {
      product[field] = value;
    }
    
    // Garante que a quantidade seja no mínimo 1
    if (product.quantity < 1) {
      product.quantity = 1;
    }
    
    updatedProducts[index] = product;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };
  
  const addProductRow = () => {
    setFormData(prev => ({
      ...prev, products: [...prev.products, { product: '', name: '', price: 0, quantity: 1 }]
    }));
  };
  
  const removeProductRow = (index) => {
    setFormData(prev => ({
      ...prev, products: prev.products.filter((_, i) => i !== index)
    }));
  };

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
                {/* 2. Substituir o <select> de cliente pelo novo componente */}
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
                <input id="seller" name="seller" type="text" value={formData.seller} onChange={handleChange} required />
              </div>
            </div>
          </Card>
          <Card>
            <h2 className={styles.cardTitle}>Itens da Venda</h2>
            <div className={styles.productRowsContainer}>
              {formData.products.map((p, index) => (
                <div key={index} className={styles.productRow}>
                  {/* 3. Substituir o <select> de produto pelo novo componente */}
                  <SearchableSelect
                    options={allProducts}
                    value={p.product}
                    onChange={(selectedId) => handleProductChange(index, 'id', selectedId)}
                    placeholder="Busque por nome ou código..."
                    displayKey="name"
                    searchKeys={['name', 'code']}
                  />
                  <input className={styles.quantityInput} type="number" min="1" value={p.quantity} onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))} required />
                  <input type="text" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price || 0)} readOnly />
                  <button type="button" onClick={() => removeProductRow(index)} className={styles.removeButton}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addProductRow} className={styles.addButton}><Plus size={16}/> Adicionar Produto</button>
          </Card>
        </div>
        <div className={styles.sidebarColumn}>
          <Card>
            <h2 className={styles.cardTitle}>Pagamento</h2>
            <div className={styles.formGroup}>
              <label htmlFor="paymentMethod">Método</label>
              <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="PIX">PIX</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
             <div className={styles.formGroup}>
              <label htmlFor="saleDate">Data da Venda</label>
              <input id="saleDate" name="saleDate" type="date" value={formData.saleDate} onChange={handleChange} required />
            </div>
            <hr className={styles.divider}/>
            <div className={styles.totalContainer}>
              <span>Total</span>
              <span className={styles.totalValue}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
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