import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await axios.get('http://localhost:5000/api/clients/birthday/monthly');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar aniversariantes:", error.message);
    return NextResponse.json(
      { error: "Erro ao carregar aniversariantes do mês" },
      { status: 500 }
    );
  }
}