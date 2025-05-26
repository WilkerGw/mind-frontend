'use client';
import ProductForm from '../../components/ProductForm';
import { useRouter } from 'next/navigation';
import styles from '../../components/Styles/Form.module.css';

export default function NewProduct() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push('/products');
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao cadastrar o produto.');
    }
  };

  return (
    <section>
      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Cadastrar Produto</h1>
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}