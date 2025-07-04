"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAgendamentos, deleteAgendamento } from "../../lib/agendamento-api";
import Card from "../components/Card";
import { Calendar, PlusCircle, Search, Edit, Trash2, Phone } from "lucide-react";
import styles from "./agendamento.module.css";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  // Usar toLocaleDateString para respeitar o fuso horário local
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export default function AgendamentoPage() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        setLoading(true);
        const data = await getAgendamentos();
        // Ordena os agendamentos por data, do mais recente para o mais antigo
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAgendamentos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, []);

  const filteredAgendamentos = agendamentos.filter((agendamento) =>
    agendamento.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDetails = (id) => {
    router.push(`/agendamento/${id}`);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Tem certeza que deseja excluir o agendamento de "${name}"?`)) {
      try {
        await deleteAgendamento(id);
        setAgendamentos(agendamentos.filter(a => a._id !== id));
      } catch (err) {
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  };

  const getStatus = (agendamento) => {
    if (agendamento.compareceu) return <span className={`${styles.statusBadge} ${styles.compareceu}`}>Compareceu</span>;
    if (agendamento.faltou) return <span className={`${styles.statusBadge} ${styles.faltou}`}>Faltou</span>;
    if (agendamento.contactado) return <span className={`${styles.statusBadge} ${styles.contactado}`}>Contactado</span>;
    return <span className={`${styles.statusBadge} ${styles.aberto}`}>Aberto</span>;
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Agendamentos</h1>
        <Link href="/agendamento/new" className={styles.newButton}>
          <PlusCircle size={20} />
          <span>Novo Agendamento</span>
        </Link>
      </div>
      
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className={styles.statusCell}>Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className={styles.statusCellError}>{error}</td></tr>
              ) : filteredAgendamentos.length > 0 ? (
                filteredAgendamentos.map((ag) => (
                  <tr key={ag._id}>
                    <td>{formatDate(ag.date)}</td>
                    <td>{ag.hour}</td>
                    <td>{ag.name}</td>
                    <td>{ag.telephone}</td>
                    <td>{getStatus(ag)}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button onClick={() => handleDetails(ag._id)} className={styles.actionButton} title="Detalhes do Agendamento">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(ag._id, ag.name)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Agendamento">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className={styles.statusCell}>Nenhum agendamento encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}