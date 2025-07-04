"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// CAMINHOS CORRIGIDOS
import { createSale } from "../../../lib/sale-api";
import SaleForm from "../../components/SaleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../sales.module.css";

export default function NewSalePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createSale(data);
      router.push("/sales");
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
          <Link href="/sales" className={styles.actionButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.pageTitle}>Registrar Nova Venda</h1>
        </div>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error}</p>}
      <SaleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}