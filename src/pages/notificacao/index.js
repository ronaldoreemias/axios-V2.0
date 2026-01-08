import Navbar from "../../components/navbarNotificacao";
import style from "./Notificacao.module.css";
import { useState, useEffect, useMemo } from "react";
import { parse, isToday, isThisWeek, isThisMonth, subMonths, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

function importAll(r) {
    const images = {};
    r.keys().forEach((item) => {
        images[item.replace("./", "")] = r(item);
    });
    return images;
}

const icons = importAll(require.context("../../assets/bugimagem", false, /\.(png|jpe?g|svg|JPG|PNG)$/));

function Notificacao() {
    const [postagensSemFoto, setPostagensSemFoto] = useState([]);
    const [filtro, setFiltro] = useState("Todos");

    useEffect(() => {
        fetch("/Dbjason/Postagenssemfoto.json")
            .then((response) => response.json())
            .then((dados) => setPostagensSemFoto(dados));
    }, []);

    // Função para converter string em Date
    const parseData = (dataStr) => {
        try {
            return parse(dataStr, "d 'de' MMMM, yyyy", new Date(), { locale: ptBR });
        } catch {
            return null;
        }
    };

    // Lista filtrada com useMemo
    const postagensFiltradas = useMemo(() => {
        return postagensSemFoto.filter((postagem) => {
            const dataPostagem = postagem.data ? parseData(postagem.data) : null;

            if (filtro === "Todos") return true;

            if (filtro === "Bugs") {
                return postagem.titulo.toLowerCase().includes("bug");
            }

            if (filtro === "Atualizações") {
                return postagem.titulo.toLowerCase().includes("atualização");
            }

            if (filtro === "Hoje" && dataPostagem) {
                return isToday(dataPostagem);
            }

            if (filtro === "Esta semana" && dataPostagem) {
                return isThisWeek(dataPostagem, { locale: ptBR });
            }

            if (filtro === "Este mês" && dataPostagem) {
                return isThisMonth(dataPostagem);
            }

            if (filtro === "mês passado" && dataPostagem) {
                const mesPassado = subMonths(new Date(), 1);
                return isSameMonth(dataPostagem, mesPassado);
            }

            return true;
        });
    }, [filtro, postagensSemFoto]);

    return (
        <div className={style.containerNoticias}>
            <div className={style.headerNoticias}>
                <Navbar />
            </div>

            <div className={style.menuNoticias}>
                <div className={style.filtros}>
                    <button onClick={() => setFiltro("Bugs")}>Bugs</button>
                    <button onClick={() => setFiltro("Atualizações")}>Atualizações</button>
                    <button onClick={() => setFiltro("Este mês")}>Este mês</button>
                    <button onClick={() => setFiltro("mês passado")}>Mês passado</button>
                    <button onClick={() => setFiltro("Todos")}>Todos</button>
                </div>
            </div>

            <div className={style.contentNoticias}>
                <div className={style.containerInfo}>
                    {postagensFiltradas.map((postagem, index) => (
                        <div key={index} className={style.postagemSemFoto}>
                            <h3>{postagem.titulo}</h3>
                            <div className={style.data}>{postagem.data}</div>
                            <p className={style.resumo}>{postagem.resumo}</p>
                            {postagem.link && (
                                <a href={postagem.link} className={style.lerMais} target="_blank" rel="noopener noreferrer">
                                    Ler mais →
                                </a>
                            )}
                            <br />
                            {(() => {
                                const filenameFromUrl = postagem.imagemurl ? postagem.imagemurl.split("/").pop() : null;
                                const resolvedImage =
                                    icons[postagem.imagem] ||
                                    (filenameFromUrl ? icons[filenameFromUrl] : null) ||
                                    postagem.imagemurl ||
                                    postagem.imagem ||
                                    null;
                                return resolvedImage ? (
                                    <img src={resolvedImage} alt={postagem.titulo || "Imagem da postagem"} className={style.postagemImage} />
                                ) : null;
                            })()}
                            <p className={style.assinatura}>{postagem.assinatura}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notificacao;
