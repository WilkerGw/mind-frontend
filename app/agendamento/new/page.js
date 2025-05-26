"use client";
import AgendamentoForm from "../../components/AgendamentoForm";
import { useRouter } from "next/navigation";
import styles from "../../components/Styles/Form.module.css";

export default function newAgendamento() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const response = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/agendamento");
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao cadastrar o agendamento.");
    }
  };

  return (
    <section>
      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Agendar</h1>
        <AgendamentoForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
