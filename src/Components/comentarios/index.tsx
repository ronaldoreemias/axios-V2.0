import { useState, useEffect } from "react";
import style from "./Comentarios.module.css";
import enviar from "../../assets/enviar.png";
import { FaSpinner } from "react-icons/fa";

interface Comentario {
  _id: string;
  texto: string;
  criadoEm: string;
}


function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");

  
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await fetch("https://backendcomentarios.vercel.app/api/comentarios"); 
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setComentarios(Array.isArray(data) ? data : []); 
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
    if (!texto.trim()) return;

    try {
      const res = await fetch("https://backendcomentarios.vercel.app/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: texto.trim() }), // formato certo
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const novo = await res.json(); 
      setComentarios((prev) => [novo, ...prev]);
      setTexto("");
      setErro("");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      setErro("Não foi possível enviar o comentário.");
    }
  };

  return (
    <div className={style.formularioscom} >
      
      <h1>Compartilhe sua opinião </h1>
      {erro && <div style={{ color: "red" }}>{erro}</div>}

      <form onSubmit={handleSubmit} className={style.Formulariocomentarios} >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Deixe seu comentário"
          required
        />
        <button type="submit"><img src={enviar} /></button>
      </form>
      
      <div className={style.areamensagem}>
        {comentarios.length === 0 && !erro ? (
          <div className={style.j}>
            <FaSpinner className={style.spinner} />
            <p>Carregando...</p>
          </div>
        ) : (
          comentarios.map((c) => (
            <div key={c._id} className={style.comentario}>
              <p>{c.texto}</p>
              <small>{new Date(c.criadoEm).toLocaleString()}</small>
            </div>
            
          ))
          
        )}
      </div>
    </div>
  );
}

export default Comentarios;
