// app/api/boletos/upcoming/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../../pages/api/auth/[...nextauth]'; // Ajuste o caminho se necessário

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/boletos/upcoming
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
  }

  try {
    const response = await axios.get(`${BACKEND_API_URL}/api/boletos/upcoming`, { // Verifique se o endpoint no seu backend é '/boletos/upcoming'
      headers: { Authorization: `Bearer ${session.id}` }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar boletos a vencer (API Route):", error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || "Erro ao carregar boletos a vencer" },
      { status: error.response?.status || 500 }
    );
  }
}