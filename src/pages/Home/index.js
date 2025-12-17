import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import engrenagem from "../../assets/icons/engrenagem.ico";
import job from "../../assets/icons/job.ico";
import shopping from "../../assets/icons/shop_store_business_sale_supermarket_icon_175937.ico";
import comunidade from "../../assets/icons/comunidade.ico";
import forum from "../../assets/icons/forum.ico";
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
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setResult("");
      }, 5000);
    }
  };

  return (
    <form className={style.contactForm} onSubmit={onSubmit}>
      <h3>Entre em Contato</h3>
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
        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
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

  // Função para filtrar as postagens
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
        
        // Verifica se a palavra ou frase existe em qualquer campo
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

  return (
    <main className={style.mainHome}>
      <Navbar />

      <div className={style.banner}>
        <Filtrarpostagem onFilter={filtrarPostagens} />
      </div>
      
      <div className={style.postagens}>
        {(!loading && postagensFiltradas.length > 0) ? (
          <div className={style.destaqueDoDia}>
            {(() => {
              const destaque = postagensFiltradas[0];
              return (
                <article className={style.destaqueCard} key={`destaque-${destaque.id}`}>
                    {destaque.imagem ? (
                      <figure className={style.destaqueImageWrapper}>
                        <img className={style.destaqueImage} src={destaque.imagem} alt={destaque.titulo || 'Destaque'} />
                        <figcaption className={style.destaqueImageCaption}>
                          <h2 className={style.destaqueTitle}>{destaque.titulo}</h2>
                          {destaque.data && <div className={style.destaqueDate}>{destaque.data}</div>}
                          {destaque.link && (
                            <a href={destaque.link} className={style.lerMais} target="_blank" rel="noopener noreferrer">Ler mais →</a>
                          )}
                        </figcaption>
                        
                      </figure>
                    ) : null}
                          <div className={style.containernavmobile}>
                            <div className={style.navmobile}>
                              <a href="/Notficacao" >
                                <img src={engrenagem} />
                                <h4 >Sistema</h4>
                              </a>
                              <a href="/Vagas" >
                                <img src={job} />
                                <h4 >Empregos</h4>
                              </a>
                              <a href="https://ecommerce-delta-ten-22.vercel.app/" >
                                <img src={shopping} />
                                <h4 >Loja</h4>
                              </a>
                              <a href="https://chat.whatsapp.com/FivMCudmv1wENlalqeIth0" >
                                <img src={comunidade} />
                                <h4 >Comunidade</h4>
                              </a>
                               <a href="/Forum" >
                                <img src={forum} />
                                <h4 >Fórum</h4>
                              </a>
                            </div>
                          </div>
                </article>
              )
            })()}
          </div>
        ) : null}

        <div className={style.containercentro}>
          <div className={style.menucentro}>
            <div className={style.Postagemcomfotos}>
              <h1>NOTÍCIAS :</h1>
              
              {termoFiltro && (
                <div className={style.resultadoBusca}>
                  <p>Resultados para: <strong>"{termoFiltro}"</strong></p>
                  <p className={style.contadorResultados}>
                    {postagensFiltradas.length} {postagensFiltradas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </p>
                </div>
              )}
              
              {loading ? (
                <div className={style.loading}>
                  <p>Carregando postagens...</p>
                </div>
              ) : postagensFiltradas.length === 0 ? (
                <div className={style.semResultados}>
                  <p>Nenhuma postagem encontrada{termoFiltro ? ` para "${termoFiltro}"` : ''}</p>
                </div>
              ) : (
                postagensFiltradas.slice(0).map(postagem => (
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
          
          <div className={style.contentcentro}>
             
            <div className={style.slide}>
                <ImageSlider /> 
            </div>
            
            <br/>
            <div className={style.sobre}>
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