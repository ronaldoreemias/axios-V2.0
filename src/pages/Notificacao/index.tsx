import Navbar from "../../Components/Navbar";
import style from "./Notificacao.module.css";
import { useState, useEffect, useMemo } from "react";
import { parse, isToday, isThisWeek, isThisMonth, subMonths, isSameMonth, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface para tipar as postagens
interface Postagem {
  titulo: string;
  data: string;
  resumo: string;
  link?: string;
  imagem?: string;
  imagemurl?: string;
  assinatura: string;
}

function Notificacao() {
  const [postagensSemFoto, setPostagensSemFoto] = useState<Postagem[]>([]);
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    // Carregar postagens
    fetch('/Dbjason/Postagenssemfoto.json')
      .then((response) => response.json())
      .then((dados: Postagem[]) => setPostagensSemFoto(dados))
      .catch(error => console.error('Erro ao carregar postagens:', error));
    
    // Carregar imagens dinamicamente
    const loadImages = async () => {
      try {
        const imageModules = import.meta.glob('../../assets/bugimagem/*.{png,jpg,jpeg,svg,JPG,PNG}');
        const loadedIcons: Record<string, string> = {};
        
        for (const path in imageModules) {
          const module = await imageModules[path]();
          const filename = path.split('/').pop() || '';
          loadedIcons[filename] = (module as any).default;
        }
        
        setIcons(loadedIcons);
      } catch (error) {
        console.warn('Erro ao carregar imagens:', error);
      }
    };
    
    loadImages();
  }, []);

  // Função para converter string em Date
  const parseData = (dataStr: string): Date | null => {
    try {
      return parse(dataStr, "d 'de' MMMM, yyyy", new Date(), { locale: ptBR });
    } catch {
      return null;
    }
  };

  // Detectar se uma postagem é recente (menos de 7 dias)
  const isRecent = (dataStr: string): boolean => {
    const dataPostagem = parseData(dataStr);
    if (!dataPostagem) return false;
    const diffDays = differenceInDays(new Date(), dataPostagem);
    return diffDays <= 7;
  };

  // Lista filtrada com useMemo
  const postagensFiltradas = useMemo(() => {
    return postagensSemFoto.filter(postagem => {
      const dataPostagem = parseData(postagem.data);

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

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = postagensSemFoto.length;
    const bugs = postagensSemFoto.filter(p => 
      p.titulo.toLowerCase().includes("bug")
    ).length;
    const atualizacoes = postagensSemFoto.filter(p => 
      p.titulo.toLowerCase().includes("atualização")
    ).length;
    const recentes = postagensSemFoto.filter(p => 
      isRecent(p.data)
    ).length;

    return { total, bugs, atualizacoes, recentes };
  }, [postagensSemFoto]);

  return (
    <div className={style.containerNoticias}>
      <div className={style.headerNoticias}>
        <Navbar />
      </div>

      {/* Status do Sistema */}
      <div className={style.contentNoticias}>
        
        {/* Estatísticas */}
        <div className={style.estatisticas}>
          <div className={style.estatisticaCard}>
            <div className={style.estatisticaNumero}>{estatisticas.total}</div>
            <div className={style.estatisticaLabel}>Total de Registros</div>
          </div>
          <div className={style.estatisticaCard}>
            <div className={style.estatisticaNumero}>{estatisticas.bugs}</div>
            <div className={style.estatisticaLabel}>Bugs Reportados</div>
          </div>
          <div className={style.estatisticaCard}>
            <div className={style.estatisticaNumero}>{estatisticas.atualizacoes}</div>
            <div className={style.estatisticaLabel}>Atualizações</div>
          </div>
          <div className={style.estatisticaCard}>
            <div className={style.estatisticaNumero}>{estatisticas.recentes}</div>
            <div className={style.estatisticaLabel}>Últimos 7 Dias</div>
          </div>
        </div>

        {/* Menu de Filtros */}
        <div className={style.menuNoticias}>
          <div className={style.filtros}>
            <button 
              onClick={() => setFiltro("Bugs")}
              className={filtro === "Bugs" ? style.active : ""}
            >
              Bugs
            </button>
            <button 
              onClick={() => setFiltro("Atualizações")}
              className={filtro === "Atualizações" ? style.active : ""}
            >
              Atualizações
            </button>
            <button 
              onClick={() => setFiltro("Este mês")}
              className={filtro === "Este mês" ? style.active : ""}
            >
              Este mês
            </button>
            <button 
              onClick={() => setFiltro("mês passado")}
              className={filtro === "mês passado" ? style.active : ""}
            >
              Mês passado
            </button>
            <button 
              onClick={() => setFiltro("Todos")}
              className={filtro === "Todos" ? style.active : ""}
            >
              Todos
            </button>
          </div>
        </div>
        <br/>
        {/* Lista de Postagens */}
        <div className={style.containerInfo}>
          {postagensFiltradas.length === 0 ? (
            <div className={style.emptyState}>
              <h3>Nenhuma notificação encontrada</h3>
              <p>Não há registros para o filtro selecionado. Tente outro filtro ou verifique mais tarde.</p>
            </div>
          ) : (
            postagensFiltradas.map((postagem, index) => {
              const isBug = postagem.titulo.toLowerCase().includes("bug");
              const isAtualizacao = postagem.titulo.toLowerCase().includes("atualização");
              const isNovo = isRecent(postagem.data);

              return (
                <div 
                  key={index} 
                  className={style.postagemSemFoto}
                  style={{ '--item-index': index } as React.CSSProperties}
                >
                  {/* Indicador de Novidade */}
                  {isNovo && (
                    <div className={style.novoIndicador}>NOVO</div>
                  )}

                  {/* Badge de Categoria */}
                  <div className={`${style.categoriaBadge} ${
                    isBug ? style.categoriaBug : 
                    isAtualizacao ? style.categoriaAtualizacao : 
                    ''
                  }`}>
                    {isBug ? 'BUG' : isAtualizacao ? 'ATUALIZAÇÃO' : 'INFORMAÇÃO'}
                  </div>

                  <h3>{postagem.titulo}</h3>
                  <div className={style.data}>{postagem.data}</div>
                  <p className={style.resumo}>{postagem.resumo}</p>
                  
                  {(() => {
                    const filenameFromUrl = postagem.imagemurl ? postagem.imagemurl.split('/').pop() : null;
                    const resolvedImage = (postagem.imagem && icons[postagem.imagem]) ||
                      (filenameFromUrl && icons[filenameFromUrl]) ||
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Notificacao;