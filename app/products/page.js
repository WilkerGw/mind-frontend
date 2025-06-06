'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Lista de Produtos</h1>
            <Link href="/products/new">
              <button className={styles.btnNovo}>Novo Produto</button>
            </Link>
          </div>
          <ul className={styles.lista}>
            {products.map((product) => (
              <li key={product._id} className={styles.titleLista}>
                <div class={styles.dataContainer}><p class={styles.pName}>{product.name}</p><p class={styles.pCode}>{product.code}</p></div>
                <Link href={`/products/${product._id}`}>
                  <button className={styles.btnNovo}>Detalhes</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProtectedRoute>
  );
}