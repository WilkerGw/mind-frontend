'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, updateProduct } from '../../../lib/product-api';
import ProductForm from '../../components/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from '../products.module.css';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setInitialData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateProduct(id, data);
      router.push('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <div className={styles.statusCell}>Carregando produto...</div>;
  if (error) return <div className={styles.statusCellError}>Erro: {error}</div>;

  return (
     <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/products" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.pageTitle}>Editar Produto</h1>
        </div>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro ao salvar: {error}</p>}
      <ProductForm 
        onSubmit={handleSubmit} 
        initialData={initialData}
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}