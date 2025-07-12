// app/api/sales/[id]/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../../pages/api/auth/[...nextauth]'; // Ajuste o caminho se necessário

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/sales/[id]
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const { id } = params;
  try {
    const response = await axios.get(`${BACKEND_API_URL}/api/sales/${id}`, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Erro ao buscar venda ${id} (API Route):`, error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || "Erro ao carregar venda" },
      { status: error.response?.status || 500 }
    );
  }
}

// PUT /api/sales/[id]
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const { id } = params;
  const data = await request.json();
  try {
    const response = await axios.put(`${BACKEND_API_URL}/api/sales/${id}`, data, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Erro ao atualizar venda ${id} (API Route):`, error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || error.message },
      { status: error.response?.status || 400 }
    );
  }
}

// DELETE /api/sales/[id]
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const { id } = params;
  try {
    await axios.delete(`${BACKEND_API_URL}/api/sales/${id}`, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Erro ao deletar venda ${id} (API Route):`, error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || error.message },
      { status: error.response?.status || 500 }
    );
  }
}