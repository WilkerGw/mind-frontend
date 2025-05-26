// src/app/api/clients/[id]/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/clients';

// GET /api/clients/:id - Buscar cliente por ID
export async function GET(request, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'ID do cliente é obrigatório' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`API Route GET /${id} Error:`, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Erro ao buscar cliente';
    return NextResponse.json({ error: message }, { status });
  }
}

// PUT /api/clients/:id - Atualizar cliente
export async function PUT(request, { params }) {
  const { id } = params;
   if (!id) {
    return NextResponse.json({ error: 'ID do cliente é obrigatório' }, { status: 400 });
  }

  try {
    const data = await request.json();
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`API Route PUT /${id} Error:`, error.response?.data || error.message);
    const status = error.response?.status || 400; // Default to 400 for update errors
    const message = error.response?.data?.error || error.message || 'Erro ao atualizar cliente';
     // Se for erro de conflito (CPF existente), retornar 409
     if (error.response?.status === 409) {
        return NextResponse.json({ error: message }, { status: 409 });
     }
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/clients/:id - Excluir cliente
export async function DELETE(request, { params }) {
  const { id } = params;
   if (!id) {
    return NextResponse.json({ error: 'ID do cliente é obrigatório' }, { status: 400 });
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    // O backend agora retorna 200 com mensagem, então repassamos
    return NextResponse.json(response.data, { status: response.status }); // ou status 204 se o backend retornar 204
  } catch (error) {
    console.error(`API Route DELETE /${id} Error:`, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Erro ao excluir cliente';
    return NextResponse.json({ error: message }, { status });
  }
}