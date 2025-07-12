// app/api/clients-birthday/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../pages/api/auth/[...nextauth]'; // Ajuste o caminho se necessário

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/clients-birthday
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  try {
    // CORREÇÃO: Adicionado '/monthly' à URL
    const response = await axios.get(`${BACKEND_API_URL}/api/clients/birthday/monthly`, { 
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar aniversariantes (API Route):", error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || "Erro ao carregar aniversariantes" },
      { status: error.response?.status || 500 }
    );
  }
}