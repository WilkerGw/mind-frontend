"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClients, deleteClient } from "../../lib/client-api";
import Card from "../components/Card";
import { Users, PlusCircle, Search, Edit, Trash2, Phone } from "lucide-react";
import styles from "./clients.module.css";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getClients();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const formatPhoneNumberForLink = (phone) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  const filteredClients = clients.filter((client) =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.cpf && client.cpf.includes(searchTerm))
  );
  
  const handleEdit = (id) => {
    router.push(`/clients/${id}`);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteClient(id);
        setClients(clients.filter(c => c._id !== id));
      } catch (err) {
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Clientes</h1>
        <Link href="/clients/new" className={styles.newClientButton}>
          <PlusCircle size={20} />
          <span>Novo Cliente</span>
        </Link>
      </div>
      
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
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
                <th>Nome Completo</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Data de Nasc.</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className={styles.statusCell}>Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className={styles.statusCellError}>{error}</td></tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.fullName}</td>
                    <td>{client.cpf}</td>
                    <td>{client.phone}</td>
                    <td>{formatDate(client.birthDate)}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <a 
                          href={`https://wa.me/55${formatPhoneNumberForLink(client.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.actionButton} ${styles.whatsappButton}`}
                          aria-label="Conversar no WhatsApp"
                          title="Conversar no WhatsApp"
                        >
                          <Phone size={16} />
                        </a>
                        <button onClick={() => handleEdit(client._id)} className={styles.actionButton} title="Editar Cliente">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(client._id, client.fullName)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Cliente">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className={styles.statusCell}>Nenhum cliente encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}