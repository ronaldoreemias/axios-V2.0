import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostagemDetalhe.module.css";
import Navbar from "../NavbarDetalhes";

interface Comentario {
  _id: string;
  texto: string;
  autor: string;
  criadoEm: string;
  respostas?: Comentario[]; 
  postId?: string; 
  comentarioPaiId?: string; 
}

interface Postagem {
  _id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  artigo: string;
  autor: string;
  categoria: string;
  dataHora: string;
  likes?: number;
  comentarios?: Comentario[];
}

export default function PostagemDetalhe() {
  const { id } = useParams();
  const [postagem, setPostagem] = useState<Postagem | null>(null);
  const [ultimasNoticias, setUltimasNoticias] = useState<Postagem[]>([]); // NOVO ESTADO
  const [loading, setLoading] = useState(true);
  const [loadingUltimas, setLoadingUltimas] = useState(false); // NOVO LOADING
  const [novoComentario, setNovoComentario] = useState("");
  const [isNarrando, setIsNarrando] = useState(false);
  const [voz, setVoz] = useState<string>("Google português do Brasil");
  const [velocidade, setVelocidade] = useState(1);
  const [volume, setVolume] = useState(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState(""); // Novo estado para nome
  const [respondendoA, setRespondendoA] = useState<string | null>(null); // ID do comentário sendo respondido
  const [respostaTexto, setRespostaTexto] = useState(""); // Texto da resposta
  const [respostaNome, setRespostaNome] = useState(""); // Nome para resposta
  const [respondendoAutor, setRespondendoAutor] = useState<string>("");

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const carregarVozes = () => {
      const vozes = synthRef.current?.getVoices() || [];
      console.log("Vozes disponíveis:", vozes);
    };
    
    synthRef.current.onvoiceschanged = carregarVozes;
    carregarVozes();

    // Carregar postagem atual
    fetch(`https://backendpostagens.vercel.app/api/handler?type=postagensgeral&id=${id}`)
      .then(res => res.json())
      .then(dados => {
        setPostagem(dados);
        setLoading(false);
        
        // Após carregar a postagem, buscar últimas notícias
        carregarUltimasNoticias();
      })
      .catch(err => {
        console.error("Erro ao buscar postagem:", err);
        setLoading(false);
      });

    return () => {
      pararNarracao();
    };
  }, [id]);

  // Função para carregar últimas notícias
  const carregarUltimasNoticias = () => { // Remove o parâmetro não usado
    setLoadingUltimas(true);
    
    fetch("https://backendpostagens.vercel.app/api/handler?type=postagensgeral")
      .then(res => res.json())
      .then((dados: Postagem[]) => {
        // Filtrar para não incluir a postagem atual
        const outrasPostagens = dados.filter(p => p._id !== id);
        
        // Ordenar por data (mais recentes primeiro) e pegar 3
        const ultimas = outrasPostagens
          .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
          .slice(0, 3);
        
        setUltimasNoticias(ultimas);
        setLoadingUltimas(false);
      })
      .catch(err => {
        console.error("Erro ao buscar últimas notícias:", err);
        setLoadingUltimas(false);
      });
  };

  const iniciarNarracao = () => {
    if (!postagem || !synthRef.current) return;

    pararNarracao();

    const textoParaNarrar = `
      ${postagem.titulo}. 
      ${postagem.descricao}.
      ${postagem.artigo}
    `;

    const utterance = new SpeechSynthesisUtterance(textoParaNarrar);
    utteranceRef.current = utterance;

    // Configurar voz
    const vozes = synthRef.current.getVoices();
    const vozSelecionada = vozes.find(v => v.name.includes(voz)) || vozes.find(v => v.lang.includes('pt')) || vozes[0];
    
    if (vozSelecionada) {
      utterance.voice = vozSelecionada;
    }

    // Configurar parâmetros
    utterance.rate = velocidade;
    utterance.volume = volume;
    utterance.lang = 'pt-BR';

    // Event listeners
    utterance.onstart = () => setIsNarrando(true);
    utterance.onend = () => setIsNarrando(false);
    utterance.onerror = () => setIsNarrando(false);

    synthRef.current.speak(utterance);
  };

  const pararNarracao = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsNarrando(false);
    }
  };

  const pausarOuContinuarNarracao = () => {
    if (!synthRef.current) return;

    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsNarrando(true);
    } else if (synthRef.current.speaking) {
      synthRef.current.pause();
      setIsNarrando(false);
    }
  };

  const handleCurtir = async () => {
  if (!id) return;
  
  try {
    // FAÇA ASSIM:
    const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=postagensgeral&id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Adicione este header para evitar problemas CORS
        "Accept": "application/json"
      }
    });
    
    console.log("Status da resposta:", res.status); // Debug
    
    // VERIFIQUE se a resposta é válida
    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }
    
    // Tente parsear JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Resposta não é JSON");
    }
    
    const atualizado = await res.json();
    console.log("Postagem atualizada:", atualizado); // Debug
    
    setPostagem(atualizado);
    
  } catch (err) {
    console.error("Erro ao curtir:", err);
    
    // Mostra erro mas não quebra a página
    alert("Não foi possível curtir. Tente novamente.");
    
    // Mantém os dados atuais na tela
    // Não chame setPostagem(null) ou setLoading(true)
  }
};

    const handleComentar = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (respondendoA) {
        // Se está respondendo a um comentário
        if (!respostaTexto.trim() || !respostaNome.trim()) return;
        
        try {
          const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=comentario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              texto: respostaTexto, 
              autor: respostaNome, 
              postId: id,
              comentarioPaiId: respondendoA
            })
          });
          const atualizado = await res.json();
          setPostagem(atualizado);
          
          // Limpa TODOS os estados de resposta
          setRespostaTexto("");
          setRespostaNome("");
          setRespondendoA(null);
          setRespondendoAutor("");
          
        } catch (err) {
          console.error("Erro ao responder comentário:", err);
        }
      } else {
        // Se é um novo comentário principal
        if (!novoComentario.trim() || !nomeUsuario.trim()) return;
        
        try {
          const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=comentario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              texto: novoComentario, 
              autor: nomeUsuario, 
              postId: id 
            })
          });
          const atualizado = await res.json();
          setPostagem(atualizado);
          setNovoComentario("");
          setNomeUsuario("");
        } catch (err) {
          console.error("Erro ao comentar:", err);
        }
      }
    };

    const iniciarResposta = (comentarioId: string, autor: string) => {
      setRespondendoA(comentarioId);
      setRespondendoAutor(autor); 
      setRespostaTexto(`@${autor} `); 
      setRespostaNome("");
      
      // Rolagem suave para o formulário
      document.querySelector(`.${styles.commentForm}`)?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    };


  const handleCompartilhar = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: postagem?.titulo, text: postagem?.descricao, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Carregando postagem...</p>
    </div>
  );
  
  if (!postagem) return (
    <div className={styles.errorContainer}>
      <h2>Postagem não encontrada</h2>
      <p>A postagem que você está procurando não existe ou foi removida.</p>
    </div>
  );

  return (
    <div className={styles.cnnTemplateContainer}>
      <Navbar />
      <br/>
      {/* Cabeçalho estilo CNN */}
      <header className={styles.cnnHeader}>
        <div className={styles.categoryTag}>
          <span className={styles.categoryBadge}>{postagem.categoria}</span>
        </div>
        
        <h1 className={styles.mainTitle}>{postagem.titulo}</h1>
        
        <div className={styles.articleMeta}>
          <div className={styles.authorInfo}>
            <span className={styles.authorLabel}>Por</span>
            <strong className={styles.authorName}>{postagem.autor}</strong>
          </div>
          <time className={styles.publishDate}>
            {new Date(postagem.dataHora).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
        </div>

        {/* Lead/Resumo */}
        <div className={styles.articleLead}>
          <p className={styles.leadText}>{postagem.descricao}</p>
        </div>
      </header>


      {/* Imagem Principal */}
      <div className={styles.featuredImageContainer}>
        <img 
          src={postagem.imagem} 
          alt={postagem.titulo}
          className={styles.featuredImage}
        />
        <p className={styles.imageCaption}>
          Imagem: {postagem.titulo}
        </p>
      </div>

      {/* Conteúdo do Artigo */}
      <main className={styles.articleContent}>
        
      {/* Controles de Narração */}
      <div className={styles.narrationControls}>
        <h3 className={styles.narrationTitle}>
          <span className={styles.narrationIcon}></span> Ouvir Artigo
        </h3>
        
        <div className={styles.controlsRow}>
          <div className={styles.controlGroup}>
            <label htmlFor="vozSelect">Voz:</label>
            <select 
              id="vozSelect"
              value={voz}
              onChange={(e) => setVoz(e.target.value)}
              className={styles.controlSelect}
              disabled={isNarrando}
            >
              <option value="Google português do Brasil">Google Português</option>
              <option value="Microsoft Maria Desktop - Portuguese(Brazil)">Microsoft Maria</option>
              <option value="Luciana">Luciana (iOS)</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="velocidadeRange">Velocidade: {velocidade.toFixed(1)}x</label>
            <input
              id="velocidadeRange"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={velocidade}
              onChange={(e) => setVelocidade(parseFloat(e.target.value))}
              className={styles.controlRange}
              disabled={isNarrando}
            />
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="volumeRange">Volume: {Math.round(volume * 100)}%</label>
            <input
              id="volumeRange"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={styles.controlRange}
              disabled={isNarrando}
            />
          </div>
        </div>

        <div className={styles.narrationButtons}>
          <button
            onClick={iniciarNarracao}
            disabled={isNarrando}
            className={`${styles.narrationBtn} ${styles.playBtn}`}
          >
            <span className={styles.btnIcon}>▶️</span>
            <span>Ouvir Artigo</span>
          </button>

          <button
            onClick={pausarOuContinuarNarracao}
            className={`${styles.narrationBtn} ${styles.pauseBtn}`}
          >
            <span className={styles.btnIcon}>{isNarrando ? '⏸️' : '▶️'}</span>
            <span>{isNarrando ? 'Pausar' : 'Continuar'}</span>
          </button>

          <button
            onClick={pararNarracao}
            className={`${styles.narrationBtn} ${styles.stopBtn}`}
          >
            <span className={styles.btnIcon}>⏹️</span>
            <span>Parar</span>
          </button>
        </div>

        {isNarrando && (
          <div className={styles.narrationStatus}>
            <div className={styles.statusIndicator}></div>
            <span className={styles.statusText}>Narrando...</span>
          </div>
        )}
      </div>
        <div className={styles.contentWrapper}>
          <article className={styles.articleBody}>
            {postagem.artigo.split('\n').map((paragraph, index) => (
              <p key={index} className={styles.articleParagraph}>
                {paragraph}
              </p>
            ))}
          </article>

          {/* Sidebar de Ações */}
          <aside className={styles.actionSidebar}>
            <div className={styles.socialActions}>
              <button 
                onClick={handleCurtir}
                className={styles.likeButton}
              >
                <span className={styles.likeIcon}></span>
                <span className={styles.likeCount}>{postagem.likes || 0}</span>
                <span className={styles.likeLabel}>Curtir</span>
              </button>
              
              <button 
                onClick={handleCompartilhar}
                className={styles.shareButton}
              >
                <span className={styles.shareIcon}></span>
                <span className={styles.shareLabel}>Compartilhar</span>
              </button>
            </div>

            {/* Newsletter ou Anúncio */}
            <div className={styles.sidebarWidget}>
              <h4>Fique por dentro</h4>
              <p>Receba as últimas notícias diretamente no seu e-mail.</p>
              <a href="/Newsletter" >
                Cadastre-se
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Seção de Comentários */}
      <section className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h3 className={styles.commentsTitle}>Comentários</h3>
          <span className={styles.commentsCount}>
            {postagem.comentarios?.length || 0} comentários
          </span>
        </div>

        {/* Formulário de Comentário */}
          <form onSubmit={handleComentar} className={styles.commentForm}>
            <div className={styles.formHeader}>
              <h4>
                {respondendoA ? "Responder comentário" : "Adicionar comentário"}
              </h4>
              
              {respondendoA && (
                <div className={styles.replyingTo}>
                  <div className={styles.replyingToInfo}>
                    <span className={styles.replyingToLabel}>Respondendo a:</span>
                    <span className={styles.replyingToAuthor}>
                      <span className={styles.authorAvatarSmall}>
                        {respondendoAutor.charAt(0).toUpperCase()}
                      </span>
                      {respondendoAutor}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setRespondendoA(null);
                      setRespondendoAutor("");
                    }}
                    className={styles.cancelReplyBtn}
                  >
                    Cancelar resposta
                  </button>
                </div>
              )}
            </div>
            
            {/* Resto do formulário permanece igual */}
            <div className={styles.formGroup}>
              <input
                type="text"
                value={respondendoA ? respostaNome : nomeUsuario}
                onChange={(e) => respondendoA ? setRespostaNome(e.target.value) : setNomeUsuario(e.target.value)}
                placeholder="Seu nome"
                className={styles.nameInput}
                required
              />
            </div>
            

            
            <div className={styles.formGroup}>
              <textarea
                value={respondendoA ? respostaTexto : novoComentario}
                onChange={(e) => respondendoA ? setRespostaTexto(e.target.value) : setNovoComentario(e.target.value)}
                placeholder={respondendoA ? "Escreva sua resposta..." : "Escreva seu comentário..."}
                className={styles.commentTextarea}
                rows={4}
                required
              />
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitCommentBtn}
                disabled={respondendoA ? 
                  !respostaTexto.trim() || !respostaNome.trim() : 
                  !novoComentario.trim() || !nomeUsuario.trim()
                }
              >
                {respondendoA ? "Publicar resposta" : "Publicar comentário"}
              </button>
            </div>
          </form>
        {/* Lista de Comentários */}

        <div className={styles.commentsList}>
          {postagem.comentarios && postagem.comentarios.length > 0 ? (
            postagem.comentarios
              .filter(c => !c.comentarioPaiId) // Apenas comentários principais
              .map((c) => {
                const safeAutor = c.autor || "Usuário Anônimo";
                const safeId = c._id || `comment-${Date.now()}`;
                const safeCriadoEm = c.criadoEm ? new Date(c.criadoEm) : new Date();
                
                // Encontrar respostas para este comentário
                const respostas = postagem.comentarios?.filter(r => 
                  r.comentarioPaiId === c._id
                ) || [];
                
                return (
                  <div key={safeId} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAuthor}>
                        <div className={styles.authorAvatar}>
                          {safeAutor.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.authorInfo}>
                          <strong className={styles.authorName}>{safeAutor}</strong>
                          <time className={styles.commentTime}>
                            {safeCriadoEm.toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.commentBody}>
                      <p>{c.texto || ""}</p>
                    </div>
                    
                    <div className={styles.commentActions}>
                      <button 
                        onClick={() => iniciarResposta(safeId, safeAutor)}
                        className={styles.replyBtn}
                      >
                        
                        Responder
                      </button>
                      
                      {respostas.length > 0 && (
                        <span className={styles.replyCount}>
                          {respostas.length} resposta{respostas.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    {/* Seção de Respostas */}
                    {respostas.length > 0 && (
                      <div className={styles.repliesSection}>
                        {respostas.map((resposta, index) => {
                          const safeRespostaAutor = resposta.autor || "Usuário Anônimo";
                          const safeRespostaId = resposta._id || `reply-${index}`;
                          const safeRespostaData = resposta.criadoEm ? 
                            new Date(resposta.criadoEm) : new Date();
                          
                          return (
                            <div key={safeRespostaId} className={styles.replyItem}>
                              <div className={styles.replyHeader}>
                                <div className={styles.replyAuthor}>
                                  <div className={styles.replyAvatar}>
                                    {safeRespostaAutor.charAt(0).toUpperCase()}
                                  </div>
                                  <div className={styles.replyAuthorInfo}>
                                    <strong>{safeRespostaAutor}</strong>
                                    <time>
                                      {safeRespostaData.toLocaleDateString('pt-BR', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </time>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.replyBody}>
                                <p>{resposta.texto || ""}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <div className={styles.noComments}>
              <p>Seja o primeiro a comentar!</p>
            </div>
          )}
        </div>
      </section>

      {/* Posts Relacionados */}
        <section className={styles.relatedPosts}>
          <h3 className={styles.relatedTitle}>Leia também</h3>
          
          {loadingUltimas ? (
            <div className={styles.loadingUltimas}>
              <p>Carregando notícias...</p>
            </div>
          ) : ultimasNoticias.length > 0 ? (
            <div className={styles.relatedGrid}>
              {ultimasNoticias.map((noticia) => (
                <a 
                  key={noticia._id} 
                  href={`/postagensgeral/${noticia._id}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageContainer}>
                    <img 
                      src={noticia.imagem} 
                      alt={noticia.titulo}
                      className={styles.relatedImage}
                    />
                    <span className={styles.relatedCategory}>
                      {noticia.categoria}
                    </span>
                  </div>
                  <div className={styles.relatedContent}>
                    <h4 className={styles.relatedCardTitle}>{noticia.titulo}</h4>
                    <p className={styles.relatedCardDesc}>
                      {noticia.descricao.length > 100 
                        ? `${noticia.descricao.substring(0, 100)}...` 
                        : noticia.descricao}
                    </p>
                    <div className={styles.relatedMeta}>
                      <span className={styles.relatedAuthor}>{noticia.autor}</span>
                      <time className={styles.relatedDate}>
                        {new Date(noticia.dataHora).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </time>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.noRelatedPosts}>
              <p>Não há outras notícias no momento.</p>
            </div>
          )}
        </section>
    </div>
  );
}