'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../Styles/Dashboard.module.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Promotions() {
  const [promotions, setPromotions] = useState([]); // Inicializa como array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (!response.ok) {
          throw new Error('Erro ao buscar promoções');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setPromotions(data);
        } else {
          throw new Error('Resposta inválida');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Lista de Promoções</h1>
            <Link href="/promotions/new">
              <button>Nova Promoção</button>
            </Link>
          </div>
          <ul className={styles.lista}>
            {promotions.map((promotion) => (
              <li key={promotion._id} className={styles.titleLista}>
                {promotion.name} - {promotion.type}
                {/* Adicione mais campos conforme necessário */}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProtectedRoute>
  );
}