"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSales, deleteSale } from "../../lib/sale-api";
import Card from "../components/Card";
import { ShoppingCart, PlusCircle, Search, Eye, Trash2 } from "lucide-react";
import styles from "./sales.module.css"; // Novo arquivo de estilo

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await getSales();
        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter((sale) =>
    sale.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDetails = (id) => {
    router.push(`/sales/${id}`);
  };

  const handleDelete = async (id, clientName) => {
    if (confirm(`Tem certeza que deseja excluir a venda para "${clientName}"?`)) {
      try {
        await deleteSale(id);
        setSales(sales.filter(s => s._id !== id));
      } catch (err) {
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Histórico de Vendas</h1>
        <Link href="/sales/new" className={styles.newButton}>
          <PlusCircle size={20} />
          <span>Nova Venda</span>
        </Link>
      </div>
      
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome do cliente..."
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
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Pagamento</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className={styles.statusCell}>Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className={styles.statusCellError}>{error}</td></tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{formatDate(sale.saleDate)}</td>
                    <td>{sale.client?.fullName || "N/A"}</td>
                    <td>{sale.seller}</td>
                    <td>{sale.paymentMethod}</td>
                    <td>{formatCurrency(sale.total)}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button onClick={() => handleDetails(sale._id)} className={styles.actionButton} title="Ver Detalhes">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(sale._id, sale.client?.fullName)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Venda">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className={styles.statusCell}>Nenhuma venda encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}