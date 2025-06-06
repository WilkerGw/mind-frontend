"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../components/Styles/FormAgendamento.module.css";

export default function NewSale() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientCPF: "",
    clientName: "",
    products: [],
    seller: "",
    paymentMethod: "",
    saleDate: "",
    warrantyPeriod: "",
    warrantyExpiration: "",
    notes: "",
    total: 0,
  });

  const [clients, setClients] = useState([]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, saleDate: currentDate }));

    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProductsList(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchClients();
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [formData.products]);

  const calculateTotal = () => {
    const total = formData.products.reduce((acc, product) => {
      return acc + (parseFloat(product.total) || 0);
    }, 0);
    setFormData((prev) => ({ ...prev, total }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "clientCPF") {
      const client = clients.find((c) => c.cpf === value);
      if (client) {
        setFormData((prev) => ({
          ...prev,
          clientCPF: value,
          clientName: client.fullName,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          clientCPF: value,
          clientName: "",
        }));
      }
    }

    if (name === "warrantyPeriod") {
      calculateWarrantyExpiration(value);
    }
  };

  const calculateWarrantyExpiration = (period) => {
    const saleDate = new Date(formData.saleDate);
    if (period === "3 meses") {
      saleDate.setMonth(saleDate.getMonth() + 3);
    } else if (period === "6 meses") {
      saleDate.setMonth(saleDate.getMonth() + 6);
    } else if (period === "1 ano") {
      saleDate.setFullYear(saleDate.getFullYear() + 1);
    }
    const formattedDate = saleDate.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      warrantyExpiration: formattedDate,
    }));
  };

  const handleProductCodeChange = (index, code) => {
    const updatedProducts = [...formData.products];
    const foundProduct = productsList.find((p) => p.code === code);
    if (foundProduct) {
      updatedProducts[index] = {
        product: foundProduct._id,
        code,
        name: foundProduct.name,
        price: foundProduct.price,
        quantity: updatedProducts[index]?.quantity || 1,
        total: (
          foundProduct.price * (updatedProducts[index]?.quantity || 1)
        ).toFixed(2),
      };
    } else {
      updatedProducts[index] = {
        product: "",
        code,
        name: "",
        price: 0,
        quantity: 1,
        total: 0,
      };
    }
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const handleProductQuantityChange = (index, quantity) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index].quantity = parseInt(quantity, 10) || 1;
    updatedProducts[index].total = (
      updatedProducts[index].price * updatedProducts[index].quantity
    ).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const handleProductTotalChange = (index, total) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index].total = total; // Mantém como string temporariamente
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { product: "", code: "", name: "", price: 0, quantity: 1, total: 0 },
      ],
    }));
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.clientCPF ||
        !formData.seller ||
        !formData.paymentMethod ||
        formData.products.length === 0
      ) {
        alert("Preencha todos os campos obrigatórios!");
        return;
      }
      const client = clients.find((c) => c.cpf === formData.clientCPF);
      if (!client) {
        alert("Cliente não encontrado!");
        return;
      }
      const formattedProducts = formData.products.map((product) => ({
        product: product.product,
        quantity: product.quantity,
      }));
      const saleData = {
        client: client._id,
        products: formattedProducts,
        seller: formData.seller,
        paymentMethod: formData.paymentMethod,
        saleDate: formData.saleDate,
        warrantyPeriod: formData.warrantyPeriod,
        warrantyExpiration: formData.warrantyExpiration,
        notes: formData.notes,
        total: formData.total,
      };
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      if (response.ok) {
        alert("Venda cadastrada com sucesso!");
        router.push("/sales");
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao salvar a venda");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro de conexão com o servidor");
    }
  };

  return (
    <section>
      <div className={styles.formContainer}>
        <h1>Cadastrar Venda</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            CPF do Cliente:
            <input
              type="text"
              name="clientCPF"
              value={formData.clientCPF}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nome do Cliente:
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              readOnly
            />
          </label>
          <label>
            Vendedor:
            <select
              name="seller"
              value={formData.seller}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Loja">Loja</option>
              <option value="Vendedor 001">Vendedor 001</option>
              <option value="Vendedor 002">Vendedor 002</option>
              <option value="Vendedor 003">Vendedor 003</option>
            </select>
          </label>
          <label>
            Método de Pagamento:
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="PIX">PIX</option>
              <option value="débito">Débito</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartão">Cartão</option>
              <option value="boleto">Boleto</option>
            </select>
          </label>
          <label>
            Data da Venda:
            <input
              type="date"
              name="saleDate"
              value={formData.saleDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Garantia:
            <select
              name="warrantyPeriod"
              value={formData.warrantyPeriod}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="3 meses">3 meses</option>
              <option value="6 meses">6 meses</option>
              <option value="1 ano">1 ano</option>
            </select>
          </label>
          <label>
            Garantia expira em:
            <input
              type="date"
              name="warrantyExpiration"
              value={formData.warrantyExpiration}
              readOnly
            />
          </label>
          <label>
            Observações:
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
          <div>
            <h3>Produtos</h3>
            {formData.products.map((product, index) => (
              <div key={index} className={styles.productItem}>
                <label>
                  Código do Produto:
                  <input
                    type="text"
                    value={product.code || ""}
                    onChange={(e) =>
                      handleProductCodeChange(index, e.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Nome do Produto:
                  <input type="text" value={product.name} readOnly />
                </label>
                <label>
                  Preço Unitário:
                  <input
                    type="text"
                    value={
                      product.price ? `R$ ${product.price.toFixed(2)}` : ""
                    }
                    readOnly
                  />
                </label>
                <label>
                  Quantidade:
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductQuantityChange(index, e.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Total Produto:
                  <input
                    type="text"
                    value={product.total}
                    onChange={(e) =>
                      handleProductTotalChange(index, e.target.value)
                    }
                  />
                </label>
                <button type="button" onClick={() => removeProduct(index)} className={styles.btn}>
                  Remover
                </button>
              </div>
            ))}
            <button type="button" onClick={addProduct} className={styles.btn}>
              Adicionar Produto
            </button>
          </div>
          <p>
            <strong>Total Geral:</strong> R$ {formData.total.toFixed(2)}
          </p>
          <button type="submit">Salvar Venda</button>
        </form>
      </div>
    </section>
  );
}
