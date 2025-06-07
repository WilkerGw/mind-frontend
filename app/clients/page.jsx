"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css"; // Certifique-se do caminho correto
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";


const formatDate = (dateString) => {
  if (!dateString) return "Não informada";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return "Data inválida";
  }
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Declaração do estado searchTerm

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) {
          throw new Error("Erro ao buscar clientes");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          throw new Error("Resposta inválida");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, "");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <section>
        <div className={styles.dashboard}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Clientes</h1>
            <Link href="/clients/new">
              <button className={styles.btnNovo}>Novo Cliente</button>
            </Link>
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchBar}
          />
          <ul className={styles.lista}>
            {filteredClients.map((client) => (
              <li key={client._id} className={styles.titleLista}>
                <div className={styles.dataAgendamento}>
                  <p className={styles.pName}>{client.fullName}</p>
                  <p className={styles.pCpf}>{client.cpf}</p>
                  <p className={styles.pBirthDate}>
                    {formatDate(client.birthDate)}
                  </p>
                  <p className={styles.pTelephone}>{client.phone}</p>
                </div>
                <div className={styles.listaBtnsContainer}>
                  <Tooltip title="">
                        <IconButton
                          href={`https://wa.me/55${formatPhoneNumber(client.phone)}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </Tooltip>
                  <Link href={`/clients/${client._id}`}>
                    <button>Detalhes</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProtectedRoute>
  );
}