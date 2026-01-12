import { useState, useEffect } from "react";
import style from "./destaque.module.css";

interface Postagem {
  link: string;
  imagem: string;
  titulo: string;
  resumo: string;
}

function Destaque() {
  const [postagensComFoto, setPostagensComFoto] = useState<Postagem[]>([]);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{textAlign: 'center', padding: '20px', fontSize: '0.8rem'}}>Carregando...</div>;
  }

  // Pega as 4 últimas postagens
  const ultimasPostagens = postagensComFoto.slice(0, 4);

  return (
    <div className={style.containerExterno}>
      <div className={style.Destaque}>
        {ultimasPostagens.map((post, index) => (
          <div
            key={index}
            className={style[`Destaque${index + 1}`]}
          >
            <a 
              href={post.link} 
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
              />
            </div>
            
            {index === 0 ? (
              // Destaque principal com título apenas (resumo oculto)
              <div className={style.overlayPrincipal}>
                <h2>{post.titulo}</h2>
              </div>
            ) : (
              // Destaques menores apenas título
              <div className={style.outros}>
                <h2>{post.titulo}</h2>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destaque;