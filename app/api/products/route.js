// app/api/promotions/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  try {
    const response = await axios.get(`${API_URL}/promotions`, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao buscar promoções (API Route):", error.message);
    return new Response(JSON.stringify({ error: error.response?.data?.error || error.message }), {
      status: error.response?.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const data = await request.json();
  try {
    const response = await axios.post(`${API_URL}/promotions`, data, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return new Response(JSON.stringify(response.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao criar promoção (API Route):", error.message);
    return new Response(JSON.stringify({ error: error.response?.data?.error || error.message }), {
      status: error.response?.status || 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const { id } = request.nextUrl.searchParams;
  const data = await request.json();
  try {
    const response = await axios.put(`${API_URL}/promotions/${id}`, data, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao atualizar promoção (API Route):", error.message);
    return new Response(JSON.stringify({ error: error.response?.data?.error || error.message }), {
      status: error.response?.status || 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const { id } = request.nextUrl.searchParams;
  try {
    await axios.delete(`${API_URL}/promotions/${id}`, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao deletar promoção (API Route):", error.message);
    return new Response(JSON.stringify({ error: error.response?.data?.error || error.message }), {
      status: error.response?.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}