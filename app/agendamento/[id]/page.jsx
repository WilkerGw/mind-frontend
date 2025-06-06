"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function AgendamentoDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [agendamento, setAgendamento] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID do agendamento não encontrado");
      return;
    }
    const fetchAgendamento = async () => {
      try {
        const response = await fetch(`/api/agendamento/${id}`);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Erro ao buscar agendamento");
        }
        const data = await response.json();
        setAgendamento(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamento();
  }, [id]);

  const handleCheckboxChange = async (e) => {
    const { name, checked } = e.target;
    try {
      const response = await fetch(`/api/agendamento/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [name]: checked }),
      });
      if (response.ok) {
        const updatedAgendamento = await response.json();
        setAgendamento(updatedAgendamento);
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Erro ao atualizar agendamento");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dia = String(date.getUTCDate()).padStart(2, "0");
    const mes = String(date.getUTCMonth() + 1).padStart(2, "0");
    const ano = date.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <section className={styles.container}>
      <div className={styles.detalhesContainer}>
        <h1 className={styles.title}>{agendamento.name}</h1>
        <div className={styles.infoContainer}>
          <div className={styles.detalhesAgendamento}>
            <p>
              <span className={styles.label}>Telefone/WhatsApp: </span>
              {agendamento.telephone}
            </p>
            <p>
              <span className={styles.label}>Data: </span>
              {formatDate(agendamento.date)}
            </p>
            <p>
              <span className={styles.label}>Hora: </span>
              {agendamento.hour}
            </p>
            <p>
              <span className={styles.label}>Observação: </span>
              {agendamento.observation || "Nenhuma observação"}
            </p>
          </div>
          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                Contactado
                <input
                  type="checkbox"
                  name="contactado"
                  checked={agendamento.contactado || false}
                  onChange={handleCheckboxChange}
                />
                <span className={styles.checkboxCheck}></span>
              </label>
              <label className={styles.checkboxLabel}>
                Compareceu
                <input
                  type="checkbox"
                  name="compareceu"
                  checked={agendamento.compareceu || false}
                  onChange={handleCheckboxChange}
                />
                <span className={styles.checkboxCheck}></span>
              </label>
              <label className={styles.checkboxLabel}>
                Faltou
                <input
                  type="checkbox"
                  name="faltou"
                  checked={agendamento.faltou || false}
                  onChange={handleCheckboxChange}
                />
                <span className={styles.checkboxCheck}></span>
              </label>
            </div>
          </div>
          <Link href="/agendamento">
            <button className={styles.backButton}>Voltar</button>
          </Link>
        </div>
      </div>
    </section>
  );
}