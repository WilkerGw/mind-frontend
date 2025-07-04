"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClientById, updateClient } from "../../../lib/client-api"; // Caminho atualizado
import ClientForm from "../../components/ClientForm"; // Caminho atualizado
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../clients.module.css";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await getClientById(id);
        setInitialData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateClient(id, data);
      router.push("/clients");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <div className={styles.statusCell}>Carregando cliente...</div>;
  if (error) return <div className={styles.statusCellError}>Erro: {error}</div>;

  return (
     <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/clients" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.pageTitle}>Editar Cliente</h1>
        </div>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro ao salvar: {error}</p>}
      <ClientForm 
        onSubmit={handleSubmit} 
        initialData={initialData}
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}