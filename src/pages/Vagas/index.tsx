import { Helmet } from "react-helmet";import style from "./Vagas.module.css";
import NavbarDemaisAreas from "../../components/NavbarDemaisAreas";
import { useState, useEffect, useCallback } from "react"; 

interface Vaga {
  Vaga: string;
  Descrição: string;
  Local: string;
  areaAtuacao: string;
  tipoContrato: string;
  modelo: string;
  faixaSalarial: string;
  Email?: string;
  Link_linkdin?: string;
  link_site_da_empresa?: string;
  link_whatsapp?: string;
  beneficios?: string[];
  requisitos?: string[];
  dataPublicacao?: string;
}

interface FiltrosTipoContrato {
  Freelancer: boolean;
  PJ: boolean;
  CLT: boolean;
  estagio: boolean;
}

interface FiltrosAreaAtuacao {
  "Front-end": boolean;
  "Back-end": boolean;
  "Fullstack": boolean;
  "Banco de Dados": boolean;
  "Suporte e Dados": boolean;
  "Automação e BI": boolean;
}

interface FiltrosModelo {
  "Presencial": boolean;
  "Home office": boolean;
}

interface Filtros {
  tipoContrato: FiltrosTipoContrato;
  areaAtuacao: FiltrosAreaAtuacao;
  modelo: FiltrosModelo;
}

