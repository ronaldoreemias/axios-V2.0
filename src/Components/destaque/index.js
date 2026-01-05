import React, { useState, useEffect } from "react";
import style from "./destaque.module.css";

function Destaque() {
  const [postagensComFoto, setPostagensComFoto] = useState([]);
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
    return <p>Carregando...</p>;
  }

  const ultimasPostagens = postagensComFoto.slice(0, 4).reverse();

  return (
    <div className={style.Destaque}>
      {ultimasPostagens.map((post, index) => (
            <div
            className={style[`Destaque${index + 1}`]}
            style={{
                color: "white",
                position: "relative"
            }}
            >
        
            {index === 0 ? (
                // Destaque1 com todas as informações
                <div className={style.overlay}>
                <a href={post.link} target="_blank" >
                    <img src={post.imagem} alt={post.titulo} />
                </a>
                <h2>{post.titulo}</h2>
                <p>{post.resumo}</p>
                <p>{post.descricao}</p>
                </div>
            ) 
            : (
                // Apenas imagem nos demais
                <a href={post.link} target="_blank" >
                    <img src={post.imagem} alt={post.titulo} className={style.imgOnly} />
                </a>
            )}
            </div>
        ))}
    </div>
  );
}

export default Destaque;
