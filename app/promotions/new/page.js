'use client';
import { useState } from 'react'; // Adicione esta linha para importar useState
import { useRouter } from 'next/navigation';

export default function NewPromotion() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: 'desconto',
    discount: 0,
    startDate: new Date(),
    endDate: new Date(),
    products: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push('/promotions');
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <h1>Cadastrar Promoção</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campos do formulário */}
          <label>
            Nome:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Tipo:
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="desconto">Desconto</option>
              <option value="brinde">Brinde</option>
            </select>
          </label>
          <label>
            Desconto:
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
          </label>
          <label>
            Data de Início:
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </label>
          <label>
            Data de Fim:
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </>
  );
}