function Vagas() {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]);
    const [filtros, setFiltros] = useState<Filtros>({
        tipoContrato: {
            Freelancer: false,
            PJ: false,
            CLT: false,
            estagio: false
        },
        areaAtuacao: {
            "Front-end": false,
            "Back-end": false,
            "Fullstack": false,
            "Banco de Dados": false,
            "Suporte e Dados": false,
            "Automação e BI": false
        },
        modelo: {
            "Presencial": false,
            "Home office": false
        }
    });

    const [termoBusca, setTermoBusca] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [modalFiltrosAberto, setModalFiltrosAberto] = useState<boolean>(false);

    useEffect(() => {
        fetch('/Dbjason/Vagas.json')
        .then((response) => response.json())
        .then((dados: Vaga[]) => {
            const vagasComData = dados.map(vaga => ({
                ...vaga,
                dataPublicacao: vaga.dataPublicacao || new Date().toISOString().split('T')[0]
            }));
            setVagas(vagasComData);
            setVagasFiltradas(vagasComData);
        })
        .catch((error) => {
            console.error("Erro ao carregar vagas:", error);
        });
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleFiltroChange = (categoria: keyof Filtros, filtro: string) => {
        setFiltros(prev => ({
            ...prev,
            [categoria]: {
                ...prev[categoria],
                [filtro]: !(prev[categoria] as any)[filtro]
            }
        }));
    };

    const aplicarFiltros = useCallback(() => {
        let vagasFiltradas = vagas;

        if (termoBusca) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                vaga.Vaga.toLowerCase().includes(termoBusca.toLowerCase()) ||
                vaga.Descrição.toLowerCase().includes(termoBusca.toLowerCase()) ||
                vaga.Local.toLowerCase().includes(termoBusca.toLowerCase()) ||
                vaga.areaAtuacao.toLowerCase().includes(termoBusca.toLowerCase()) ||
                (vaga.Email && vaga.Email.toLowerCase().includes(termoBusca.toLowerCase()))
            );
        }

        const tiposContratoSelecionados = Object.keys(filtros.tipoContrato).filter(
            (key): key is keyof FiltrosTipoContrato => 
                filtros.tipoContrato[key as keyof FiltrosTipoContrato]
        );
        
        if (tiposContratoSelecionados.length > 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                tiposContratoSelecionados.includes(vaga.tipoContrato as any)
            );
        }

        const areasSelecionadas = Object.keys(filtros.areaAtuacao).filter(
            (key): key is keyof FiltrosAreaAtuacao => 
                filtros.areaAtuacao[key as keyof FiltrosAreaAtuacao]
        );
        
        if (areasSelecionadas.length > 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                areasSelecionadas.includes(vaga.areaAtuacao as any)
            );
        }

        const modelosSelecionados = Object.keys(filtros.modelo).filter(
            (key): key is keyof FiltrosModelo => 
                filtros.modelo[key as keyof FiltrosModelo]
        );
        
        if (modelosSelecionados.length > 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                modelosSelecionados.includes(vaga.modelo as any)
            );
        }

        // Ordenação
        
        setVagasFiltradas(vagasFiltradas);
    }, [vagas, termoBusca, filtros]);

    useEffect(() => {
        aplicarFiltros();
    }, [aplicarFiltros]);

    const limparFiltros = () => {
        setTermoBusca("");
        setFiltros({
            tipoContrato: {
                Freelancer: false,
                PJ: false,
                CLT: false,
                estagio: false
            },
            areaAtuacao: {
                "Front-end": false,
                "Back-end": false,
                "Fullstack": false,
                "Banco de Dados": false,
                "Suporte e Dados": false,
                "Automação e BI": false
            },
            modelo: {
                "Presencial": false,
                "Home office": false
            }
        });
        setVagasFiltradas(vagas);
        if (isMobile) {
            setModalFiltrosAberto(false);
        }
    };

    const handleSubmitFiltros = (e: React.FormEvent) => {
        e.preventDefault();
        aplicarFiltros();
        if (isMobile) {
            setModalFiltrosAberto(false);
        }
    };

    const renderBotaoCandidatar = (vaga: Vaga) => {
        const copiarEmail = () => {
            if (vaga.Email) {
                navigator.clipboard.writeText(vaga.Email)
                    .then(() => {
                        alert('Email copiado! Agora você pode colar no seu cliente de email.');
                    })
                    .catch(err => {
                        console.error('Erro ao copiar email:', err);
                        alert('Erro ao copiar email. Tente novamente.');
                    });
            }
        };

        if (vaga.Email) {
            return (
                <button 
                    onClick={copiarEmail}
                    className={style.botaoCandidatar}
                >
                    <span>Candidatar-se por Email</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            );
        }
        
        const link = vaga.Link_linkdin || vaga.link_site_da_empresa || vaga.link_whatsapp;
        
        if (!link) return null;

        return (
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={style.botaoCandidatar}
            >
                <span>Candidatar-se Agora</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" />
                </svg>
            </a>
        );
    };

    const FiltrosComponent = () => (
        <form onSubmit={handleSubmitFiltros}>
            <h3>Tipo de Contrato</h3>
            <div className={style.filtroGrupo}>
                {Object.keys(filtros.tipoContrato).map(tipo => (
                    <div key={tipo} className={style.filtroItem}>
                        <input 
                            type="checkbox" 
                            id={`contrato-${tipo}`}
                            checked={filtros.tipoContrato[tipo as keyof FiltrosTipoContrato]}
                            onChange={() => handleFiltroChange('tipoContrato', tipo)}
                        />
                        <label htmlFor={`contrato-${tipo}`}>{tipo}</label>
                        <span className={style.contadorFiltro}>
                            {vagas.filter(v => v.tipoContrato === tipo).length}
                        </span>
                    </div>
                ))}
            </div>

            <h3>Área de Atuação</h3>
            <div className={style.filtroGrupo}>
                {Object.keys(filtros.areaAtuacao).map(area => (
                    <div key={area} className={style.filtroItem}>
                        <input 
                            type="checkbox" 
                            id={`area-${area}`}
                            checked={filtros.areaAtuacao[area as keyof FiltrosAreaAtuacao]}
                            onChange={() => handleFiltroChange('areaAtuacao', area)}
                        />
                        <label htmlFor={`area-${area}`}>{area}</label>
                        <span className={style.contadorFiltro}>
                            {vagas.filter(v => v.areaAtuacao === area).length}
                        </span>
                    </div>
                ))}
            </div>

            <h3>Modelo de Trabalho</h3>
            <div className={style.filtroGrupo}>
                {Object.keys(filtros.modelo).map(modelo => (
                    <div key={modelo} className={style.filtroItem}>
                        <input 
                            type="checkbox" 
                            id={`modelo-${modelo}`}
                            checked={filtros.modelo[modelo as keyof FiltrosModelo]}
                            onChange={() => handleFiltroChange('modelo', modelo)}
                        />
                        <label htmlFor={`modelo-${modelo}`}>{modelo}</label>
                        <span className={style.contadorFiltro}>
                            {vagas.filter(v => v.modelo === modelo).length}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className={style.botoesFiltro}>
                <button type="submit" className={style.botaoFiltrar}>
                    Aplicar Filtros
                </button>
                <button type="button" className={style.botaoLimpar} onClick={limparFiltros}>
                    Limpar Filtros
                </button>
            </div>
        </form>
    );

    // Filtros ativos para mostrar como tags
    const filtrosAtivos = [
        ...Object.keys(filtros.tipoContrato).filter(key => filtros.tipoContrato[key as keyof FiltrosTipoContrato]),
        ...Object.keys(filtros.areaAtuacao).filter(key => filtros.areaAtuacao[key as keyof FiltrosAreaAtuacao]),
        ...Object.keys(filtros.modelo).filter(key => filtros.modelo[key as keyof FiltrosModelo])
    ];

    const removerFiltro = (filtro: string) => {
        // Encontrar em qual categoria está o filtro
        if (filtro in filtros.tipoContrato) {
            handleFiltroChange('tipoContrato', filtro);
        } else if (filtro in filtros.areaAtuacao) {
            handleFiltroChange('areaAtuacao', filtro);
        } else if (filtro in filtros.modelo) {
            handleFiltroChange('modelo', filtro);
        }
    };

    return(
        <>
            <Helmet>
                <title>Vagas de Emprego Tech | Freelancer, PJ e CLT | Axios News</title>
                <meta 
                    name="description" 
                    content="Encontre as melhores vagas de emprego em tecnologia, desenvolvedor, freelancer, PJ e CLT. Filtrar por área, localidade e tipo de contrato." 
                />
                <meta 
                    name="keywords" 
                    content="vagas tecnologia, vagas dev, freelancer, PJ, CLT, desenvolvedor, emprego tech, carreira" 
                />
                <meta name="author" content="Axios News" />
                <meta name="robots" content="index, follow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Vagas de Emprego Tech | Axios News" />
                <meta property="og:description" content="Encontre vagas de emprego em tecnologia, freelancer, PJ e CLT" />
                <meta property="og:url" content="https://axiosnews.vercel.app/vagas" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Vagas de Emprego Tech | Axios News" />
                <meta name="twitter:description" content="Encontre vagas de emprego em tecnologia" />
                <link rel="canonical" href="https://axiosnews.vercel.app/vagas" />
            </Helmet>
            <NavbarDemaisAreas />
            <main className={style.Vagasmain}>
                {/* Barra de Filtros Lateral (Desktop) */}
                {!isMobile && (
                    <div className={style.barradefiltragemlateral}>
                        <FiltrosComponent />
                    </div>
                )}

                <div className={style.areadevagas}>
                    {/* Barra de Busca Móvel */}
                    {isMobile && (
                        <div className={style.barraBuscaMobile}>
                            <div className={style.inputBuscaWrapper}>
                                <input
                                    type="text"
                                    placeholder="Buscar vagas..."
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                    className={style.inputBusca}
                                />
                            </div>
                        </div>
                    )}

                    {/* Header de Resultados */}
                    <div className={style.infoResultados}>
                        <span>{vagasFiltradas.length} vaga(s) encontrada(s)</span>
                    </div>

                    {/* Filtros Ativos (Tags) */}
                    {filtrosAtivos.length > 0 && (
                        <div className={style.filtrosAtivos}>
                            {filtrosAtivos.map(filtro => (
                                <div key={filtro} className={style.filtroAtivo}>
                                    <span>{filtro}</span>
                                    <button 
                                        onClick={() => removerFiltro(filtro)}
                                        className={style.botaoRemoverFiltro}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Lista de Vagas */}
                    <div className={style.ondevaificarasvagas}>
                        {vagasFiltradas.length === 0 ? (
                            <div className={style.semResultados}>
                                <h3>Nenhuma vaga encontrada</h3>
                                <p>Tente ajustar os filtros ou os termos da busca.</p>
                                <button 
                                    className={style.botaoLimpar}
                                    onClick={limparFiltros}
                                    style={{ marginTop: '20px' }}
                                >
                                    Limpar todos os filtros
                                </button>
                            </div>
                        ) : (
                            <div className={style.listaVagas}>
                                {vagasFiltradas.map((vaga, index) => (
                                    <div 
                                        key={index} 
                                        className={style.cardVaga}
                                        style={{ '--item-index': index } as React.CSSProperties}
                                    >
                                        {/* Cabeçalho com título e badges */}
                                        <div className={style.cabecalhoVaga}>
                                            <h3 className={style.tituloVaga}>{vaga.Vaga}</h3>
                                            <div className={style.badgesVaga}>
                                                <span className={style.badgeSalario}>{vaga.faixaSalarial}</span>
                                                {vaga.modelo === "Home office" && (
                                                    <span className={style.badgeRemoto}>Remoto</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Descrição */}
                                        <p className={style.descricaoVaga}>{vaga.Descrição}</p>
                                        
                                        {/* Informações da Empresa e Local */}
                                        <div className={style.infoEmpresa}>
                                            <span className={style.localVaga}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                {vaga.Local}
                                            </span>
                                            <span className={style.tipoContrato}>{vaga.tipoContrato}</span>
                                        </div>

                                        {/* Requisitos e Benefícios */}
                                        {(vaga.requisitos || vaga.beneficios) && (
                                            <div className={style.requisitosContainer}>
                                                {vaga.requisitos && (
                                                    <div className={style.requisitosBox}>
                                                        <h4>Requisitos</h4>
                                                        <div className={style.listaRequisitos}>
                                                            {vaga.requisitos.slice(0, 3).map((req, idx) => (
                                                                <div key={idx} className={style.itemRequisito}>
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M20 6L9 17l-5-5" />
                                                                    </svg>
                                                                    {req}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {vaga.beneficios && (
                                                    <div className={style.requisitosBox}>
                                                        <h4>Benefícios</h4>
                                                        <div className={style.beneficiosContainer}>
                                                            {vaga.beneficios.slice(0, 4).map((beneficio, idx) => (
                                                                <span key={idx} className={style.beneficioTag}>
                                                                    {beneficio}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Footer do Card */}
                                        <div className={style.cardFooter}>
                                            <span className={style.infoTempo}>
                                                Publicada há 2 dias
                                            </span>
                                            
                                            <div className={style.botoesAcao}>
                                                <button className={style.botaoSalvar}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                                                    </svg>
                                                    Salvar
                                                </button>
                                                {renderBotaoCandidatar(vaga)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de Filtros Móvel */}
                <div className={`${style.modalFiltros} ${modalFiltrosAberto ? style.active : ''}`}>
                    <div className={style.conteudoModal}>
                        <div className={style.cabecalhoModal}>
                            <h2>Filtrar Vagas</h2>
                            <button 
                                className={style.botaoFecharModal}
                                onClick={() => setModalFiltrosAberto(false)}
                            >
                                ×
                            </button>
                        </div>
                        <FiltrosComponent />
                    </div>
                </div>

                {/* Botão para Abrir Filtros Móvel */}
                {isMobile && (
                    <button 
                        className={style.botaoFiltrosMobile}
                        onClick={() => setModalFiltrosAberto(true)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                        </svg>
                        Filtrar
                    </button>
                )}
            </main>
        </>
    );
}

export default Vagas;