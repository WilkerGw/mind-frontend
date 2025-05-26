// erp-otica\src\app\boletos\page.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../Styles/Dashboard.module.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Boletos() {
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const response = await fetch('/api/boletos');
        if (!response.ok) {
          throw new Error('Erro ao buscar boletos');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setBoletos(data);
        } else {
          throw new Error('Resposta inválida');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBoletos();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  // Objeto que mapeia status para cores
  const statusColors = {
    pago: '#008000',
    aberto: '#f38e21',
    atrasado: '#ff0000'
  };

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Lista de Boletos</h1>
            <Link href="/boletos/new">
              <button className={styles.btnNovo}>Novo Boleto</button>
            </Link>
          </div>
          <ul className={styles.lista}>
            {boletos.map((boleto) => (
              <li key={boleto._id} className={styles.titleLista}>
                {boleto.client?.fullName || 'Cliente não especificado'} -{' '}
                <strong>R$ {boleto.parcelValue.toFixed(2)}</strong> -{' '}
                {new Date(boleto.dueDate).toLocaleDateString('pt-BR')}
                <br />
                <small>
                  Status:
                  <span style={{ color: statusColors[boleto.status] || 'black' }}>
                    {boleto.status}
                  </span>
                </small>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProtectedRoute>
  );
}