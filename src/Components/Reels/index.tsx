import { useEffect, useState, useRef } from "react";
import style from "./Reels.module.css";

type ReelPost = {
  id: string;
  titulo: string;
  imagem: string;
};

function Reels() {
  const [posts, setPosts] = useState<ReelPost[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const carrosselRef = useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadReels() {
      try {
        setLoading(true);
        const res = await fetch("https://backendpostagens.vercel.app/api/comentarios?type=postagem");
        const data = await res.json();

        const ultimas = data.slice(0, 6);

        const filtradas: ReelPost[] = ultimas.map((post: any) => ({
          id: post._id,
          titulo: post.titulo,
          imagem: post.imagem
        }));

        // Duplicar os itens para criar o efeito de loop infinito
        const duplicatedPosts = [...filtradas, ...filtradas, ...filtradas];
        setPosts(duplicatedPosts);
        
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar reels:", err);
        setError("Não foi possível carregar o carrossel");
      } finally {
        setLoading(false);
      }
    }

    loadReels();
    
    // Cleanup function
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const handleReelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Pausar a animação
    setIsPaused(true);
    
    // Limpar timeout anterior
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Retomar automaticamente após 5 segundos
    pauseTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const handleReelItemClick = (e: React.MouseEvent) => {
    handleReelClick(e);
    window.open(`https://reels-delta-eosin.vercel.app`);
  };

  const resumeAnimation = () => {
    setIsPaused(false);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  const pauseAnimation = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  if (loading) {
    return (
      <div className={style.Container}>
        <div className={style.skeletonContainer}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={style.skeletonItem}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.Container}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className={style.Container}>
      {/* Controles do Carrossel */}
      <div className={style.controls}>
        <button 
          className={style.controlBtn}
          onClick={pauseAnimation}
          aria-label="Pausar carrossel"
          type="button"
        >
          ⏸️
        </button>
        <button 
          className={style.controlBtn}
          onClick={resumeAnimation}
          aria-label="Retomar carrossel"
          type="button"
        >
          ▶️
        </button>
      </div>

      {/* Faixa do Carrossel */}
      <div 
        ref={carrosselRef}
        className={`${style.carrosselTrack} ${isPaused ? style.paused : ''}`}
      >
        {posts.map((post, index) => (
          <a
            key={`${post.id}-${index}`}
            href={`https://reels-delta-eosin.vercel.app`}
            className={style.ReelItem}
            onClick={(e) => handleReelItemClick(e)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Badge de Pausa */}
            <div className={style.pauseBadge}>
              {isPaused ? 'RETOMAR' : 'CLIQUE PARA PAUSAR'}
            </div>
            
            {/* Indicador de Status */}
            <div className={style.statusIndicator}>
              <div className={style.statusDot}></div>
              <span className={style.statusText}>
                {isPaused ? 'PAUSADO' : 'AO VIVO'}
              </span>
            </div>
            
            {/* Imagem */}
            <img 
              src={post.imagem} 
              alt={post.titulo}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            />
            
            {/* Título */}
            <div className={style.titulo}>
              <p>{post.titulo}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Indicador de Progresso */}
      <div className={style.progressContainer}>
        {[1, 2, 3].map((dot) => (
          <div 
            key={dot}
            className={`${style.progressDot} ${isPaused ? '' : style.active}`}
            onClick={resumeAnimation}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                resumeAnimation();
              }
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Reels;