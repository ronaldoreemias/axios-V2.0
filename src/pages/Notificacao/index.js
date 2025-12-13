import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import style from "./Notificacao.module.css";
import React, { useState, useEffect } from "react";

function importAll(r) {
    const images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}

// importa todos os ícones de src/assets/icons (nomes de arquivos podem ser usados no JSON)
const icons = importAll(require.context('../../assets/bugimagem', false, /\.(png|jpe?g|svg|JPG|PNG)$/));

function Notificacao(){
    const [postagensSemFoto, setPostagensSemFoto] = useState([]);

      useEffect(() => {
        fetch('/Dbjason/Postagenssemfoto.json')
          .then((response) => response.json())
          .then((dados) => setPostagensSemFoto(dados));
      }, []);


    return(
        <>
            <Navbar />
                <div>
        <div className={style.headercentro}>
            <br/>
            <div className={style.Postagenssemfoto}>
                {postagensSemFoto.map(postagem => (
                <div key={postagem.id} className={style.postagemSemFoto}>
                    <h3>{postagem.titulo}</h3>
                        <div className={style.data}>{postagem.data}</div>
                            <p className={style.resumo}>{postagem.resumo}</p>
                                {postagem.link && (
                                    <a 
                                        href={postagem.link} 
                                        className={style.lerMais}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ler mais →
                                    </a>
                                    )}
                                <br/>
                                 {(() => {
                                    const filenameFromUrl = postagem.imagemurl ? postagem.imagemurl.split('/').pop() : null;
                                    const resolvedImage = icons[postagem.imagem] ||
                                     (filenameFromUrl ? icons[filenameFromUrl] : null) ||
                                      postagem.imagemurl || postagem.imagem || null;
                                    return resolvedImage ? (
                                        <img
                                            src={resolvedImage}
                                            alt={postagem.titulo || "Imagem da postagem"}
                                            className={style.postagemImage}
                                        />
                                    ) : null;
                                })()}
                                <p className={style.assinatura}>{postagem.assinatura}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Notificacao;