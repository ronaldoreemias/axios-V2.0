import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import style from "./Notificacao.module.css";
import React, { useState, useEffect } from "react";

function Notificacao(){
    const [postagensSemFoto, setPostagensSemFoto] = useState([]);

      useEffect(() => {
        fetch('/Dbjason/Postagenssemfoto.json')
          .then((response) => response.json())
          .then((dados) => setPostagensSemFoto(dados));
      }, []);


    return(
        <div className={style.Mainnotficacao}>
            <Navbar />
                <div>
        <div className={style.headercentro}>
            <div className={style.baner}>
                <div className={style.areatextolink}>
                    <div className={style.texto}>
                        
                    </div>
                    <div className={style.link}>
                        <h2>Notificações do sistema</h2>
                    </div>
                </div>
                <div className={style.fotodocriador}>
                    <img  />
                </div>
            </div>
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            <Footer />
        </div>
    );
}

export default Notificacao;