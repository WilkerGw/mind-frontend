"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAgendamento } from '../../../lib/agendamento-api';
import AgendamentoForm from '../../components/AgendamentoForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from '../agendamento.module.css';

export default function NewAgendamentoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createAgendamento(data);
      router.refresh(); 
      router.push('/agendamento');
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
          <Link href="/agendamento" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.pageTitle}>Novo Agendamento</h1>
        </div>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error}</p>}
      <AgendamentoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}