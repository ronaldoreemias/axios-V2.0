import Style from "./Produtos.module.css";
import { useState, useEffect } from "react";

function Produtos(){
      const [produtos, setProdutos] = useState<any[]>([]);
    
      useEffect(() => {
        fetch("/Dbjason/Produtosvariados.json")
          .then(response => response.json())
          .then(data => {
            setProdutos(data);
          });
      }, []);
    return(
         <div className={Style.container}>
            <div className={Style.header}>
               <div className={Style.cabecaheade}>
                    <div className={Style.cabecaheader}>
                        <h3>CATEGORIA</h3>
                    </div>
               </div>
                <div className={Style.containercategoria} >
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-111d4ee81a591253da7f8a9fc2775860@resize_w320_nl.webp"/>
                        <p>Feminino</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-ddde92a5906baa3bfe6d6ebd3832d202@resize_w320_nl.webp"/>
                        <p>Masculino</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-3a92b15549fcbb1ba5e5558dfdb72b61@resize_w320_nl.webp"/>
                        <p>Acessorios</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-69c63b2deabe837ed5f41fd5d9b84762@resize_w320_nl.webp"/>
                        <p>Ferramentas</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-773325c18738086306fabc0b9e54e0b6@resize_w320_nl.webp"/>
                        <p>calçados</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-ec8b334cc84f8c9db7932d6f49003051@resize_w320_nl.webp"/>
                        <p>Infantil Feminino</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-3372b5b1d85ce6313c01eca39ab1702f@resize_w320_nl.webp"/>
                        <p>Brinquedos</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-d0c33a566139eb229b8b467915cc8a85@resize_w320_nl.webp"/>
                        <p>Bebê</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-b3a21ba2259bc0ad9cdd17c2ff6b2e14@resize_w320_nl.webp"/>
                        <p>Console</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-a3689d12b70b379edaff062e303b2125@resize_w320_nl.webp"/>
                        <p>Eletrônicos</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-3954d5e52cc8b3db4c50d0015e9b7ac7@resize_w320_nl.webp"/>
                        <p>Computadores</p>
                    </div>
                    <div>
                        <img src="https://down-br.img.susercontent.com/file/br-50009109-f75dafaf3bb9337529bb3cf30c262ba4@resize_w320_nl.webp"/>
                        <p>Marketing</p>
                    </div>
                </div>
            </div>
            <div className={Style.content}>
                <div className={Style.produtosderoupa}>
                   {produtos.length > 0 ? (
                        produtos
                        .slice()
                        .reverse()
                        .map((produto) => (
                            <div key={produto.id} className={Style.produtoCard}>
                            <div className={Style.produtoImagemContainer}>
                                <img 
                                src={produto.imagem} 
                                alt={produto.titulo}
                                onClick={() => {
                                    if (produto.link) {
                                    window.open(produto.link, '_blank');
                                    }
                                }}
                                className={Style.produtoImagem}
                                />
                                {produto.desconto && (
                                <span className={Style.descontoTag}>{produto.desconto}</span>
                                )}
                            </div>
                            <div className={Style.produtoInfo}>
                                <h4 className={Style.produtoTitulo}>{produto.titulo}</h4>
                                <p className={Style.produtoDescricao}>{produto.descricao}</p>
                                <div className={Style.produtoPreco}>
                                <span>{produto.preco}</span>
                                </div>
                                <button 
                                className={Style.botaoComprar}
                                onClick={() => {
                                    if (produto.link) {
                                    window.open(produto.link, '_blank');
                                    }
                                }}
                                disabled={!produto.link}
                                >
                                {produto.link ? "Comprar Agora" : "Indisponível"}
                                </button>
                            </div>
                            </div>
                        ))
                        ) : (
                        <div className={Style.semProdutos}>
                            <p>Nenhum produto encontrado</p>
                        </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Produtos;