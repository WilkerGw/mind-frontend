"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link"; // Importar o Link do next/link
import styles from "../../Styles/Dashboard.module.css";

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
          const errorData = await response.text(); // Alterado para .text() para obter o conteúdo da resposta
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
        const errorData = await response.text(); // Alterado para .text() para obter o conteúdo da resposta
        throw new Error(errorData || "Erro ao atualizar agendamento");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  // Função para formatar a data no formato brasileiro
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mês é zero-based
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <section>
      <div className={styles.detalhesContainer}>
        <h1 className={styles.titleLista}>{agendamento.name}</h1>
        <div>
          <div className={styles.detalhesAgendamentoCont}>
            <p>Telefone/WhatsApp: {agendamento.telephone}</p>
            <p>Data: {formatDate(agendamento.date)}</p> {/* Formata a data aqui */}
            <p>Hora: {agendamento.hour}</p>
            <p>Observação: {agendamento.observation}</p>
          </div>
          <div className={styles.listaBtnsContainer}>
            <label className={styles.labelFilter}>
              Contactado
              <input
                type="checkbox"
                name="contactado"
                checked={agendamento.contactado || false}
                onChange={handleCheckboxChange}
              />
            </label>
            <label className={styles.labelFilter}>
              Compareceu
              <input
                type="checkbox"
                name="compareceu"
                checked={agendamento.compareceu || false}
                onChange={handleCheckboxChange}
              />
            </label>
            <label className={styles.labelFilter}>
              Faltou
              <input
                type="checkbox"
                name="faltou"
                checked={agendamento.faltou || false}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>
          <Link href="/agendamento">
            <button>Voltar</button>
          </Link>
        </div>
      </div>
    </section>
  );
}