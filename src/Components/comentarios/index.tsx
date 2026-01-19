import { useState, useEffect } from "react";
import style from "./Comentarios.module.css";
import enviar from "../../assets/enviar.png";
import { FaSpinner } from "react-icons/fa";

interface Comentario {
  _id: string;
  texto: string;
  criadoEm: string;
}

// Função para formatar data no estilo WhatsApp
const formatarData = (dataString: string): string => {
  const data = new Date(dataString);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHoras < 1) {
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    if (diffMinutos < 1) return "Agora mesmo";
    return `${diffMinutos} min atrás`;
  } else if (diffHoras < 24) {
    return `${diffHoras}h atrás`;
  } else if (diffHoras < 168) { // 7 dias
    const diffDias = Math.floor(diffHoras / 24);
    return `${diffDias}d atrás`;
  } else {
    return data.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short'
    });
  }
};

// Função para verificar se é um novo dia
const isNovoDia = (dataAtual: string, dataAnterior?: string): boolean => {
  if (!dataAnterior) return true;
  
  const date1 = new Date(dataAtual).toDateString();
  const date2 = new Date(dataAnterior).toDateString();
  
  return date1 !== date2;
};

// Formatar data completa para o separador
const formatarDataCompleta = (dataString: string): string => {
  const data = new Date(dataString);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  
  if (data.toDateString() === hoje.toDateString()) {
    return "Hoje";
  } else if (data.toDateString() === ontem.toDateString()) {
    return "Ontem";
  } else {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
};

function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [online, setOnline] = useState(true);
  const [digitando, setDigitando] = useState(false);

  useEffect(() => {
    // Simular status online
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await fetch("https://backendcomentarios.vercel.app/api/comentarios"); 
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setComentarios(Array.isArray(data) ? data.sort((a: Comentario, b: Comentario) => 
          new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        ) : []);
        setErro("");
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        setErro("Não foi possível carregar os comentários.");
      }
    };
    fetchComentarios();
    
    // Simular digitação
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && comentarios.length > 0) {
        setDigitando(true);
        setTimeout(() => setDigitando(false), 3000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    
    setEnviando(true);
    const textoParaEnviar = texto.trim();

    try {
      const res = await fetch("https://backendcomentarios.vercel.app/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoParaEnviar }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const novo = await res.json();
      
      // Adiciona o novo comentário no topo (mais recente primeiro)
      setComentarios(prev => [novo, ...prev]);
      setTexto("");
      setErro("");
      
      // Scroll automático para o novo comentário
      setTimeout(() => {
        const areaMensagem = document.querySelector(`.${style.areamensagem}`);
        if (areaMensagem) {
          areaMensagem.scrollTop = 0;
        }
      }, 100);
      
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      setErro("Não foi possível enviar o comentário. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTexto(e.target.value);
    // Simular digitação para outros usuários
    if (e.target.value.length > 0 && !digitando) {
      setDigitando(true);
    } else if (e.target.value.length === 0) {
      setDigitando(false);
    }
  };

  return (
    <div className={style.formularioscom}>
      
      {/* Status Online */}
      <div className={style.statusIndicator}>
        <div className={style.statusDot}></div>
        <span>{online ? `${comentarios.length} ativos` : 'Offline'}</span>
      </div>
      
      {erro && <div style={{ color: "#ff5252" }}>{erro}</div>}

      {/* Área de Mensagens */}
      <div className={style.areamensagem}>
        {comentarios.length === 0 && !erro ? (
          <div className={style.j}>
            <FaSpinner className={style.spinner} />
            <p>Carregando conversa...</p>
          </div>
        ) : (
          <>
            {/* Indicador de digitação */}
            {digitando && (
              <div className={style.typingIndicator}>
                <div className={style.typingDot}></div>
                <div className={style.typingDot}></div>
                <div className={style.typingDot}></div>
              </div>
            )}
            
            {comentarios.map((c, index) => {
              const dataAnterior = index > 0 ? comentarios[index - 1].criadoEm : undefined;
              const mostrarSeparador = isNovoDia(c.criadoEm, dataAnterior);
              
              return (
                <div key={c._id}>
                  {mostrarSeparador && (
                    <div className={style.dataSeparator}>
                      <span>{formatarDataCompleta(c.criadoEm)}</span>
                    </div>
                  )}
                  
                  <div 
                    className={style.comentario}
                    style={{ '--item-index': index } as React.CSSProperties}
                  >
                    <p>{c.texto}</p>
                    <small>{formatarData(c.criadoEm)}</small>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      
      {/* Formulário de Envio */}
      <form onSubmit={handleSubmit} className={style.Formulariocomentarios}>
        <input
          value={texto}
          onChange={handleInputChange}
          placeholder="Digite uma mensagem..."
          required
          disabled={enviando}
          maxLength={500}
        />
        <button 
          type="submit" 
          disabled={enviando || !texto.trim()}
          style={{ opacity: (!texto.trim() || enviando) ? 0.6 : 1 }}
        >
          {enviando ? (
            <FaSpinner className={style.spinner} style={{ fontSize: '16px' }} />
          ) : (
            <img src={enviar} alt="Enviar" />
          )}
        </button>
      </form>
    </div>
  );
}

export default Comentarios;