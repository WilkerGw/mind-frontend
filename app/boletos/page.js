"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getBoletos, updateBoletoStatus, deleteBoleto } from "../../lib/boleto-api";
import Card from "../components/Card";
import { PlusCircle, Search, Trash2, CheckCircle2 } from "lucide-react";
import styles from "./boletos.module.css";

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

export default function BoletosPage() {
  const [allBoletos, setAllBoletos] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("aberto");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoletos = async () => {
    try {
      setLoading(true);
      const data = await getBoletos();
      setAllBoletos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoletos();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateBoletoStatus(id, newStatus);
      fetchBoletos(); 
    } catch (err) {
      alert(`Erro ao atualizar status: ${err.message}`);
    }
  };

  const handleDelete = async (id, clientName) => {
    if (confirm(`Tem certeza que deseja excluir o boleto de "${clientName}"?`)) {
      try {
        await deleteBoleto(id);
        fetchBoletos();
      } catch (err) {
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  };

  const getStatusClass = (status) => {
    if (status === 'pago') return styles.pago;
    if (status === 'atrasado') return styles.atrasado;
    return styles.aberto;
  };
  
  const groupedAndSortedBoletos = useMemo(() => {
    const filtered = allBoletos
      .filter(b => statusFilter === 'todos' ? true : b.status === statusFilter)
      .filter(b => (b.client?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()));

    if (filtered.length === 0) return {};

    const grouped = filtered.reduce((acc, boleto) => {
      const date = new Date(boleto.dueDate);
      const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      if (!acc[monthYear]) {
        acc[monthYear] = { boletos: [], total: 0, pago: 0 };
      }
      acc[monthYear].boletos.push(boleto);
      acc[monthYear].total += boleto.parcelValue;
      if (boleto.status === 'pago') {
        acc[monthYear].pago += boleto.parcelValue;
      }
      return acc;
    }, {});

    const getMonthDate = (monthYearStr) => {
        const [monthName, year] = monthYearStr.split(' de ');
        const monthIndex = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'].indexOf(monthName.toLowerCase());
        return new Date(year, monthIndex);
    };
    
    let sortedMonthKeys = Object.keys(grouped);

    if (statusFilter === 'todos') {
      sortedMonthKeys.sort((keyA, keyB) => {
        const groupA = grouped[keyA];
        const groupB = grouped[keyB];
        const isACompleted = groupA.total > 0 && groupA.pago >= groupA.total;
        const isBCompleted = groupB.total > 0 && groupB.pago >= groupB.total;

        if (isACompleted && !isBCompleted) return 1;
        if (!isACompleted && isBCompleted) return -1;
        
        return getMonthDate(keyA) - getMonthDate(keyB);
      });
    } else {
      sortedMonthKeys.sort((a, b) => getMonthDate(a) - getMonthDate(b));

      const currentMonthKey = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric'});
      const currentMonthIndex = sortedMonthKeys.indexOf(currentMonthKey);
      if (currentMonthIndex > -1) {
        const [key] = sortedMonthKeys.splice(currentMonthIndex, 1);
        sortedMonthKeys.unshift(key);
      }
    }
    
    return { grouped, sortedMonthKeys };
  }, [allBoletos, statusFilter, searchTerm]);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Controle de Boletos</h1>
        <Link href="/boletos/new" className={styles.newButton}>
          <PlusCircle size={20} />
          <span>Novo Boleto</span>
        </Link>
      </div>
      
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.filters}>
            <button onClick={() => setStatusFilter('aberto')} className={statusFilter === 'aberto' ? styles.activeFilter : ''}>Abertos</button>
            <button onClick={() => setStatusFilter('atrasado')} className={statusFilter === 'atrasado' ? styles.activeFilter : ''}>Atrasados</button>
            <button onClick={() => setStatusFilter('pago')} className={statusFilter === 'pago' ? styles.activeFilter : ''}>Pagos</button>
            <button onClick={() => setStatusFilter('todos')} className={statusFilter === 'todos' ? styles.activeFilter : ''}>Todos</button>
          </div>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input type="text" placeholder="Buscar por nome do cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className={styles.statusCell}>Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className={styles.statusCellError}>{error}</td></tr>
              ) : groupedAndSortedBoletos.sortedMonthKeys?.length > 0 ? (
                groupedAndSortedBoletos.sortedMonthKeys.map(monthKey => {
                  const group = groupedAndSortedBoletos.grouped[monthKey];
                  const progressPercentage = group.total > 0 ? (group.pago / group.total) * 100 : 0;
                  
                  return (
                    <React.Fragment key={monthKey}>
                      <tr className={styles.monthHeaderRow}>
                        <td colSpan="5">
                          <div className={styles.monthHeaderContent}>
                            <h3 className={styles.monthName}>{monthKey.charAt(0).toUpperCase() + monthKey.slice(1)}</h3>
                            <div className={styles.monthTotalsText}>
                              <span className={styles.paidValue}>{formatCurrency(group.pago)}</span>
                              <span className={styles.totalGoal}> de {formatCurrency(group.total)}</span>
                              <span className={styles.percentage}>({progressPercentage.toFixed(0)}%)</span>
                            </div>
                          </div>
                          <div className={styles.progressBarContainer}>
                            <div 
                              className={styles.progressBarFill} 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                      {group.boletos.map(boleto => (
                        <tr key={boleto._id} className={boleto.status === 'atrasado' ? styles.overdueRow : ''}>
                          <td>{boleto.client?.fullName || "Cliente Excluído"}</td>
                          <td>{formatCurrency(boleto.parcelValue)}</td>
                          <td>{formatDate(boleto.dueDate)}</td>
                          <td><span className={`${styles.statusBadge} ${getStatusClass(boleto.status)}`}>{boleto.status}</span></td>
                          <td>
                            <div className={styles.actionsCell}>
                              {boleto.status !== 'pago' && (
                                <button onClick={() => handleUpdateStatus(boleto._id, 'pago')} className={`${styles.actionButton} ${styles.payButton}`} title="Marcar como Pago">
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              <button onClick={() => handleDelete(boleto._id, boleto.client?.fullName)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Boleto">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                })
              ) : (
                <tr><td colSpan="5" className={styles.statusCell}>Nenhum boleto encontrado para este filtro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}