import axios from 'axios';

// GET: Busca todos os agendamentos
export async function GET() {
  try {
    const response = await axios.get('http://localhost:5000/api/agendamento');
    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Cria um novo agendamento
export async function POST(request) {
  const data = await request.json();
  try {
    const response = await axios.post('http://localhost:5000/api/agendamento', data);
    return new Response(JSON.stringify(response.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT: Atualiza um agendamento
export async function PUT(request) {
  const { id } = request.nextUrl.searchParams;
  const data = await request.json();
  try {
    const response = await axios.put(`http://localhost:5000/api/agendamento/${id}`, data);
    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE: Exclui um agendamento
export async function DELETE(request) {
  const { id } = request.nextUrl.searchParams;
  try {
    const response = await axios.delete(`http://localhost:5000/api/agendamento/${id}`);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}