"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "./ClientDetails.module.css";
import ClientForm from "../../components/ClientForm";
import {
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Função auxiliar para formatar data
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

export default function ClientDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // ID vem dos parâmetros da rota dinâmica
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID do cliente não fornecido na URL.");
      return;
    }
    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      try {
        // Chama a API route dinâmica do Next.js
        const response = await fetch(`/api/clients/${id}`);
        console.log("Response Status:", response.status); // Log status
        if (!response.ok) {
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const jsonError = await response.json();
            throw new Error(jsonError.error || `Erro ${response.status}`);
          } else {
            const textError = await response.text();
            throw new Error(
              textError || `Erro ${response.status} - Resposta não JSON`
            );
          }
        }

        const data = await response.json(); // Apenas uma leitura
        console.log("Data recebida:", data); // Log dados recebidos

        // Normaliza os dados para garantir a estrutura correta
        const normalizedData = {
          ...data,
          longe: data.longe || {
            esfericoDireito: "",
            cilindricoDireito: "",
            eixoDireito: "",
            esfericoEsquerdo: "",
            cilindricoEsquerdo: "",
            eixoEsquerdo: "",
            adicao: "",
          },
          perto: data.perto || {
            esfericoDireito: "",
            cilindricoDireito: "",
            eixoDireito: "",
            esfericoEsquerdo: "",
            cilindricoEsquerdo: "",
            eixoEsquerdo: "",
            adicao: "",
          },
          birthDate: formatDate(data.birthDate),
          vencimentoReceita: formatDate(data.vencimentoReceita),
        };

        setClient(normalizedData);
      } catch (error) {
        console.error("Erro no fetchClient:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]); // Dependência: re-executa se o ID mudar

  const handleDelete = async () => {
    if (!id || !client) return;
    if (
      confirm(`Tem certeza que deseja excluir o cliente "${client.fullName}"?`)
    ) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao excluir cliente");
        }
        alert("Cliente excluído com sucesso!");
        router.push("/clients"); // Volta para a lista
      } catch (err) {
        setError(err.message);
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>Erro: {error}</p>;
  if (!client) return <p>Cliente não encontrado.</p>; // Caso após loading/error

  return (
    <section>
      <div className={styles.dashboard}>
        <div className={styles.detalhesHeader}>
          <h1 className={styles.title}>
            {client.fullName}
          </h1>
          <div className={styles.btnContainer}>
            <Tooltip title="Voltar">
              <IconButton onClick={() => router.back()} color="primary">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir Cliente">
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
          <ClientForm
            onSubmit={(data) => {
              fetch(`/api/clients/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              })
                .then((response) => {
                  if (response.ok) {
                    alert("Cliente atualizado com sucesso!");
                    router.push("/clients");
                  } else {
                    response.json().then((errorData) => {
                      alert(errorData.error || "Erro ao atualizar cliente");
                    });
                  }
                })
                .catch((error) => {
                  console.error("Erro ao atualizar cliente:", error);
                  alert("Erro ao atualizar cliente");
                });
            }}
            initialData={client}
          />
      </div>
    </section>
  );
}