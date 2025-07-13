"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/client-api";
import ClientForm from "../../components/ClientForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../clients.module.css";

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createClient(data);
      router.push("/clients");
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
          <Link href="/clients" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.pageTitle}>Novo Cliente</h1>
        </div>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error}</p>}
      <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}