import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import ImageSlider from "../../pages/slide/index";

function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Enviando...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "e68e9ef4-1970-49dd-9559-7f0e05cbc49a");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult("Mensagem enviada com sucesso!");
        event.target.reset();
      } else {
        setResult("Erro ao enviar a mensagem. Tente novamente.");
      }
    } catch (error) {
      setResult("Erro de conexão. Verifique sua internet.");
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setResult("");
      }, 5000);
    }
  };

  return (
    <form id="inbox" className={style.contactForm} onSubmit={onSubmit}>
      <h1>Fique por dentro</h1>
      <p>Receba as últimas notícias tech direto no seu inbox</p>
      <div className={style.linha}></div>
      
      <br/>
      
        <input 
          type="text" 
          id="name"
          name="name" 
          className={style.formInput}
          required 
          placeholder="Seu nome"
        />
      
      <br/>
      
        <input 
          type="email" 
          id="email"
          name="email" 
          className={style.formInput}
          required 
          placeholder="escolha seu melhor email"
        />
     
      
      <div className={style.formGroup}>
        <label htmlFor="message">Mensagem:</label>
        <textarea 
          id="message"
          name="message" 
          className={style.formTextarea}
          required 
          rows="4"
          placeholder="Digite sua mensagem aqui..."
        />
      </div>
      
      <button 
        type="submit" 
        className={style.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar"}
      </button>
      
      {result && (
        <div className={`
          ${style.resultMessage} 
          ${result.includes("sucesso") ? style.success : style.error}
        `}>
          {result}
        </div>
      )}
    </form>
  );
}

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
      <form className={style.formfiltragem}>
        <input 
          type="text" 
          placeholder="O que está procurando?" 
          className={style.filtragem} 
          value={this.state.value} 
          onChange={this.handleChange} 
        />
      </form>
    );
  }
}

function Home() {
  const [postagensComFoto, setPostagensComFoto] = useState([]);
  const [postagensFiltradas, setPostagensFiltradas] = useState([]);
  const [termoFiltro, setTermoFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/Dbjason/Postagemcomfotos.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar postagens');
        }
        return response.json();
      })
      .then((dados) => {
        setPostagensComFoto(dados);
        setPostagensFiltradas(dados);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro:', error);
        setLoading(false);
      });
  }, []);

  
  const filtrarPostagens = (termo) => {
    setTermoFiltro(termo);
    
    if (!termo.trim()) {
      setPostagensFiltradas(postagensComFoto);
    } else {
      const termoLower = termo.toLowerCase();
      const filtradas = postagensComFoto.filter(postagem => {
        const titulo = postagem.titulo?.toLowerCase() || '';
        const resumo = postagem.resumo?.toLowerCase() || '';
        const data = postagem.data?.toLowerCase() || '';
        const conteudo = postagem.conteudo?.toLowerCase() || '';
        
        return (
          titulo.includes(termoLower) ||
          resumo.includes(termoLower) ||
          data.includes(termoLower) ||
          conteudo.includes(termoLower)
        );
      });
      setPostagensFiltradas(filtradas);
    }
  };

  
  const postagemDestaque = termoFiltro && postagensFiltradas.length > 0 
    ? postagensFiltradas[0]  
    : postagensComFoto[0];   

  return (
    <main className={style.mainHome}>
      <Navbar />
      {!loading && postagensComFoto.length > 0 && (
        <div className={style.destaqueDoDia}>
          <article className={style.destaqueCard} key={`destaque-${postagemDestaque?.id || 'default'}`}>
            {postagemDestaque?.imagem ? (
              <figure className={style.destaqueImageWrapper}>
                <img 
                  className={style.destaqueImage} 
                  src={postagemDestaque.imagem} 
                  alt={postagemDestaque.titulo || 'Destaque'}
                />
                <figcaption className={style.destaqueImageCaption}>
                  <div className={style.banner}>
                    <Filtrarpostagem onFilter={filtrarPostagens} />
                  </div>
                  <h1 className={style.destaqueTitle}>
                    {termoFiltro && postagensFiltradas.length === 0 
                      ? postagemDestaque.titulo || "Destaque" 
                      : postagemDestaque.titulo || "Destaque"}
                  </h1>
                  {postagemDestaque.data &&  (
                    <div className={style.destaqueDate}>
                      {postagemDestaque.data}
                      </div>
                  )}
                  {postagemDestaque.link &&  (
                    <a 
                      href={postagemDestaque.link} 
                      className={style.lerMais} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Ler mais →
                    </a>
                  )}
                </figcaption>
              </figure>
            ) : null}
          </article>
        </div>
      )}
      
      {/* LISTA DE POSTAGENS FILTRADAS */}
      <div className={style.postagens}>
        
        <div className={style.containercentro}>
         
          <div className={style.menucentro}>
         <a href="#inbox" className={style.inbox} >
          <p >Receba as últimas notícias tech direto no seu inbox</p>
          </a>
            <div className={style.Postagemcomfotos}>
              {/* Mensagem de resultados da busca */}
              {termoFiltro && (
                <div className={style.resultadoBusca}>
                  <p>Resultados para: <strong>"{termoFiltro}"</strong></p>
                  <p className={style.contadorResultados}>
                    {postagensFiltradas.length} {postagensFiltradas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </p>
                </div>
              )}
              
              {/* Estado de carregamento */}
              {loading ? (
                <div className={style.loading}>
                  <p>Carregando postagens...</p>
                </div>
              ) : postagensFiltradas.length === 0 ? (
                <div className={style.semResultados}>
                  <p>Nenhuma postagem encontrada{termoFiltro ? ` para "${termoFiltro}"` : ''}</p>
                </div>
              ) : (
                postagensFiltradas.map(postagem => (
                  <div key={postagem.id} className={style.postagemComFoto}>
                    {postagem.imagem && (
                      <img 
                        src={postagem.imagem} 
                        alt={postagem.titulo || "Imagem da postagem"} 
                      />
                    )}
                    <div className={style.conteudo}>
                      <h3>{postagem.titulo || "Sem título"}</h3>
                      {postagem.data && (
                        <div className={style.data}>{postagem.data}</div>
                      )}
                      <p className={style.resumo}>
                        {postagem.resumo || "Resumo não disponível"}
                      </p>
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
          
          {/* Conteúdo lateral */}
          <div className={style.contentcentro}>
            
            <div className={style.sobre}>
               
              <div className={style.sobretexto}>
                <h3>Sobre o Site</h3>
              <div className={style.linha}></div>
              <br/>
              <p>
                O blog foi construído para mostrar novidades do mundo tech, 
                mostrar oportunidades de emprego na área, entregar um ambiente 
                de comunicação e evolução. Também tem a aba de loja, lá os 
                produtos são confiáveis e com direcionamento para plataformas 
                validadas e reais.
              </p>
              <p>
                Minha missão é ajudar você a fazer as melhores escolhas 
                tecnológicas e profissionais.
              </p>
              
              </div>
              <ImageSlider />
            </div>
            
            <br/>
            <ContactForm />
          </div>
        </div>
      </div>  
      
      <br/> 
      <Footer />         
    </main>
  );
}
export default Home;