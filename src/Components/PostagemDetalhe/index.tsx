import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostagemDetalhe.module.css";

interface Comentario {
  _id: string;
  texto: string;
  autor: string;
  criadoEm: string;
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
  const [loading, setLoading] = useState(true);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    fetch(`https://backendpostagens.vercel.app/api/handler?type=postagensgeral&id=${id}`)
      .then(res => res.json())
      .then(dados => {
        setPostagem(dados);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar postagem:", err);
        setLoading(false);
      });
  }, [id]);

  const handleCurtir = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=postagensgeral&id=${id}`, {
        method: "PUT"
      });
      const atualizado = await res.json();
      setPostagem(atualizado);
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;
    try {
      const res = await fetch(`https://backendpostagens.vercel.app/api/handler?type=comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoComentario, autor: "Usuário", postId: id })
      });
      const atualizado = await res.json();
      setPostagem(atualizado);
      setNovoComentario("");
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
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
          <div className={styles.formGroup}>
            <textarea
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              placeholder="Escreva seu comentário..."
              className={styles.commentTextarea}
              rows={4}
            />
          </div>
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitCommentBtn}
              disabled={!novoComentario.trim()}
            >
              Publicar comentário
            </button>
          </div>
        </form>

        {/* Lista de Comentários */}
        <div className={styles.commentsList}>
          {postagem.comentarios && postagem.comentarios.length > 0 ? (
            postagem.comentarios.map(c => (
              <div key={c._id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAuthor}>
                    <div className={styles.authorAvatar}>
                      {c.autor.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.authorInfo}>
                      <strong className={styles.authorName}>{c.autor}</strong>
                      <time className={styles.commentTime}>
                        {new Date(c.criadoEm).toLocaleDateString('pt-BR', {
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
                  <p>{c.texto}</p>
                </div>
                <div className={styles.commentActions}>
                  <button className={styles.replyBtn}>Responder</button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noComments}>
              <p>Seja o primeiro a comentar!</p>
            </div>
          )}
        </div>
      </section>

      {/* Posts Relacionados (opcional) */}
      <section className={styles.relatedPosts}>
        <h3 className={styles.relatedTitle}>Leia também</h3>
        <div className={styles.relatedGrid}>
          {/* Aqui você pode adicionar posts relacionados */}
        </div>
      </section>
    </div>
  );
}