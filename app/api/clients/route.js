// src/app/api/clients/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/clients';

// GET /api/clients - Listar todos os clientes
export async function GET() {
  try {
    const response = await axios.get(API_URL);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API Route GET Error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Erro ao buscar clientes';
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/clients - Criar novo cliente
export async function POST(request) {
  try {
    const data = await request.json();
    const response = await axios.post(API_URL, data);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("API Route POST Error:", error.response?.data || error.message);
    const status = error.response?.status || 400; // Default to 400 for creation errors
    const message = error.response?.data?.error || error.message || 'Erro ao criar cliente';
     // Se for erro de conflito (CPF existente), retornar 409
     if (error.response?.status === 409) {
        return NextResponse.json({ error: message }, { status: 409 });
     }
    return NextResponse.json({ error: message }, { status });
  }
}