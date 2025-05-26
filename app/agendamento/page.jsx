"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../Styles/Dashboard.module.css";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Agendamento() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState({
    contactado: false,
    compareceu: false,
    faltou: false,
  });

  useEffect(() => {
    const fetchAgendamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/agendamento");
        if (!response.ok) {
          throw new Error("Erro ao buscar agendamentos");
        }
        const data = await response.json();
        setAgendamentos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, checked } = e.target;
    setFiltro({ ...filtro, [name]: checked });
  };

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    if (!filtro.contactado && !filtro.compareceu && !filtro.faltou) {
      return true; // Nenhum filtro ativo, mostrar todos
    }
    let resultado = true;
    if (filtro.contactado && !agendamento.contactado) {
      resultado = false;
    }
    if (filtro.compareceu && !agendamento.compareceu) {
      resultado = false;
    }
    if (filtro.faltou && !agendamento.faltou) {
      resultado = false;
    }
    return resultado;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        const response = await fetch(`/api/agendamento/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setAgendamentos(
            agendamentos.filter((agendamento) => agendamento._id !== id)
          );
          alert("Agendamento excluído com sucesso!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao excluir agendamento");
        }
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, '');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Agendamentos</h1>
            <Link href="/agendamento/new">
              <button className={styles.btnNovo}>Novo Agendamento</button>
            </Link>
          </div>
          <div className={styles.filtros}>
            <label className={styles.labelFilter}>
              Contactado
              <input
                type="checkbox"
                name="contactado"
                checked={filtro.contactado}
                onChange={handleFiltroChange}
              />
            </label>
            <label className={styles.labelFilter}>
              Compareceu
              <input
                type="checkbox"
                name="compareceu"
                checked={filtro.compareceu}
                onChange={handleFiltroChange}
              />
            </label>
            <label className={styles.labelFilter}>
              Faltou
              <input
                type="checkbox"
                name="faltou"
                checked={filtro.faltou}
                onChange={handleFiltroChange}
              />
            </label>
          </div>
          <ul className={styles.lista}>
            {agendamentosFiltrados.map((agendamento) => (
              <li key={agendamento._id} className={styles.titleLista}>
                <div className={styles.dataAgendamento}>
                  <p className={styles.pName}>{agendamento.name}</p>
                  <p className={styles.pTelephone}>{agendamento.telephone}</p>
                  <p className={styles.pHour}>{agendamento.hour}</p>
                </div>
                <div className={styles.listaBtnsContainer}>
                  <Link href={`https://wa.me/55${formatPhoneNumber(agendamento.telephone)}`} target="_blank">
                    <img
                      src="./images/whatsapp.png"
                      alt="botao whatsapp"
                      className={styles.whatsButton}
                    />
                  </Link>
                  <Link href={`/agendamento/${agendamento._id}`}>
                    <button>Detalhes</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(agendamento._id)}
                    className={styles.btnExcluir}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProtectedRoute>
  );
}