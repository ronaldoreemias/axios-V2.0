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
  const [userId] = useState(() => localStorage.getItem('chatUserId') || `user_${Date.now()}`);

  // Salvar ID do usuário no localStorage
  useEffect(() => {
    localStorage.setItem('chatUserId', userId);
  }, [userId]);

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
        body: JSON.stringify({ 
          texto: textoParaEnviar,
          userId: userId // Identificador do usuário
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const novo = await res.json();
      
      // Adiciona o novo comentário no topo
      setComentarios(prev => [novo, ...prev]);
      setTexto("");
      setErro("");
      
      // Scroll automático para o topo
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
  };

  // Determinar se o comentário é do usuário atual ou de outro
  const isMeuComentario = (comentario: Comentario): boolean => {
    // Verifica se o comentário tem userId e se corresponde ao nosso
    return (comentario as any).userId === userId;
  };

  return (
    <div className={style.formularioscom}>
      {erro && <div style={{ color: "#ff5252" }}>{erro}</div>}

      {/* Área de Mensagens */}
      <div className={style.areamensagem}>
        {comentarios.length === 0 && !erro ? (
          <div className={style.j}>
            <FaSpinner className={style.spinner} />
            <p>Carregando...</p>
          </div>
        ) : (
          comentarios.map((c, index) => {
            const dataAnterior = index > 0 ? comentarios[index - 1].criadoEm : undefined;
            const mostrarSeparador = isNovoDia(c.criadoEm, dataAnterior);
            const isMeu = isMeuComentario(c);
            
            return (
              <div key={c._id}>
                {mostrarSeparador && (
                  <div className={style.dataSeparator}>
                    <span>{formatarDataCompleta(c.criadoEm)}</span>
                  </div>
                )}
                
                <div 
                  className={`${style.comentario} ${isMeu ? style.enviado : style.recebido}`}
                  style={{ '--item-index': index } as React.CSSProperties}
                >
                  <p>{c.texto}</p>
                  <small>{formatarData(c.criadoEm)}</small>
                </div>
              </div>
            );
          })
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