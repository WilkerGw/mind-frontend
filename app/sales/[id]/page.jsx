"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSaleById } from '../../../lib/sale-api';
import Card from '../../components/Card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './details.module.css';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

export default function SaleDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchSale() {
      try {
        setLoading(true);
        const data = await getSaleById(id);
        setSale(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSale();
  }, [id]);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!sale) return <div>Venda não encontrada.</div>;

  return (
    <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/sales" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Detalhes da Venda</h1>
            <p className={styles.pageSubtitle}>Venda realizada em {formatDate(sale.saleDate)}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.grid}>
        <Card>
          <h2 className={styles.cardTitle}>Informações Gerais</h2>
          <p><strong>Cliente:</strong> {sale.client.fullName}</p>
          <p><strong>Vendedor:</strong> {sale.seller}</p>
          <p><strong>Pagamento:</strong> {sale.paymentMethod}</p>
        </Card>
        
        <Card>
          <h2 className={styles.cardTitle}>Itens Comprados</h2>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Preço Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {sale.products.map(item => (
                <tr key={item.product._id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.product.price)}</td>
                  <td>{formatCurrency(item.product.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
       <div className={styles.totalFooter}>
          <span>Valor Total</span>
          <span className={styles.totalValue}>{formatCurrency(sale.total)}</span>
        </div>
    </div>
  );
}