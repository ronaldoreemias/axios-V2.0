import Navbar from "../../components/NavbarLoja";
import Style from "./Loja.module.css";
import ImageSlider from "../SlideLoja/index";
import celular from "../../assets/iconesbutton/mobile_102860.ico";
import notebook from "../../assets/iconesbutton/notebook_computer_laptop_icon_185946.ico";
import computador from "../../assets/iconesbutton/computer_115306.ico";
import monitor from "../../assets/iconesbutton/monitor_icon-icons.com_74441.ico";
import teclado from "../../assets/iconesbutton/keyboardbasicflat_106016.ico";
import mouse from "../../assets/iconesbutton/mousemachd_106073.ico";
import filt from "../../assets/iconesbutton/filtering_icon_246394.ico";
import controle from "../../assets/iconesbutton/game_console_market_icon_228249.ico";
import { useState, useEffect } from "react";


function Loja() {
  const [filtro, setFiltro] = useState("Todos");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([]);

  useEffect(() => {
    fetch("/Dbjason/Produtos.json")
      .then(response => response.json())
      .then(data => {
        setProdutos(data);
        setProdutosFiltrados(data);
      });
  }, []);

  function filtrar(categoria: string) {
    setFiltro(categoria);

    if (categoria === "Todos") {
      setProdutosFiltrados(produtos);
    } else {
      const filtrados = produtos.filter(produto => produto.categoria === categoria);
      setProdutosFiltrados(filtrados);
    }
  }

  return (
    <div className={Style.Bodyloja}>
      <Navbar />
      <div className={Style.Body}>
        <div className={Style.container}>
          <div className={Style.header}>
            <div className={Style.containerbaner}>
              <div className={Style.headerbaner}>
                
              </div>
              <div className={Style.contentbaner}>
                <ImageSlider />
              </div>
              <div className={Style.footerbaner}>
                <button onClick={() => filtrar("Todos")}>
                  <img src={filt} alt="Notebook" className={Style.todos} />
                </button>
                <button onClick={() => filtrar("console")}>
                  <img src={controle} alt="console" />
                  Console
                </button>
                <button onClick={() => filtrar("Celular")}>
                  <img src={celular} alt="Celular" />
                  Celular
                </button>
                <button onClick={() => filtrar("Notebook")}>
                  <img src={notebook} alt="Notebook" />
                  Notebook
                </button>
                <button onClick={() => filtrar("Computador")}>
                  <img src={computador} alt="Computador" />
                  Computador
                </button>
                <button onClick={() => filtrar("Monitor")}>
                  <img src={monitor} alt="Monitor" />
                  Monitor
                </button>
                <button onClick={() => filtrar("Teclado")}>
                  <img src={teclado} alt="Teclado" />
                  Teclado
                </button>
                <button onClick={() => filtrar("Mouse")}>
                  <img src={mouse} alt="Mouse" />
                  Mouse
                </button>
              </div>
            </div>
          </div>
          
          <div className={Style.Produtos}>
            <div className={Style.containerprodutos}>
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => (
                  <div key={produto.id} className={Style.produtoCard}>
                    <div className={Style.produtoImagemContainer}>
                      <img 
                        src={produto.imagem} 
                        alt={produto.titulo}
                        className={Style.produtoImagem}
                      />
                      {produto.desconto && (
                        <span className={Style.descontoTag}>{produto.desconto}</span>
                      )}
                    </div>
                    <div className={Style.produtoInfo}>
                      <h4 className={Style.produtoTitulo}>{produto.titulo}</h4>
                      <p className={Style.produtoDescricao}>{produto.descricao}</p>
                      <div className={Style.produtoPreco}>
                        <span>{produto.preco}</span>
                      </div>
                      <button 
                        className={Style.botaoComprar}
                        onClick={() => {
                          if (produto.link) {
                            window.open(produto.link, '_blank');
                          }
                        }}
                        disabled={!produto.link}
                      >
                        {produto.link ? "Comprar Agora" : "Indisponível"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={Style.semProdutos}>
                  <p>Nenhum produto encontrado na categoria "{filtro}"</p>
                </div>
              )}
            </div>
          </div>
          
          <div className={Style.Footer}>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loja;