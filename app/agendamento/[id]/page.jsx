"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAgendamentoById, updateAgendamento } from '../../../lib/agendamento-api';
import Card from '../../components/Card';
import Link from 'next/link';
import { ArrowLeft, Phone, Calendar, Clock, MessageSquare } from 'lucide-react';
import styles from './details.module.css';

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' });
};

const formatPhoneNumberForLink = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

export default function AgendamentoDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchAgendamento = async () => {
      try {
        setLoading(true);
        const data = await getAgendamentoById(id);
        setAgendamento(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamento();
  }, [id]);

  const handleStatusChange = async (e) => {
    const { name, checked } = e.target;
    const updatedStatus = { [name]: checked };

    if (name === 'compareceu' && checked) {
      updatedStatus.faltou = false;
    } else if (name === 'faltou' && checked) {
      updatedStatus.compareceu = false;
    }

    try {
      setAgendamento(prev => ({ ...prev, ...updatedStatus }));
      await updateAgendamento(id, updatedStatus);
    } catch (err) {
      alert(`Erro ao atualizar status: ${err.message}`);
      setAgendamento(agendamento);
    }
  };

  if (loading) return <div className={styles.statusMessage}>Carregando agendamento...</div>;
  if (error) return <div className={styles.statusMessageError}>Erro: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/agendamento" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.pageTitle}>{agendamento.name}</h1>
            <p className={styles.pageSubtitle}>Detalhes e status do agendamento</p>
          </div>
        </div>
      </div>
      
      <div className={styles.detailsGrid}>
        <Card className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Informações do Contato</h2>
          <div className={styles.infoItem}><Phone size={16}/> <span>{agendamento.telephone}</span></div>
          <div className={styles.infoItem}><Calendar size={16}/> <span>{formatDate(agendamento.date)}</span></div>
          <div className={styles.infoItem}><Clock size={16}/> <span>{agendamento.hour}</span></div>
          <div className={styles.infoItem}><MessageSquare size={16}/> <span>{agendamento.observation || 'Nenhuma observação.'}</span></div>
        </Card>

        <Card className={styles.statusCard}>
          <h2 className={styles.cardTitle}>Atualizar Status</h2>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="contactado" checked={agendamento.contactado || false} onChange={handleStatusChange} />
              Contactado
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="compareceu" checked={agendamento.compareceu || false} onChange={handleStatusChange} />
              Compareceu
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="faltou" checked={agendamento.faltou || false} onChange={handleStatusChange} />
              Faltou
            </label>
          </div>
          <a href={`https://wa.me/55${formatPhoneNumberForLink(agendamento.telephone)}`} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
            <Phone size={16} />
            Lembrar via WhatsApp
          </a>
        </Card>
      </div>
    </div>
  );
}