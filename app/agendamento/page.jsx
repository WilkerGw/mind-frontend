"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Agendamento() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState(""); // Mudança aqui: filtro é uma string

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
    setFiltro(checked ? name : ""); // Mudança aqui: define o filtro ou limpa
  };

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    if (!filtro) {
      return true; // Nenhum filtro ativo, mostrar todos
    }
    switch (filtro) {
      case "contactado":
        return agendamento.contactado;
      case "compareceu":
        return agendamento.compareceu;
      case "faltou":
        return agendamento.faltou;
      default:
        return true;
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "Não informada";
    try {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return "Data inválida";
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, "");
  };

  const getDataColorClass = (dateString) => {
    const currentDate = new Date();
    const agendamentoDate = new Date(dateString);
    if (agendamentoDate < currentDate) {
      return styles.pDateRed; // Classe para data passada
    } else {
      return styles.pDateGreen; // Classe para data futura
    }
  };

  if (loading) return <Typography variant="body1">Carregando...</Typography>;
  if (error) return <Typography variant="body1">{error}</Typography>;

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.titleContainer}>
            <Typography variant="h3" className={styles.title}>
              Agendamentos
            </Typography>
            <Link href="/agendamento/new" passHref>
              <Button variant="contained" color="success">
                Novo Agendamento
              </Button>
            </Link>
          </div>
          <div className={styles.filtros}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    name="contactado"
                    checked={filtro === "contactado"} // Mudança aqui: verifica se o filtro é "contactado"
                    onChange={handleFiltroChange}
                    color="primary"
                  />
                }
                label="Contactado"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="compareceu"
                    checked={filtro === "compareceu"} // Mudança aqui: verifica se o filtro é "compareceu"
                    onChange={handleFiltroChange}
                    color="primary"
                  />
                }
                label="Compareceu"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="faltou"
                    checked={filtro === "faltou"} // Mudança aqui: verifica se o filtro é "faltou"
                    onChange={handleFiltroChange}
                    color="primary"
                  />
                }
                label="Faltou"
              />
            </FormGroup>
          </div>
          <List className={styles.lista}>
            {agendamentosFiltrados.map((agendamento) => (
              <ListItem key={agendamento._id} className={styles.titleLista}>
                <ListItemText
                  primary={
                    <div className={styles.dataAgendamento}>
                      <Typography variant="h5" className={styles.pName}>
                        {agendamento.name}
                      </Typography>
                      <Typography variant="body1" className={styles.pTelephone}>
                        {agendamento.telephone}
                      </Typography>
                      <div className={styles.agenDataContainer}>
                        <Typography variant="caption" className={styles.txtDate}>
                          Data do agendamento:
                        </Typography>
                        <Typography
                          variant="caption"
                          className={getDataColorClass(agendamento.date)}
                        >
                          {formatDate(agendamento.date)}
                        </Typography>
                      </div>
                      <Typography variant="body1" className={styles.pHour}>
                        {agendamento.hour}
                      </Typography>
                    </div>
                  }
                  secondary={
                    <div className={styles.listaBtnsContainer}>
                      <Tooltip title="">
                        <IconButton
                          href={`https://wa.me/55${formatPhoneNumber(agendamento.telephone)}`}    
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </Tooltip>
                      <Link href={`/agendamento/${agendamento._id}`} passHref>
                        <Button variant="outlined" color="primary">
                          Detalhes
                        </Button>
                      </Link>
                      <IconButton
                        onClick={() => handleDelete(agendamento._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </section>
    </ProtectedRoute>
  );
}