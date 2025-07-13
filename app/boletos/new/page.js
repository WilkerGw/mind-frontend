"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInstallmentPlan } from "../../../lib/boleto-api";
import InstallmentForm from "../../components/InstallmentForm";
import ManualBoletoForm from "../../components/ManualBoletoForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../boletos.module.css";

export default function NewBoletoPage() {
  const router = useRouter();
  const [mode, setMode] = useState('installments');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInstallmentSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { client, valorTotal, valorEntrada, numeroParcelas, dataPrimeiroVencimento } = formData;
      const valorRestante = (parseFloat(valorTotal) || 0) - (parseFloat(valorEntrada) || 0);
      const parcelas = parseInt(numeroParcelas, 10);
      const valorParcela = valorRestante / parcelas;

      const boletosArray = Array.from({ length: parcelas }, (_, i) => {
        const dataVencimento = new Date(dataPrimeiroVencimento);
        dataVencimento.setUTCHours(12,0,0,0);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);
        return {
          client,
          parcelValue: valorParcela,
          dueDate: dataVencimento.toISOString(),
          status: 'aberto',
          description: `Parcela ${i + 1}/${parcelas}`,
        };
      });

      await createInstallmentPlan(boletosArray);
      router.refresh();
      router.push("/boletos");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createInstallmentPlan([{ ...formData, status: 'aberto' }]);
      router.refresh();
      router.push("/boletos");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Novo Lançamento</h1>
      </div>
       <div style={{ marginBottom: '2rem' }}>
        <Link href="/boletos" className={styles.secondaryButton}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </Link>
      </div>

      <div className={styles.modeSelector}>
        <button 
          className={mode === 'installments' ? styles.activeMode : ''} 
          onClick={() => setMode('installments')}
        >
          Gerar Parcelamento
        </button>
        <button 
          className={mode === 'manual' ? styles.activeMode : ''} 
          onClick={() => setMode('manual')}
        >
          Boleto Avulso
        </button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error}</p>}
      
      {mode === 'installments' ? (
        <InstallmentForm onSubmit={handleInstallmentSubmit} isSubmitting={isSubmitting} />
      ) : (
        <ManualBoletoForm onSubmit={handleManualSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}