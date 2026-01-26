import { Helmet } from "react-helmet";
import style from "./contato.module.css";
import { useState } from "react";
import Navbar from "../../components/Navbar";

function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Enviando...");
    
    const form = event.currentTarget; 
    const formDataObj = new FormData(form);

    formDataObj.append("access_key", "e68e9ef4-1970-49dd-9559-7f0e05cbc49a");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();
      
      if (data.success) {
        setResult("✓ Mensagem enviada com sucesso! Em breve entraremos em contato.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: ""
        });
        form.reset();
      } else {
        setResult("✗ Erro ao enviar a mensagem. Tente novamente em alguns instantes.");
      }
    } catch (error) {
      setResult("✗ Erro de conexão. Verifique sua internet e tente novamente.");
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setResult("");
      }, 8000);
    }
  };

  return (
    <div className={style.contactContainer}>
      <Helmet>
        <title>Contato - Fale com a Redação | Axios News</title>
        <meta 
          name="description" 
          content="Entre em contato direto com a redação do Axios News. Envie suas sugestões, críticas ou informações sobre notícias de tecnologia e oportunidades." 
        />
        <meta 
          name="keywords" 
          content="contato, redação, sugestões, tecnologia, Axios News" 
        />
        <meta name="author" content="Axios News" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contato - Axios News" />
        <meta property="og:description" content="Entre em contato com a redação do Axios News" />
        <meta property="og:url" content="https://axiosnews.vercel.app/Contato" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contato - Axios News" />
        <meta name="twitter:description" content="Entre em contato com a redação" />
        <link rel="canonical" href="https://axiosnews.vercel.app/Contato" />
      </Helmet>
      <Navbar />
      
      <div className={style.newspaperDecoration}>CONTATO DIRETO COM A REDAÇÃO</div>
      
      <form id="inbox" className={style.contactForm} onSubmit={onSubmit}>
        
        {/* Cabeçalho com grid */}
        <div className={style.contactHeader}>
          <div className={style.headerMain}>
            <h1>Envie sua mensagem à redação</h1>
            <p className={style.subtitulo}>
              Nosso canal direto com editores e jornalistas. 
              Sua mensagem será analisada pessoalmente pela equipe.
            </p>
          </div>
          
          <div className={style.headerSidebar}>
            <div className={style.editionInfo}>
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Edição do dia</span>
                <span className={`${style.infoValue} ${style.red}`}>
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Seção</span>
                <span className={style.infoValue}>Contato & Correspondência</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={style.linha}></div>
        
        {/* Campos do formulário em grid */}
        <div className={style.formFields}>
          <div className={`${style.formGroup} ${style.halfWidth}`}>
            <label htmlFor="name">
              Telefone para contato
              <span className={style.required}>Obrigatório</span>
            </label>
            <input 
              type="tel" 
              id="name"
              name="name" 
              className={style.formInput}
              required 
              placeholder="Ex: (11) 99999-9999"
              value={formData.name}
              onChange={handleInputChange}
              pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
              title="Digite um telefone no formato (xx) xxxxx-xxxx"
            />
          </div>
          
          <div className={`${style.formGroup} ${style.halfWidth}`}>
            <label htmlFor="email">
              Endereço de e-mail
              <span className={style.required}>Obrigatório</span>
            </label>
            <input 
              type="email" 
              id="email"
              name="email" 
              className={style.formInput}
              required 
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className={`${style.formGroup} ${style.fullWidth}`}>
            <label htmlFor="message">
              Conteúdo da mensagem
              <span className={style.required}>Obrigatório</span>
            </label>
            <textarea 
              id="message"
              name="message" 
              className={style.formTextarea}
              required 
              rows={8}
              placeholder="Descreva detalhadamente seu pedido, sugestão, crítica ou dúvida. Nossa equipe analisará com atenção profissional."
              value={formData.message}
              onChange={handleInputChange}
              maxLength={2000}
            />
            <div className={style.charCount}>
              {formData.message.length}/2000 caracteres
            </div>
          </div>
        </div>
        
        {/* Área de ações em grid */}
        <div className={style.formActions}>
          <div className={style.privacyInfo}>
            <small>
              <strong>Política de privacidade:</strong> Seus dados são tratados com 
              confidencialidade jornalística. Utilizamos apenas para contato direto.
            </small>
          </div>
          
          <button 
            type="submit" 
            className={style.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={style.loadingIndicator}></span>
                Enviando para a redação...
              </>
            ) : (
              "Enviar mensagem à redação"
            )}
          </button>
        </div>
        
        {/* Mensagem de resultado */}
        {result && (
          <div className={`
            ${style.resultMessage} 
            ${result.includes("sucesso") ? style.success : style.error}
          `}>
            {result}
          </div>
        )}
        
        {/* Rodapé em grid */}
        <div className={style.contactFooter}>
          <div className={style.footerItem}>
            <strong>Resposta garantida</strong>
            <small>Nossa equipe responde em até 24 horas úteis</small>
          </div>
          
          <div className={style.footerItem}>
            <strong>Confidencialidade</strong>
            <small>Seus dados não são compartilhados com terceiros</small>
          </div>
          
          <div className={style.footerItem}>
            <strong>Axios Notícias</strong>
            <small>Jornalismo profissional e independente desde 2024</small>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;