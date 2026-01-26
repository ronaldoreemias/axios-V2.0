import { Helmet } from "react-helmet";
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import styles from './ResultadosBusca.module.css';
import Navbar from "../../components/Navbar";

interface SearchResult {
    _id: string;
    titulo: string;
    descricao: string;
    imagem: string;
    categoria: string;
    autor: string;
    dataHora: string;
    likes: number;
}

function ResultadosBusca() {
    const location = useLocation();
    const [resultados, setResultados] = useState<SearchResult[]>([]);
    const [resultadosExibidos, setResultadosExibidos] = useState<SearchResult[]>([]);
    const [termo, setTermo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Controle de paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const resultadosPorPagina = 10;
    const totalPaginas = Math.ceil(resultados.length / resultadosPorPagina);

    // Buscar resultados da API
    const buscarResultados = useCallback(async (searchTerm: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('https://backendpostagens.vercel.app/api/handler?type=postagensgeral');
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Formato de resposta inválido');
            }
            
            // Filtrar resultados localmente
            const filtered = data.filter((post: SearchResult) => 
                post.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.autor?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            setResultados(filtered);
            
            // Exibir primeira página
            const primeiraPagina = filtered.slice(0, resultadosPorPagina);
            setResultadosExibidos(primeiraPagina);
            
        } catch (error) {
            console.error('Erro ao buscar:', error);
            setError('Erro ao carregar resultados. Tente novamente.');
            setResultados([]);
            setResultadosExibidos([]);
        } finally {
            setIsLoading(false);
        }
    }, [resultadosPorPagina]);

    // Carregar mais resultados
    const carregarMais = () => {
        if (isLoadingMore || paginaAtual >= totalPaginas) return;
        
        setIsLoadingMore(true);
        
        // Simular delay para UX
        setTimeout(() => {
            const proximaPagina = paginaAtual + 1;
            const inicio = (proximaPagina - 1) * resultadosPorPagina;
            const fim = inicio + resultadosPorPagina;
            
            const novosResultados = resultados.slice(inicio, fim);
            setResultadosExibidos(prev => [...prev, ...novosResultados]);
            setPaginaAtual(proximaPagina);
            setIsLoadingMore(false);
        }, 500);
    };

    useEffect(() => {
        const { state } = location;
        
        if (state) {
            // Se veio do state da navbar
            const resultadosState = state.resultados || [];
            const termoState = state.termo || '';
            
            setResultados(resultadosState);
            setTermo(termoState);
            
            // Exibir primeira página
            const primeiraPagina = resultadosState.slice(0, resultadosPorPagina);
            setResultadosExibidos(primeiraPagina);
            setPaginaAtual(1);
            
            setIsLoading(false);
        } else {
            // Se acessou diretamente pela URL
            const params = new URLSearchParams(window.location.search);
            const searchTerm = params.get('q') || '';
            setTermo(searchTerm);
            
            if (searchTerm) {
                buscarResultados(searchTerm);
            } else {
                setIsLoading(false);
            }
        }
    }, [location, buscarResultados, resultadosPorPagina]);

    // Formatar data no estilo jornal
    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);
        
        // Se for hoje
        if (data.toDateString() === hoje.toDateString()) {
            return 'Hoje';
        }
        
        // Se for ontem
        if (data.toDateString() === ontem.toDateString()) {
            return 'Ontem';
        }
        
        // Outras datas
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/ de /g, '/');
    };

    // Formatar descrição (limitar caracteres)
    const formatarDescricao = (descricao: string) => {
        if (descricao.length > 180) {
            return descricao.substring(0, 180) + '...';
        }
        return descricao;
    };

    if (isLoading) {
        return (
            <>
                <div className={styles.navbarSpace}></div>
                <div className={styles.carregandoContainer}>
                    <div className={styles.carregandoSpinner}></div>
                    <p>Buscando resultados para "{termo}"</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className={styles.navbarSpace}></div>
                <div className={styles.container}>
                    <div className={styles.semResultados}>
                        <h2>Erro na busca</h2>
                        <p>{error}</p>
                        <Link to="/" className={styles.botaoHome}>
                            Voltar para Home
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Resultados de busca por "{termo}" | Axios News</title>
                <meta 
                    name="description" 
                    content={`Encontre ${resultados.length} resultados para sua busca por "${termo}" no Axios News. Notícias de tecnologia, vagas e oportunidades.`} 
                />
                <meta 
                    name="keywords" 
                    content={`${termo}, busca, notícias, tecnologia, Axios News`} 
                />
                <meta name="author" content="Axios News" />
                <meta name="robots" content="noindex, follow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Resultados para "${termo}" | Axios News`} />
                <meta property="og:description" content={`Encontre resultados para sua busca no Axios News`} />
                <meta property="og:url" content={`https://axiosnews.vercel.app/resultados-busca`} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={`Resultados para "${termo}"`} />
                <meta name="twitter:description" content="Encontre sua busca no Axios News" />
                <link rel="canonical" href={`https://axiosnews.vercel.app/resultados-busca`} />
            </Helmet>
            {/* Espaço para a navbar fixa */}
            <div className={styles.navbarSpace}>
                <Navbar />
            </div>
            
            <div className={styles.container}>
                {/* Título da busca */}
                <h1 className={styles.tituloBusca}>
                    Resultados para: <span className={styles.termoBusca}>"{termo}"</span>
                    {resultados.length > 0 && (
                        <span className={styles.contadorResultados}>
                            {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
                        </span>
                    )}
                </h1>
                
                {/* Lista de resultados */}
                {resultadosExibidos.length === 0 ? (
                    <div className={styles.semResultados}>
                        <h2>Nada encontrado</h2>
                        <p>
                            Não encontramos resultados para sua busca. Tente:
                        </p>
                        <ul>
                            <li>Verificar a ortografia das palavras</li>
                            <li>Usar termos mais gerais ou específicos</li>
                            <li>Experimentar sinônimos</li>
                            <li>Navegar pelas categorias disponíveis</li>
                        </ul>
                        <Link to="/" className={styles.botaoHome}>
                            Voltar para Home
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Container de resultados em row horizontal */}
                        <div className={styles.resultadosContainer}>
                            {resultadosExibidos.map((resultado, index) => (
                                <Link 
                                    key={`${resultado._id}-${index}`}
                                    to={`/postagensgeral/${resultado._id}`}
                                    className={styles.resultadoCard}
                                >
                                    {/* Imagem */}
                                    <div className={styles.resultadoImagem}>
                                        <img 
                                            src={resultado.imagem || 'https://via.placeholder.com/180x120/e0e0e0/333333?text=TechDev'} 
                                            alt={resultado.titulo}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/180x120/e0e0e0/333333?text=TechDev';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Conteúdo */}
                                    <div className={styles.resultadoConteudo}>
                                        {/* Categoria */}
                                        <span className={styles.resultadoCategoria}>
                                            {resultado.categoria || "Tecnologia"}
                                        </span>
                                        
                                        {/* Título */}
                                        <h3 className={styles.resultadoTitulo}>
                                            {resultado.titulo}
                                        </h3>
                                        
                                        {/* Descrição */}
                                        <p className={styles.resultadoDescricao}>
                                            {formatarDescricao(resultado.descricao)}
                                        </p>
                                        
                                        {/* Metadados */}
                                        <div className={styles.resultadoMetadados}>
                                            <span className={styles.resultadoAutor}>
                                                Por {resultado.autor || "Redação"}
                                                {resultado.dataHora && (
                                                    <span className={styles.resultadoData}>
                                                        • {formatarData(resultado.dataHora)}
                                                    </span>
                                                )}
                                            </span>
                                            
                                            <span className={styles.resultadoLikes}>
                                                {resultado.likes || 0} curtidas
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        
                        {/* Botão Carregar Mais */}
                        {paginaAtual < totalPaginas && (
                            <div className={styles.botaoContainer}>
                                <button
                                    onClick={carregarMais}
                                    className={styles.botaoCarregarMais}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? 'Carregando...' : 'Carregar mais notícias'}
                                </button>
                                
                                {/* Indicador de quantos resultados faltam */}
                                <p style={{
                                    textAlign: 'center',
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginTop: '10px'
                                }}>
                                    Mostrando {resultadosExibidos.length} de {resultados.length} resultados
                                </p>
                            </div>
                        )}
                        
                        {/* Indicador de carregamento mais */}
                        {isLoadingMore && (
                            <div className={styles.carregandoMais}>
                                <div className={styles.carregandoMaisSpinner}></div>
                                <p>Carregando mais notícias...</p>
                            </div>
                        )}
                        
                        {/* Mensagem quando todos resultados foram carregados */}
                        {paginaAtual >= totalPaginas && resultados.length > 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '20px 0',
                                color: '#666',
                                fontSize: '0.9rem',
                                borderTop: '1px solid #e0e0e0',
                                marginTop: '20px'
                            }}>
                                Todos os {resultados.length} resultados foram carregados
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default ResultadosBusca;