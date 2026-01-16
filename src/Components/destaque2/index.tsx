import { useState, useEffect } from "react";
import style from "./destaque.module.css";

interface Postagem {
  _id: string; // ID da postagem
  imagem: string;
  titulo: string;
  descricao: string;
  // Adicione outros campos se necessário
  autor?: string;
  categoria?: string;
  dataHora?: string;
}

// Componente para exibir o aviso Axios News
const AxiosNewsAviso: React.FC = () => (
  <div className={style.axiosAviso}>
    notícia do Axios News
  </div>
);

// Função para verificar se o link é do domínio especificado
const isAxiosNewsLink = (link: string): boolean => {
  return link.includes('https://noticiashoje-eight.vercel.app');
};

// Função para construir o link da postagem
const buildPostLink = (postId: string): string => {
  return `https://axiosnoticias.vercel.app/postagensgeral/${postId}`;
};

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
      <div className={style.loadingContainer}>
        <div className={style.spinner}></div>
        <p>Carregando destaques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.errorContainer}>
        <p className={style.errorMessage}>⚠️ {error}</p>
      </div>
    );
  }

  if (postagensComFoto.length === 0) {
    return (
      <div className={style.emptyContainer}>
        <p className={style.emptyMessage}>Nenhuma postagem com imagem encontrada.</p>
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
    .slice(0, 3);

  return (
    <div className={style.destaque}>
      {ultimasPostagens.map((post, index) => {
        const postLink = buildPostLink(post._id);
        
        return (
          <div
            className={`${style.destaqueItem} ${style[`destaque${index + 1}`]}`}
            key={post._id}
          >
            {index === 0 ? (
              // Destaque principal
              <div className={style.destaquePrincipal}>
                <a 
                  href={postLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={style.destaqueLink}
                >
                  <div className={style.imagemContainer}>
                    <img 
                      src={post.imagem} 
                      alt={post.titulo} 
                      className={style.destaqueImagem}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove(style.hidden);
                      }}
                    />
                  </div>
                  <div className={style.conteudoPrincipal}>
                    <h2 className={style.tituloPrincipal}>{post.titulo}</h2>
                    {isAxiosNewsLink(postLink) && <AxiosNewsAviso />}
                    <p className={style.descricaoPrincipal}>{post.descricao}</p>
                    <div className={style.metadados}>
                      {post.autor && (
                        <span className={style.autor}>Por {post.autor}</span>
                      )}
                      {post.categoria && (
                        <span className={style.categoria}>{post.categoria}</span>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ) : (
              // Outros destaques
              <div className={style.outroDestaque}>
                <a 
                  href={postLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={style.destaqueLink}
                >
                  <div className={style.outroImagemContainer}>
                    <img 
                      src={post.imagem} 
                      alt={post.titulo} 
                      className={style.outroImagem}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove(style.hidden);
                      }}
                    />
                    
                  </div>
                  <div className={style.outroConteudo}>
                    <h3 className={style.outroTitulo}>{post.titulo}</h3>
                    {isAxiosNewsLink(postLink) && <AxiosNewsAviso />}
                    {post.autor && (
                      <span className={style.outroAutor}>Por {post.autor}</span>
                    )}
                  </div>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Destaque;