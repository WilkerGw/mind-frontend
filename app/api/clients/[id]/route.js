import axios from 'axios';
import { NextResponse } from 'next/server';

// Buscar cliente por ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const response = await axios.get(`http://localhost:5000/api/clients/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message);
    return NextResponse.json(
      { error: "Cliente não encontrado" },
      { status: 404 }
    );
  }
}

// Atualizar cliente
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  try {
    const response = await axios.put(`http://localhost:5000/api/clients/${id}`, data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || "Erro ao atualizar cliente" },
      { status: error.response?.status || 500 }
    );
  }
}

// Excluir cliente
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await axios.delete(`http://localhost:5000/api/clients/${id}`);
    return NextResponse.json({ message: "Cliente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || "Erro ao excluir cliente" },
      { status: error.response?.status || 500 }
    );
  }
}