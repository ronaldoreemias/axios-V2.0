import style from "./Vagas.module.css";
import Navbar from "../../Components/Navbar";
import { useState, useEffect, useCallback } from "react"; 

// No topo do seu arquivo Vagas/index.tsx, antes do componente:

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
}// Importe os tipos

function Vagas() {
    const [vagas, setVagas] = useState<Vaga[]>([]); // Adicione o tipo
    const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]); // Adicione o tipo

    useEffect(() => {
        fetch('/Dbjason/Vagas.json')
        .then((response) => response.json())
        .then((dados: Vaga[]) => { // Adicione o tipo
            setVagas(dados);
            setVagasFiltradas(dados);
        })
        .catch((error) => {
            console.error("Erro ao carregar vagas:", error);
        });
    }, []);

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

    // Detecta se está em mobile
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

    // Função para aplicar filtros - agora com useCallback
    const aplicarFiltros = useCallback(() => {
        let vagasFiltradas = vagas;

        // Filtro por termo de busca
        if (termoBusca) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                vaga.Vaga.toLowerCase().includes(termoBusca.toLowerCase()) ||
                vaga.Descrição.toLowerCase().includes(termoBusca.toLowerCase()) ||
                vaga.Local.toLowerCase().includes(termoBusca.toLowerCase()) ||
                vaga.areaAtuacao.toLowerCase().includes(termoBusca.toLowerCase()) ||
                (vaga.Email && vaga.Email.toLowerCase().includes(termoBusca.toLowerCase()))
            );
        }

        // Filtro por tipo de contrato
        const tiposContratoSelecionados = Object.keys(filtros.tipoContrato).filter(
            (key): key is keyof FiltrosTipoContrato => 
                filtros.tipoContrato[key as keyof FiltrosTipoContrato]
        );
        
        if (tiposContratoSelecionados.length > 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                tiposContratoSelecionados.includes(vaga.tipoContrato as any)
            );
        }

        // Filtro por área de atuação
        const areasSelecionadas = Object.keys(filtros.areaAtuacao).filter(
            (key): key is keyof FiltrosAreaAtuacao => 
                filtros.areaAtuacao[key as keyof FiltrosAreaAtuacao]
        );
        
        if (areasSelecionadas.length > 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                areasSelecionadas.includes(vaga.areaAtuacao as any)
            );
        }

        // Filtro por modelo de trabalho
        const modelosSelecionados = Object.keys(filtros.modelo).filter(
            (key): key is keyof FiltrosModelo => 
                filtros.modelo[key as keyof FiltrosModelo]
        );
        
        if (modelosSelecionados.length > 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => 
                modelosSelecionados.includes(vaga.modelo as any)
            );
        }

        setVagasFiltradas(vagasFiltradas);
    }, [vagas, termoBusca, filtros]);

    // Aplicar filtros automaticamente quando os filtros mudam
    useEffect(() => {
        aplicarFiltros();
    }, [aplicarFiltros]);

    const handleSubmitFiltros = (e: React.FormEvent) => {
        e.preventDefault();
        aplicarFiltros();
    };


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

        // Verifica primeiro se há email específico
        if (vaga.Email) {
            return (
                <button 
                    onClick={copiarEmail}
                    className={style.botaoCandidatar}
                >
                    📧 Candidatar-se por Email (Copiar)
                </button>
            );
        }
        
        // Se não tiver email, verifica os outros links
        const link = vaga.Link_linkdin || vaga.link_site_da_empresa || vaga.link_whatsapp;
        
        if (!link) return null;

        let textoBotao = " Candidatar-se";

        if (link.includes("linkedin.com") || link.includes("linkdin")) {
            textoBotao = " Candidatar-se no LinkedIn";
        } else if (link.includes("whatsapp")) {
            textoBotao = " Candidatar-se via WhatsApp";
        } else {
            textoBotao = " Candidatar-se no Site";
        }

        return (
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={style.botaoCandidatar}
            >
                {textoBotao}
            </a>
        );
    };

    return(
        <>
            <Navbar />
            
            <main className={style.Vagasmain}>
                {!isMobile && (
                    <div className={style.barradefiltragemlateral}>
                        <form onSubmit={handleSubmitFiltros}>
                            <h3>Tipo de Contrato</h3>
                            {Object.keys(filtros.tipoContrato).map(tipo => (
                                <div key={tipo} className={style.checkboxGroup}>
                                    <input 
                                        type="checkbox" 
                                        id={`contrato-${tipo}`}
                                        checked={filtros.tipoContrato[tipo as keyof FiltrosTipoContrato]}
                                        onChange={() => handleFiltroChange('tipoContrato', tipo)}
                                    />
                                    <label htmlFor={`contrato-${tipo}`}>{tipo}</label>
                                </div>
                            ))}

                            <h3>Área de Atuação</h3>
                            {Object.keys(filtros.areaAtuacao).map(area => (
                                <div key={area} className={style.checkboxGroup}>
                                    <input 
                                        type="checkbox" 
                                        id={`area-${area}`}
                                        checked={filtros.areaAtuacao[area as keyof FiltrosAreaAtuacao]}
                                        onChange={() => handleFiltroChange('areaAtuacao', area)}
                                    />
                                    <label htmlFor={`area-${area}`}>{area}</label>
                                </div>
                            ))}

                            <h3>Modelo de Trabalho</h3>
                            {Object.keys(filtros.modelo).map(modelo => (
                                <div key={modelo} className={style.checkboxGroup}>
                                    <input 
                                        type="checkbox" 
                                        id={`modelo-${modelo}`}
                                        checked={filtros.modelo[modelo as keyof FiltrosModelo]}
                                        onChange={() => handleFiltroChange('modelo', modelo)}
                                    />
                                    <label htmlFor={`modelo-${modelo}`}>{modelo}</label>
                                </div>
                            ))}
                            
                            <button type="submit" className={style.botaoFiltrar}>
                                Aplicar Filtros
                            </button>
                            <button type="button" className={style.botaoLimpar} onClick={limparFiltros}>
                                Limpar Filtros
                            </button>
                        </form>
                    </div>
                )}

                <div className={style.areadevagas}>
                    <div className={style.infoResultados}>
                        <span>{vagasFiltradas.length} vaga(s) encontrada(s)</span>
                    </div>

                    <div className={style.ondevaificarasvagas}>
                        {vagasFiltradas.length === 0 ? (
                            <div className={style.semResultados}>
                                <h3>Nenhuma vaga encontrada</h3>
                                <p>Tente ajustar os filtros ou os termos da busca.</p>
                            </div>
                        ) : (
                            <div className={style.listaVagas}>
                                {vagasFiltradas.map((vaga, index) => (
                                    <div key={index} className={style.cardVaga}>
                                        <div className={style.cabecalhoVaga}>
                                            <h3 className={style.tituloVaga}>{vaga.Vaga}</h3>
                                            <span className={style.faixaSalarial}>{vaga.faixaSalarial}</span>
                                        </div>
                                        
                                        <p className={style.descricaoVaga}>{vaga.Descrição}</p>
                                        
                                        <div className={style.tagsVaga}>
                                            <span className={style.tag}>{vaga.areaAtuacao}</span>
                                            <span className={style.tag}>{vaga.tipoContrato}</span>
                                            <span className={style.tag}>{vaga.modelo}</span>
                                        </div>
                                        
                                        <div className={style.infoVaga}>
                                            <span className={style.localVaga}>
                                                📍 {vaga.Local}
                                            </span>
                                        </div>

                                        {vaga.beneficios && vaga.beneficios.length > 0 && (
                                            <div className={style.beneficios}>
                                                <strong>Benefícios:</strong>
                                                <div className={style.listaBeneficios}>
                                                    {vaga.beneficios.map((beneficio: string, idx: number) => (
                                                        <span key={idx} className={style.beneficio}>
                                                            {beneficio}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {renderBotaoCandidatar(vaga)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <br/>
        </>
    );
}

export default Vagas;