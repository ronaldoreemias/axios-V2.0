import { useState, useEffect } from "react";
import style from "./destaque.module.css";

interface Postagem {
  link: string;
  imagem: string;
  titulo: string;
  resumo: string;
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
            key={index} 
            >
        
            {index === 0 ? (
                
                <div className={style.overlay}>
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                        <img src={post.imagem} alt={post.titulo} />
                    </a>
                    <h2>{post.titulo}</h2>
                   
                    {isAxiosNewsLink(post.link) && <AxiosNewsAviso />}
                    <p>{post.resumo}</p>
                </div>
            ) 
            : (
                
                <div className={style.outros} >
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      <img src={post.imagem} alt={post.titulo} className={style.imgOnly} />
                      <h2>{post.titulo}</h2>
                    </a>
                   
                    {isAxiosNewsLink(post.link) && <AxiosNewsAviso />}
                </div>
            )}
            </div>
        ))}
    </div>
  );
}

export default Destaque;