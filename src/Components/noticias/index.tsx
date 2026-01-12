import  { useState, useEffect } from "react";
import style from "./Noticias.module.css";
import React from "react";

interface Postagem {
  id?: string;
  link: string;
  imagem: string;
  titulo: string;
  resumo: string;
  data?: string;
  conteudo?: string;
}

interface Props {
  onFilter?: (termo: string) => void;
}

interface State {
  value: string;
}

class Filtrarpostagem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState({ value });

    if (this.props.onFilter) {
      this.props.onFilter(value);
    }
  }

  render() {
    return (
      <form className={style.formfiltragem}>
        <input
          type="text"
          placeholder="O que está procurando?"
          className={style.filtragem}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}


function NoticiasGeral() {
    const [postagensComFoto, setPostagensComFoto] = useState<Postagem[]>([]);
    const [postagensFiltradas, setPostagensFiltradas] = useState<Postagem[]>([]);
    const [termoFiltro, setTermoFiltro] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/Dbjason/Postagemcomfotos.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar postagens");
                }
                return response.json();
            })
            .then((dados) => {
                setPostagensComFoto(dados);
                setPostagensFiltradas(dados);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro:", error);
                setLoading(false);
            });
    }, []);

    const filtrarPostagens = (termo: string) => {
        setTermoFiltro(termo);

        if (!termo.trim()) {
            setPostagensFiltradas(postagensComFoto);
        } else {
            const termoLower = termo.toLowerCase();
            const filtradas = postagensComFoto.filter((postagem) => {
                const titulo = postagem.titulo?.toLowerCase() || "";
                const resumo = postagem.resumo?.toLowerCase() || "";
                const data = postagem.data?.toLowerCase() || "";
                const conteudo = postagem.conteudo?.toLowerCase() || "";

                return titulo.includes(termoLower) || resumo.includes(termoLower) || data.includes(termoLower) || conteudo.includes(termoLower);
            });
            setPostagensFiltradas(filtradas);
        }
    };

    // Garantir que postagemDestaque não seja undefined
    const postagemDestaque = React.useMemo(() => {
        if (termoFiltro && postagensFiltradas.length > 0) {
            return postagensFiltradas[0];
        }
        return postagensComFoto.length > 0 ? postagensComFoto[0] : null;
    }, [termoFiltro, postagensFiltradas, postagensComFoto]);

    return (
        <div className={style.caixagrande}>
            {/* DESTAQUE DO DIA */}
            {!loading && postagemDestaque && (
                <div className={style.destaqueDoDia}>
                    <article className={style.destaqueCard} key={`destaque-${postagemDestaque.id || "default"}`}>
                        {postagemDestaque.imagem && (
                            <figure className={style.destaqueImageWrapper}>
                                <img className={style.destaqueImage} src={postagemDestaque.imagem} alt={postagemDestaque.titulo || "Destaque"} />
                                <figcaption className={style.destaqueImageCaption}>
                                    <div className={style.banner}>
                                        <Filtrarpostagem onFilter={filtrarPostagens} />
                                    </div>
                                    <h1 className={style.destaqueTitle}>{postagemDestaque.titulo || "Destaque"}</h1>
                                    {postagemDestaque.data && <div className={style.destaqueDate}>{postagemDestaque.data}</div>}
                                    {postagemDestaque.link && (
                                        <a href={postagemDestaque.link} className={style.lerMais} target="_blank" rel="noopener noreferrer">
                                            Ler mais →
                                        </a>
                                    )}
                                </figcaption>
                            </figure>
                        )}
                    </article>
                </div>
            )}

            {/* LISTA DE POSTAGENS FILTRADAS */}
            <div className={style.postagens}>
                {/* Mensagem de resultados da busca */}
                {termoFiltro && (
                    <div className={style.resultadoBusca}>
                        <p>
                            Resultados para: <strong>"{termoFiltro}"</strong>
                        </p>
                        <p className={style.contadorResultados}>
                            {postagensFiltradas.length} {postagensFiltradas.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                        </p>
                    </div>
                )}

                <div className={style.containercentro}>
                    <div className={style.menucentro}>
                        <div className={style.Postagemcomfotos}>
                            {/* Estado de carregamento */}
                            {loading ? (
                                <div className={style.loading}>
                                    <p>Carregando postagens...</p>
                                </div>
                            ) : postagensFiltradas.length === 0 ? (
                                <div className={style.semResultados}>
                                    <p>Nenhuma postagem encontrada{termoFiltro ? ` para "${termoFiltro}"` : ""}</p>
                                </div>
                            ) : (
                                postagensFiltradas.map((postagem) => (
                                    <div key={postagem.id} className={style.postagemComFoto}>
                                        {postagem.imagem && postagem.link && (
                                            <a href={postagem.link} className={style.lerMais} target="_blank" rel="noopener noreferrer">
                                                <img src={postagem.imagem} alt={postagem.titulo || "Imagem da postagem"} />
                                            </a>
                                        )}
                                        <div className={style.conteudo}>
                                            <h3>{postagem.titulo || "Sem título"}</h3>
                                            {postagem.data && <div className={style.data}>{postagem.data}</div>}
                                            <p className={style.resumo}>{postagem.resumo || "Resumo não disponível"}</p>
                                            {postagem.link && (
                                                <a href={postagem.link} className={style.lerMais} target="_blank" rel="noopener noreferrer">
                                                    Ler mais →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticiasGeral;
