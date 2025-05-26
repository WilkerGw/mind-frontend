'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../Styles/Dashboard.module.css';

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // garante que id seja acessado com segurança

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setLoading(false);
      setError('ID do produto inválido');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar produto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setError(error.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <section>
      <div className={styles.detalhesContainer}>
        <h1 className={styles.titleLista}>{product?.name || 'Produto'}</h1>
        {product && (
          <div>
            <p><strong>Código:</strong> {product.code || 'N/A'}</p>
            <p><strong>Tipo:</strong> {product.type || 'N/A'}</p>
            <p><strong>Design:</strong> {product.design || 'N/A'}</p>
            <p><strong>Material:</strong> {product.material || 'N/A'}</p>
            <p><strong>Estoque:</strong> {product.stock ?? 'N/A'}</p>
            <p><strong>Preço:</strong> R$ {product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}</p>
            <p><strong>Preço de Custo:</strong> R$ {product.costPrice ? parseFloat(product.costPrice).toFixed(2) : 'N/A'}</p>
            <p><strong>Data de Criação:</strong> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Não disponível'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
