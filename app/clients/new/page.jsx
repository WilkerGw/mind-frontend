"use client";
import ClientForm from "../../components/ClientForm";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";

export default function NewClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status} ao salvar cliente.`);
      }
      router.push("/clients");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className={styles.formContainer}>
        <button onClick={() => router.back()} className={styles.btnVoltar}>
          Voltar
        </button>
        <h1 className={styles.formTitle}>Novo Cliente</h1>
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}
        <ClientForm onSubmit={handleSubmit} />
        {isSubmitting && <p>Salvando...</p>}
      </div>
    </section>
  );
}