import { useState, useEffect } from "react";
import style from "./destaque.module.css";

interface Postagem {
  _id: string;
  imagem: string;
  titulo: string;
  descricao: string;
  autor?: string;
  categoria?: string;
  dataHora?: string;
}

function Destaque() {
  const [postagensComFoto, setPostagensComFoto] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://backendpostagens.vercel.app/api/handler?type=postagensgeral');
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const dados = await response.json();
        
        // Filtrar postagens que têm imagem
        const postagensComImagem = dados.filter((post: Postagem) => 
          post.imagem && post.imagem.trim() !== ""
        );
        
        setPostagensComFoto(postagensComImagem);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar postagens:', error);
        setError('Não foi possível carregar as postagens. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostagens();
  }, []);

  if (loading) {
    return (
      <div className={style.containerExterno}>
        <div className={style.loadingContainer}>
          <div className={style.spinner}></div>
          <p>Carregando destaques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.containerExterno}>
        <div className={style.errorContainer}>
          <p className={style.errorMessage}> {error}</p>
        </div>
      </div>
    );
  }

  if (postagensComFoto.length === 0) {
    return (
      <div className={style.containerExterno}>
        <div className={style.emptyContainer}>
          <p className={style.emptyMessage}>Nenhuma postagem com imagem encontrada.</p>
        </div>
      </div>
    );
  }

  // Ordenar por data mais recente (se tiver dataHora) e pegar as 4 mais recentes
  const ultimasPostagens = [...postagensComFoto]
    .sort((a, b) => {
      if (a.dataHora && b.dataHora) {
        return new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime();
      }
      return 0;
    })
    .slice(0, 4);

  // Função para construir o link da postagem
  const buildPostLink = (postId: string): string => {
    return `https://axiosnoticias.vercel.app/postagensgeral/${postId}`;
  };

  return (
    <div className={style.containerExterno}>
      <div className={style.Destaque}>
        {ultimasPostagens.map((post, index) => {
          const postLink = buildPostLink(post._id);
          
          return (
            <div
              key={post._id}
              className={style[`Destaque${index + 1}`]}
            >
              <a 
                href={postLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={style.linkCobertura}
                aria-label={`Ler: ${post.titulo}`}
              ></a>
              
              <div className={style.imagemContainer}>
                <img 
                  src={post.imagem} 
                  alt={post.titulo}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove(style.hidden);
                  }}
                />
                
              </div>
              
              {index === 0 ? (
                // Destaque principal
                <div className={style.overlayPrincipal}>
                  <h2>{post.titulo}</h2>
                  {post.autor && (
                    <div className={style.autorInfo}>
                      <span>{post.autor}</span>
                    </div>
                  )}
                </div>
              ) : (
                // Destaques menores
                <div className={style.outros}>
                  <h2>{post.titulo}</h2>
                  {post.autor && (
                    <div className={style.autorInfoPequeno}>
                      <span>{post.autor}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Destaque;