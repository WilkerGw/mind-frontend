"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct } from "../../lib/product-api"; // Caminho relativo
import Card from "../components/Card"; // Caminho relativo
import { Package, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import styles from "./products.module.css"; // Novo arquivo de estilo

// Formata o valor para moeda brasileira
const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return "R$ 0,00";
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (id) => {
    router.push(`/products/${id}`);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Produtos</h1>
        <Link href="/products/new" className={styles.newButton}>
          <PlusCircle size={20} />
          <span>Novo Produto</span>
        </Link>
      </div>
      
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Estoque</th>
                <th>Preço de Venda</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className={styles.statusCell}>Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className={styles.statusCellError}>{error}</td></tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.type}</td>
                    <td>{product.stock}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button onClick={() => handleEdit(product._id)} className={styles.actionButton} title="Editar Produto">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product._id, product.name)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Produto">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className={styles.statusCell}>Nenhum produto encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}