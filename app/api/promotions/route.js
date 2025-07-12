// app/api/promotions/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../pages/api/auth/[...nextauth]'; // Ajuste o caminho se necessário

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/promotions
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  try {
    const response = await axios.get(`${BACKEND_API_URL}/api/promotions`, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar promoções (API Route):", error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || "Erro ao carregar promoções" },
      { status: error.response?.status || 500 }
    );
  }
}

// POST /api/promotions
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  const data = await request.json();
  try {
    const response = await axios.post(`${BACKEND_API_URL}/api/promotions`, data, {
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar promoção (API Route):", error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || error.message },
      { status: error.response?.status || 400 }
    );
  }
}