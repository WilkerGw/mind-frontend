import React, { useState, useEffect } from "react";
import styles from "../components/Styles/Form.module.css";
import { mask } from "remask";

const ClientForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    phone: "",
    birthDate: "",
    gender: "",
    address: "",
    cep: "",
    receiptImage: "",
    notes: "",
    possuiReceita: false,
    longe: {
      esfericoDireito: "",
      cilindricoDireito: "",
      eixoDireito: "",
      esfericoEsquerdo: "",
      cilindricoEsquerdo: "",
      eixoEsquerdo: "",
      adicao: "",
    },
    perto: {
      esfericoDireito: "",
      cilindricoDireito: "",
      eixoDireito: "",
      esfericoEsquerdo: "",
      cilindricoEsquerdo: "",
      eixoEsquerdo: "",
      adicao: "",
    },
    vencimentoReceita: "",
  });

  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (type === "checkbox") {
      newValue = checked;
    }

    if (name === "cpf") {
      newValue = mask(newValue, ["999.999.999-99"]);
    } else if (name === "phone") {
      newValue = mask(newValue, ["(99) 99999-9999"]);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");
    setFormData((prevState) => ({
      ...prevState,
      [parent]: {
        ...prevState[parent],
        [child]: value,
      },
    }));
  };

  const fetchAddressByCep = async (cep) => {
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
      } else {
        setFormData((prevState) => ({
          ...prevState,
          address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (e) => {
    const { value } = e.target;
    const maskedValue = mask(value, ["99999-999"]);

    setFormData((prevState) => ({
      ...prevState,
      cep: maskedValue,
    }));

    if (maskedValue.length === 9) {
      fetchAddressByCep(maskedValue.replace("-", ""));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nome Completo
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          CPF
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Telefone
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Data de Nascimento
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gênero
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </label>
        <label>
          CEP
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleCepChange}
            required
          />
        </label>
        {cepLoading && <p>Buscando endereço...</p>}
        <label>
          Endereço
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Observações
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>
        <label>
          Possui Receita
          <input
            type="checkbox"
            name="possuiReceita"
            checked={formData.possuiReceita}
            onChange={handleChange}
          />
        </label>
        {formData.possuiReceita && (
          <>
            <div className={styles.containerLonge}>
              <h3 className={styles.titleLonge}>LONGE</h3>
              <div className={styles.direitoLonge}>
                <div className={styles.labelContainer}>
                  <label>
                    OD Esférico
                    <input
                      type="text"
                      name="longe.esfericoDireito"
                      value={formData.longe.esfericoDireito}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OD Cilíndrico
                    <input
                      type="text"
                      name="longe.cilindricoDireito"
                      value={formData.longe.cilindricoDireito}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OD Eixo
                    <input
                      type="text"
                      name="longe.eixoDireito"
                      value={formData.longe.eixoDireito}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className={styles.esquerdoLonge}>
                <div className={styles.labelContainer}>
                  <label>
                    OE Esférico
                    <input
                      type="text"
                      name="longe.esfericoEsquerdo"
                      value={formData.longe.esfericoEsquerdo}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OE Cilíndrico
                    <input
                      type="text"
                      name="longe.cilindricoEsquerdo"
                      value={formData.longe.cilindricoEsquerdo}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OE Eixo
                    <input
                      type="text"
                      name="longe.eixoEsquerdo"
                      value={formData.longe.eixoEsquerdo}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className={styles.labelContainer}>
                <label>
                  Adição
                  <input
                    type="text"
                    name="longe.adicao"
                    value={formData.longe.adicao}
                    onChange={handleNestedChange}
                  />
                </label>
              </div>
            </div>

            <div className={styles.containerPerto}>
              <h3 className={styles.titlePerto}>PERTO</h3>
              <div className={styles.direitoPerto}>
                <div className={styles.labelContainer}>
                  <label>
                    OD Esférico
                    <input
                      type="text"
                      name="perto.esfericoDireito"
                      value={formData.perto.esfericoDireito}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OD Cilíndrico
                    <input
                      type="text"
                      name="perto.cilindricoDireito"
                      value={formData.perto.cilindricoDireito}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OD Eixo
                    <input
                      type="text"
                      name="perto.eixoDireito"
                      value={formData.perto.eixoDireito}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className={styles.esquerdoPerto}>
                <div className={styles.labelContainer}>
                  <label>
                    OE Esférico
                    <input
                      type="text"
                      name="perto.esfericoEsquerdo"
                      value={formData.perto.esfericoEsquerdo}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OE Cilíndrico
                    <input
                      type="text"
                      name="perto.cilindricoEsquerdo"
                      value={formData.perto.cilindricoEsquerdo}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
                <div className={styles.labelContainer}>
                  <label>
                    OE Eixo
                    <input
                      type="text"
                      name="perto.eixoEsquerdo"
                      value={formData.perto.eixoEsquerdo}
                      onChange={handleNestedChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className={styles.labelContainer}>
                <label>
                  Adição
                  <input
                    type="text"
                    name="perto.adicao"
                    value={formData.perto.adicao}
                    onChange={handleNestedChange}
                  />
                </label>
              </div>
            </div>

            <label>
              Vencimento da Receita
              <input
                type="date"
                name="vencimentoReceita"
                value={formData.vencimentoReceita}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}
        <button type="submit" className={styles.clFormButton}>
          Enviar
        </button>
      </form>
    </section>
  );
};

export default ClientForm;
