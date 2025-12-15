import style from "./Footer.module.css";
import React, { useState} from "react";

function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Enviando...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "e68e9ef4-1970-49dd-9559-7f0e05cbc49a");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult("Mensagem enviada com sucesso!");
        event.target.reset();
      } else {
        setResult("Erro ao enviar a mensagem. Tente novamente.");
      }
    } catch (error) {
      setResult("Erro de conexão. Verifique sua internet.");
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setResult("");
      }, 5000);
    }
  };

  return (
    <form className={style.contactForm} onSubmit={onSubmit}>
      
      <div className={style.formGroup}>
        <input 
          type="text" 
          id="name"
          name="name" 
          className={style.formInput}
          required 
          placeholder="Seu nome"
        />
      </div>
      
      <div className={style.formGroup}>
        <input 
          type="email" 
          id="email"
          name="email" 
          className={style.formInput}
          required 
          placeholder="escolha seu melhor email"
        />
      </div>
      
      <div className={style.formGroup}>
        <label htmlFor="message">Mensagem:</label>
        <textarea 
          id="message"
          name="message" 
          className={style.formTextarea}
          required 
          rows="4"
          placeholder="Digite sua mensagem aqui..."
        />
      </div>
      
      <button 
        type="submit" 
        className={style.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
      </button>
      
      {result && (
        <div className={`
          ${style.resultMessage} 
          ${result.includes("sucesso") ? style.success : style.error}
        `}>
          {result}
        </div>
      )}
    </form>
  );
}


function Footer(){
    return(
        <footer className={style.footer}>
            <br/>
            <div className={style.arealinks}>
                <div>
                    <h3>Axios Tecnologia</h3>
                    <p>Seu destino para as melhores ofertas em produtos 
                    de tecnologia, 
                    informações atualizadas sobre o mundo tech,
                    vagas de emprego e Comunidade no whatsapp e fórum (ainda em desenvolvimento )</p>
                </div>
                <div>
                    <h3>Categorias</h3>
                    <p>Tecnologia em geral</p>
                    <p>cyber secutity</p>
                    <p>Front-end</p>
                    <p>Back-end</p>
                    <p>Estudantes de Tecnologo</p>
                </div>
                <div>
                    <h3>Contato</h3>
                    <ContactForm />
                </div>

            </div>
            <br/>
            <div className={style.areatextofooter}>
                <p>© 2025 Axios_fetch. Todos os direitos reservados.</p>
            </div>
            <br/>
        </footer>
    );
}

export default Footer;
