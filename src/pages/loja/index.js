import style from "./Loja.module.css";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import React, { useState, useEffect } from "react";

function ProcurarProduto({ onSearch }) {
  const [produto, setProduto] = useState("");

  const handleChange = (event) => {
    setProduto(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <form className={style.searchForm}>
      <input
        type="text"
        placeholder="Procure seu produto aqui..."
        value={produto}
        onChange={handleChange}
      />
    </form>
  );
}

function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/Dbjason/Produtos.json")
      .then((response) => response.json())
      .then((dados) => {
        setProdutos(dados || []);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro:", error);
        setProdutos([]);
        setCarregando(false);
      });
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    if (!p) return false;
    const titulo = p.titulo || '';
    const descricao = p.descricao || '';
    const termo = filtro.toLowerCase();
    
    return titulo.toLowerCase().includes(termo) || 
           descricao.toLowerCase().includes(termo);
  });

  const abrirLink = (link, titulo) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert(`Link não disponível para: ${titulo}`);
    }
  };

  return (
    <>
      <Navbar />
      <main className={style.mainLoja}>
        <div className={style.banner}>
          <div className={style.bannerContent}>
            <h1>loja Axios</h1>
            <ProcurarProduto onSearch={setFiltro} />
          </div>
        </div>

        <div className={style.container}>
          {carregando ? (
            <div className={style.carregando}>
              <p>Carregando...</p>
            </div>
          ) : (
            <div className={style.gridProdutos}>
              {produtosFiltrados.map((produto) => (
              
                <div key={produto.titulo} className={style.card}>
                  <div className={style.imagemContainer}>
                    <img 
                      src={produto.imagem} 
                      alt={produto.titulo}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className={style.info}>
                    <h3>{produto.titulo}</h3>
                    <p className={style.descricao}>{produto.descricao}</p>
                    
                    <div className={style.precoArea}>
                      <span className={style.preco}>{produto.preco}</span>
                      {produto.desconto && (
                        <span className={style.desconto}>{produto.desconto}</span>
                      )}
                    </div>
                    
                    <button 
                      className={style.botao}
                      onClick={() => abrirLink(produto.link, produto.titulo)}
                    >
                      Ver Oferta
                    </button>
                  </div>
                </div>
              ))}
              
              {produtosFiltrados.length === 0 && !carregando && (
                <div className={style.semResultados}>
                  <p>Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
    
  );
}

export default Loja;