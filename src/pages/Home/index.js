import React, { useState, useEffect, Component } from "react";
import style from "./Home.module.css";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

class Filtrarpostagem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    if (this.props.onFilter) {
      this.props.onFilter(event.target.value);
    }
  }

  render() {
    return(
      <form className={style.formfiltragem} >
          <input 
            type="text" 
            placeholder="🔍 O que está procurando ?" 
            className={style.filtragem} 
            value={this.state.value} 
            onChange={this.handleChange} 
          />
      </form>
    );
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    alert('Um email foi enviado: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form className={style.form} onSubmit={this.handleSubmit}>
        <div>
            <h3>Newsletter</h3>
            <div className={style.linha}></div>
        </div>
        <p>Receba as últimas novidades do mundo tech diretamente no seu email</p>
        <label>
          <input type="text" className={style.inputtexto} placeholder="digite seu melhor email..." value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" className={style.botaoenviar} value="enviar" />
      </form>
    );
  }
}

function Home() {
  const [postagensComFoto, setPostagensComFoto] = useState([]);
  const [postagensFiltradas, setPostagensFiltradas] = useState([]);
  const [termoFiltro, setTermoFiltro] = useState('');

  useEffect(() => {
    fetch('/Dbjason/Postagemcomfotos.json')
      .then((response) => response.json())
      .then((dados) => {
        setPostagensComFoto(dados);
        setPostagensFiltradas(dados); // Inicialmente mostra todas as postagens
      });
  }, []);

  // Função para filtrar as postagens
  const filtrarPostagens = (termo) => {
    setTermoFiltro(termo);
    
    if (!termo.trim()) {
      // Se o termo estiver vazio, mostra todas as postagens
      setPostagensFiltradas(postagensComFoto);
    } else {
      // Filtra as postagens pelo termo de busca
      const termoLower = termo.toLowerCase();
      const filtradas = postagensComFoto.filter(postagem => 
        postagem.titulo.toLowerCase().includes(termoLower) ||
        postagem.resumo.toLowerCase().includes(termoLower) ||
        postagem.data.toLowerCase().includes(termoLower)
      );
      setPostagensFiltradas(filtradas);
    }
  };

  return (
    <main className={style.mainHome}>
      <Navbar />
      <br/>
      <div className={style.banner}>
        <h1>Sua rede de tecnologia</h1>
        <br/>
        <p>As últimas novidades, análises e dicas do mundo tech</p>
        <Filtrarpostagem onFilter={filtrarPostagens} />
      </div>
      <div className={style.postagens}>
        <div className={style.containercentro}>
          <div className={style.menucentro}>
            <div className={style.Postagemcomfotos}>
              {/* Mostra mensagem quando não há resultados */}
              {postagensFiltradas.length === 0 && termoFiltro ? (
                <div className={style.semResultados}>
                  <p>Nenhuma postagem encontrada para "{termoFiltro}"</p>
                </div>
              ) : (
                // Renderiza as postagens filtradas
                postagensFiltradas.map(postagem => (
                  <div key={postagem.id} className={style.postagemComFoto}>
                    <img src={postagem.imagem} alt={postagem.titulo} />
                    <div className={style.conteudo}>
                      <h3>{postagem.titulo}</h3>
                      <div className={style.data}>{postagem.data}</div>
                      <p className={style.resumo}>{postagem.resumo}</p>
                      {postagem.link && (
                        <a 
                          href={postagem.link} 
                          className={style.lerMais}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ler mais →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className={style.contentcentro}>
            <div className={style.sobre}>
              <h3>Sobre o Site</h3>
              <div className={style.linha}></div>
              <br/>
              <p>O blog foi construido para mostrar novidades do mundo tec, mostrar oportunidades de emprego na área,
                entregar um hambiente de comunicação e evolução. Também tem a aba de loja, lá os produtos são confiaveis
                  e com direcionamento para plataformas validadas e reais.

                  Minha missão é ajudar você a 
                  fazer as melhores escolhas 
                  tecnológicas e profissinal.</p>
            </div>
            <br/>
            <NameForm />
          </div>
        </div>
      </div>  
      <br/> 
      <Footer />         
    </main>
  );
}

export default Home;