'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '../../../lib/product-api';
import ProductForm from '../../components/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from '../products.module.css';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createProduct(data);
      router.refresh();
      router.push('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/products" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.pageTitle}>Novo Produto</h1>
        </div>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error}</p>}
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}