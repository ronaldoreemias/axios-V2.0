import { useEffect, useState } from "react";
import style from "./Reels.module.css";

type ReelPost = {
  id: string;
  titulo: string;
  imagem: string;
};

function Reels() {
  const [posts, setPosts] = useState<ReelPost[]>([]);


  useEffect(() => {
    async function loadReels() {
      try {
        const res = await fetch("https://backendpostagens.vercel.app/api/comentarios?type=postagem");
        const data = await res.json();

        
        const ultimas = data.slice(0, 3);

        
        const filtradas: ReelPost[] = ultimas.map((post: any) => ({
            id: post._id,
            titulo: post.titulo,
            imagem: post.imagem
        }));


        setPosts(filtradas);
      } catch (err) {
            console.error("Erro ao carregar reels:", err);
      }
    }

    loadReels();
  }, []);

  return (
    <div className={style.Container}>
      {posts.map(post => (
        <a
          key={post.id}
          href={`https://reels-delta-eosin.vercel.app/reel/${post.id}`}
          className={style.ReelItem}
        >
          <img src={post.imagem} alt={post.titulo} />
            <div className={style.titulo} >
                <p>{post.titulo}</p>
            </div>
        </a>
      ))}
    </div>
  );
}

export default Reels;
