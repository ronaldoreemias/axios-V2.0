import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./PostagemDetallhes.module.css";
import Navbar from "../../components/Navbar";

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

interface ValidationError {
  field: string;
  message: string;
}

export default function PostagemDetalhe() {
  const { id } = useParams();
  const [postagem, setPostagem] = useState<Postagem | null>(null);
  const [ultimasNoticias, setUltimasNoticias] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUltimas, setLoadingUltimas] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [isNarrando, setIsNarrando] = useState(false);
  const [voz, setVoz] = useState<string>("Google português do Brasil");
  const [velocidade, setVelocidade] = useState(1);
  const [volume, setVolume] = useState(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [respondendoA, setRespondendoA] = useState<string | null>(null);
  const [respostaTexto, setRespostaTexto] = useState("");
  const [respostaNome, setRespostaNome] = useState("");
  const [respondendoAutor, setRespondendoAutor] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Lista de padrões suspeitos
  const suspiciousPatterns = {
    sqlInjection: [
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FROM|WHERE)\b/i,
      /('|")?(\s*)?(\-\-|\#)/,
      /(\bOR\b|\bAND\b)(\s+)?(\d+)?(\s+)?[=<>]/i,
      /(\s*)?;(\s*)?(\w+)?(\s*)?$/,
      /(\%27|\'|\"|\-\-|\/\*|\*\/|char|nchar|varchar|nvarchar|alter|begin|cast|create|cursor|declare|delete|drop|end|exec|execute|fetch|insert|kill|open|select|sys|sysobject|syscolumns|table|update)\b/i
    ],
    xssAndScripts: [
      /<script\b[^>]*>(.*?)<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /alert\s*\(/i,
      /document\./i,
      /window\./i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<applet/i,
      /vbscript:/i,
      /expression\s*\(/i
    ],
    testContent: [
      /^\s*(teste|test|testing|testando|verificando|verificar|checando|checar|testar|check|testando comentário|comentário de teste|teste de comentário)\s*$/i,
      /^\s*(123|abc|aaa|bbb|ccc|xyz|qwerty|asdf|zxcv|demo|sample|exemplo)\s*$/i,
      /^\s*([a-z])\1{2,}\s*$/i,
      /^\s*\d+\s*$/,
      /^\s*[#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+\s*$/
    ],
    maliciousUrls: [
      /(http|https):\/\/(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/i,
      /\.(exe|bat|cmd|sh|php|asp|aspx|jsp|py|pl|rb|jar|war)$/i,
      /(phishing|malware|virus|trojan|worm|spyware|adware|ransomware)/i
    ],
    profanity: [
      /(odeio|caralho|porra|merda|foda|foder|puta|vagabunda|viado|bicha|corn[o|a]|chupa|pinto|buceta|xoxota|rola|pau)/i,
      /(fuck|shit|asshole|bitch|whore|slut|dick|cock|pussy|cunt|nigger|nigga|retard)/i
    ]
  };

  // Função para validar entradas
  const validateInput = (field: string, value: string): string | null => {
    if (!value.trim()) {
      return `${field} não pode estar vazio`;
    }

    // Verifica padrões suspeitos
    for (const [category, patterns] of Object.entries(suspiciousPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(value)) {
          switch (category) {
            case 'sqlInjection':
              return ` Conteúdo suspeito detectado: Possível tentativa de SQL injection`;
            case 'xssAndScripts':
              return ` Conteúdo suspeito detectado: Possível código malicioso (XSS/scripts)`;
            case 'testContent':
              return ` Conteúdo parece ser de teste. Por favor, insira um conteúdo real`;
            case 'maliciousUrls':
              return ` URL suspeita detectada`;
            case 'profanity':
              return ` Conteúdo inadequado detectado`;
            default:
              return ` Conteúdo suspeito detectado`;
          }
        }
      }
    }

    // Validações específicas por campo
    switch (field) {
      case 'texto':
        if (value.length < 2) return 'Comentário deve ter pelo menos 2 caracteres';
        if (value.length > 1000) return 'Comentário muito longo (máx. 1000 caracteres)';
        
        // Verifica se é apenas um comentário muito curto e genérico
        const shortGenericPatterns = [
          /^[!?.,\s]+$/,
          /^[a-zA-Z]{1,2}$/,
          /^ok$/i,
          /^sim$/i,
          /^não$/i,
          /^legal$/i,
          /^nice$/i,
          /^good$/i,
          /^bom$/i
        ];
        
        for (const pattern of shortGenericPatterns) {
          if (pattern.test(value.trim())) {
            return 'Por favor, escreva um comentário mais substantivo';
          }
        }
        break;
      
      case 'autor':
        if (value.length > 100) return 'Nome do autor muito longo (máx. 100 caracteres)';
        
        const invalidAuthorPatterns = [
          /^[0-9]+$/,
          /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
          /^(admin|administrator|root|system|user|test|tester)$/i,
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
        ];
        
        for (const pattern of invalidAuthorPatterns) {
          if (pattern.test(value.trim())) {
            return 'Nome de autor inválido';
          }
        }
        break;
    }

    return null;
  };

  // Validação em tempo real para comentários principais
  const handleComentarioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNovoComentario(value);
    
    // Validação em tempo real
    const error = validateInput('texto', value);
    setValidationErrors(prev => {
      const filtered = prev.filter(err => err.field !== 'texto');
      if (error) {
        return [...filtered, { field: 'texto', message: error }];
      }
      return filtered;
    });
  };

  // Validação em tempo real para nome do usuário
  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNomeUsuario(value);
    
    const error = validateInput('autor', value);
    setValidationErrors(prev => {
      const filtered = prev.filter(err => err.field !== 'autor');
      if (error) {
        return [...filtered, { field: 'autor', message: error }];
      }
      return filtered;
    });
  };

  // Validação em tempo real para resposta
  const handleRespostaTextoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRespostaTexto(value);
    
    const error = validateInput('texto', value);
    setValidationErrors(prev => {
      const filtered = prev.filter(err => err.field !== 'resposta_texto');
      if (error) {
        return [...filtered, { field: 'resposta_texto', message: error }];
      }
      return filtered;
    });
  };

  // Validação em tempo real para nome da resposta
  const handleRespostaNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRespostaNome(value);
    
    const error = validateInput('autor', value);
    setValidationErrors(prev => {
      const filtered = prev.filter(err => err.field !== 'resposta_autor');
      if (error) {
        return [...filtered, { field: 'resposta_autor', message: error }];
      }
      return filtered;
    });
  };

  // Função para obter erro de um campo específico
  const getFieldError = (fieldName: string): string | null => {
    const error = validationErrors.find(err => err.field === fieldName);
    return error ? error.message : null;
  };

  // Validação completa antes de enviar
  const validateComentario = (): boolean => {
    const errors: ValidationError[] = [];

    if (respondendoA) {
      const errorTexto = validateInput('texto', respostaTexto);
      if (errorTexto) errors.push({ field: 'resposta_texto', message: errorTexto });

      const errorAutor = validateInput('autor', respostaNome);
      if (errorAutor) errors.push({ field: 'resposta_autor', message: errorAutor });
    } else {
      const errorTexto = validateInput('texto', novoComentario);
      if (errorTexto) errors.push({ field: 'texto', message: errorTexto });

      const errorAutor = validateInput('autor', nomeUsuario);
      if (errorAutor) errors.push({ field: 'autor', message: errorAutor });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const carregarVozes = () => {
      const vozes = synthRef.current?.getVoices() || [];
      console.log("Vozes disponíveis:", vozes);
    };
    
    synthRef.current.onvoiceschanged = carregarVozes;
    carregarVozes();

    fetch(`https://backendpostagens.vercel.app/api/handler?type=postagensgeral&id=${id}`)
      .then(res => res.json())
      .then(dados => {
        setPostagem(dados);
        setLoading(false);
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

  const carregarUltimasNoticias = () => { 
    setLoadingUltimas(true);
    
    fetch("https://backendpostagens.vercel.app/api/handler?type=postagensgeral")
      .then(res => res.json())
      .then((dados: Postagem[]) => {
        const outrasPostagens = dados.filter(p => p._id !== id);
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

    const vozes = synthRef.current.getVoices();
    const vozSelecionada = vozes.find(v => v.name.includes(voz)) || vozes.find(v => v.lang.includes('pt')) || vozes[0];
    
    if (vozSelecionada) {
      utterance.voice = vozSelecionada;
    }

    utterance.rate = velocidade;
    utterance.volume = volume;
    utterance.lang = 'pt-BR';

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
      const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=postagensgeral&id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      
      const atualizado = await res.json();
      setPostagem(atualizado);
      
    } catch (err) {
      console.error("Erro ao curtir:", err);
      alert("Não foi possível curtir. Tente novamente.");
    }
  };

  const handleComentar = async (e: FormEvent) => {
    e.preventDefault();
    
    // Valida antes de enviar
    if (!validateComentario()) {
      alert("Por favor, corrija os erros no formulário antes de enviar.");
      return;
    }
    
    if (respondendoA) {
      try {
        const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=comentario`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            texto: respostaTexto.trim(), 
            autor: respostaNome.trim(), 
            postId: id,
            comentarioPaiId: respondendoA
          })
        });
        const atualizado = await res.json();
        setPostagem(atualizado);
        
        // Limpa estados
        setRespostaTexto("");
        setRespostaNome("");
        setRespondendoA(null);
        setRespondendoAutor("");
        setValidationErrors([]);
        
      } catch (err) {
        console.error("Erro ao responder comentário:", err);
        alert("Erro ao enviar resposta. Tente novamente.");
      }
    } else {
      try {
        const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=comentario`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            texto: novoComentario.trim(), 
            autor: nomeUsuario.trim(), 
            postId: id 
          })
        });
        const atualizado = await res.json();
        setPostagem(atualizado);
        
        // Limpa estados
        setNovoComentario("");
        setNomeUsuario("");
        setValidationErrors([]);
        
      } catch (err) {
        console.error("Erro ao comentar:", err);
        alert("Erro ao enviar comentário. Tente novamente.");
      }
    }
  };

  const iniciarResposta = (comentarioId: string, autor: string) => {
    setRespondendoA(comentarioId);
    setRespondendoAutor(autor); 
    setRespostaTexto(`@${autor} `); 
    setRespostaNome("");
    setValidationErrors([]);
    
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
    <>
    <Helmet>
      <title>{postagem?.titulo || 'Notícia'} | Axios News - Notícias de Tecnologia</title>
      <meta 
        name="description" 
        content={postagem?.descricao || 'Leia as últimas notícias de tecnologia, vagas e oportunidades no Axios News'} 
      />
      <meta 
        name="keywords" 
        content={`${postagem?.categoria || 'tecnologia'}, notícias, tecnologia, ${postagem?.autor || 'artigo'}`} 
      />
      <meta name="author" content={postagem?.autor || 'Axios News'} />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={postagem?.titulo || 'Notícia'} />
      <meta property="og:description" content={postagem?.descricao || 'Leia no Axios News'} />
      <meta property="og:image" content={postagem?.imagem || 'https://axiosnews.vercel.app/og-image.jpg'} />
      <meta property="og:url" content={`https://axiosnews.vercel.app/postagensgeral/${id}`} />
      <meta property="article:published_time" content={postagem?.dataHora} />
      <meta property="article:author" content={postagem?.autor || 'Axios News'} />
      <meta property="article:section" content={postagem?.categoria || 'Notícias'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={postagem?.titulo || 'Notícia'} />
      <meta name="twitter:description" content={postagem?.descricao || 'Leia no Axios News'} />
      <meta name="twitter:image" content={postagem?.imagem || 'https://axiosnews.vercel.app/og-image.jpg'} />
      <link rel="canonical" href={`https://axiosnews.vercel.app/postagensgeral/${id}`} />
    </Helmet>
    <Navbar />
    <br/>
    <br/>
    <br/>
    <div className={styles.cnnTemplateContainer}>
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

        <div className={styles.articleLead}>
          <p className={styles.leadText}>{postagem.descricao}</p>
        </div>
      </header>

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

            <div className={styles.sidebarWidget}>
              <h4>Fique por dentro</h4>
              <p>Receba as últimas notícias diretamente no seu e-mail.</p>
              <a href="/Newsletter">
                Cadastre-se
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Seção de Comentários com validação */}
      <section className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h3 className={styles.commentsTitle}>Comentários</h3>
          <span className={styles.commentsCount}>
            {postagem.comentarios?.length || 0} comentários
          </span>
        </div>

        {/* Formulário de Comentário com validação */}
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
                    setValidationErrors([]);
                  }}
                  className={styles.cancelReplyBtn}
                >
                  Cancelar resposta
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              value={respondendoA ? respostaNome : nomeUsuario}
              onChange={respondendoA ? handleRespostaNomeChange : handleNomeChange}
              placeholder="Seu nome"
              className={`${styles.nameInput} ${
                getFieldError(respondendoA ? 'resposta_autor' : 'autor') ? styles.inputError : ''
              }`}
              required
            />
            {getFieldError(respondendoA ? 'resposta_autor' : 'autor') && (
              <div className={styles.errorMessage}>
                {getFieldError(respondendoA ? 'resposta_autor' : 'autor')}
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <textarea
              value={respondendoA ? respostaTexto : novoComentario}
              onChange={respondendoA ? handleRespostaTextoChange : handleComentarioChange}
              placeholder={respondendoA ? "Escreva sua resposta..." : "Escreva seu comentário..."}
              className={`${styles.commentTextarea} ${
                getFieldError(respondendoA ? 'resposta_texto' : 'texto') ? styles.inputError : ''
              }`}
              rows={4}
              required
            />
            {getFieldError(respondendoA ? 'resposta_texto' : 'texto') && (
              <div className={styles.errorMessage}>
                {getFieldError(respondendoA ? 'resposta_texto' : 'texto')}
              </div>
            )}
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitCommentBtn}
            >
              {respondendoA ? "Publicar resposta" : "Publicar comentário"}
            </button>
          </div>
        </form>

        {/* Lista de Comentários */}
        <div className={styles.commentsList}>
          {postagem.comentarios && postagem.comentarios.length > 0 ? (
            postagem.comentarios
              .filter(c => !c.comentarioPaiId)
              .map((c) => {
                const safeAutor = c.autor || "Usuário Anônimo";
                const safeId = c._id || `comment-${Date.now()}`;
                const safeCriadoEm = c.criadoEm ? new Date(c.criadoEm) : new Date();
                
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
    </>
  );
}