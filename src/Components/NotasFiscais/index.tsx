import { useState, useEffect } from "react";
import style from "./NotasFiscais.module.css";


interface Postagem {
  _id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  artigo: string;
  autor: string;
  categoria: string;
  dataHora: string;
}

function PostagensGerais() {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backendpostagens.vercel.app/api/handler?type=postagensgeral")
      .then(res => res.json())
      .then(dados => {
        setPostagens(dados);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar postagens:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className={style.loadingContainer}>
      <div className={style.loadingSpinner}></div>
      <p className={style.loadingText}>Carregando postagens...</p>
    </div>
  );

  // Agrupar por categoria
  const categorias = Array.from(new Set(postagens.map(p => p.categoria)));

  if (postagens.length === 0) return (
    <div className={style.emptyState}>
      <h3>Nenhuma postagem encontrada</h3>
      <p>As postagens serão exibidas aqui assim que estiverem disponíveis.</p>
    </div>
  );

  return (
    <div className={style.postagensNoticias}>
      {/* Lista por Categorias */}
      {categorias.map((cat, catIndex) => {
        const postsCategoria = postagens.filter(p => p.categoria === cat);
        const featuredPost = postsCategoria[0];
        const otherPosts = postsCategoria.slice(1);

        return (
          <section 
            key={cat} 
            className={style.categorySection}
            style={{ animationDelay: `${catIndex * 0.1}s` }}
          >
            {/* Cabeçalho da Categoria com link para ver mais */}
            <div className={style.categoryHeader}>
              <h2 className={style.categoryTitle}>{cat}</h2>
              <span className={style.categoryBadge}>
                {postsCategoria.length} post{postsCategoria.length !== 1 ? 's' : ''}
              </span>
            </div>


            {/* Grid de Postagens */}
            <div className={style.postsGrid}>
              {/* Postagem em Destaque (primeira) */}
              {featuredPost && (
                <article className={`${style.postCard} ${style.featuredPost}`}>
                  <div className={style.postImageContainer}>
                   <a href={`/postagensgeral/${featuredPost._id}`} >
                        <img 
                          src={featuredPost.imagem} 
                          alt={featuredPost.titulo} 
                          className={style.postImage}
                        />
                    </a>
                    <div className={style.imageOverlay}></div>
                  </div>
                  <div className={style.postContent}>
                    <h3 className={style.postTitle}>
                      <a href={`/postagensgeral/${featuredPost._id}`}>
                        {featuredPost.titulo}
                      </a>
                    </h3>
                    <div className={style.postMeta}>
                      <div className={style.authorInfo}>
                        <span className={style.authorName}>{featuredPost.autor}</span>
                      </div>
                      <time className={style.postDate}>
                        {new Date(featuredPost.dataHora).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    <a 
                      href={`/postagensgeral/${featuredPost._id}`}
                      className={style.readMoreLink}
                    >
                      Ler mais
                    </a>
                  </div>
                </article>
              )}

              {/* Outras postagens da categoria */}
              {otherPosts.map(post => (
                <article key={post._id} className={style.postCard}>
                  <div className={style.postImageContainer}>
                    
                    <a href={`/postagensgeral/${post._id}`} >
                        <img 
                          src={post.imagem} 
                          alt={post.titulo} 
                          className={style.postImage}
                        />
                    </a>
                    <div className={style.imageOverlay}></div>
                  </div>
                  <div className={style.postContent}>
                    <h3 className={style.postTitle}>
                      <a href={`/postagensgeral/${post._id}`}>
                        {post.titulo}
                      </a>
                    </h3>
                    <p className={style.postExcerpt}>
                      {post.descricao.length > 120 
                        ? `${post.descricao.substring(0, 120)}...` 
                        : post.descricao}
                    </p>
                    <div className={style.postMeta}>
                      <div className={style.authorInfo}>
                        <span className={style.authorName}>{post.autor}</span>
                      </div>
                      <time className={style.postDate}>
                        {new Date(post.dataHora).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </time>
                    </div>
                    <a 
                      href={`/postagensgeral/${post._id}`}
                      className={style.readMoreLink}
                    >
                      Ler mais
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default PostagensGerais;