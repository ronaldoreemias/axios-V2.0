import React, { useEffect, useState } from "react";

const DestaqueVagas = () => {
  const [vagas, setVagas] = useState([]);
  const [vagasFiltradas, setVagasFiltradas] = useState([]);

  useEffect(() => {
    fetch("/Dbjason/Vagas.json")
      .then((response) => response.json())
      .then((dados) => {
        setVagas(dados);
        setVagasFiltradas(dados);
      })
      .catch((error) => {
        console.error("Erro ao carregar vagas:", error);
      });
  }, []);

  
  const ultimasVagas = vagasFiltradas.slice(0, 4);

  return (
    <div style={styles.container}>
      {ultimasVagas.map((vaga, index) => (
        <div key={index} style={styles.card}>
          <h3 style={styles.titulo}>{vaga.Vaga}</h3>
          {vaga.Descrição && <p style={styles.descricao}>{vaga.Descrição}</p>}
          <p style={styles.local}>{vaga.Local || "Local não informado"}</p>
          {vaga.link_site_da_empresa && (
            <a
              href={vaga.link_site_da_empresa}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Ver mais
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "100%",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  titulo: {
    margin: "0 0 5px 0",
    fontSize: "16px",
    fontWeight: "bold",
  },
  descricao: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    color: "#555",
  },
  local: {
    margin: "0 0 5px 0",
    fontSize: "13px",
    fontStyle: "italic",
    color: "#777",
  },
  link: {
    fontSize: "13px",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default DestaqueVagas;
