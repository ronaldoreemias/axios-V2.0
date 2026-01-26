import { Helmet } from "react-helmet";
import { useState } from "react";
import style from "./Newsletter.module.css";
import Navbar from "../../components/Navbar";

function Newsletter() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Enviando...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("access_key", "e68e9ef4-1970-49dd-9559-7f0e05cbc49a");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Inscrição realizada com sucesso!");
        form.reset();
      } else {
        setResult("Erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      setResult("Erro de conexão. Verifique sua internet.");
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setResult("");
      }, 5000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Newsletter Premium - Notícias Selecionadas Diariamente | Axios News</title>
        <meta 
          name="description" 
          content="Inscreva-se em nossa newsletter premium e receba as notícias mais importantes de tecnologia, inovação e mercado diariamente. Primeira semana gratuita!" 
        />
        <meta 
          name="keywords" 
          content="newsletter, notícias selecionadas, tecnologia, inovação, mercado, assinatura" 
        />
        <meta name="author" content="Axios News" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Newsletter Premium - Axios News" />
        <meta property="og:description" content="Receba as notícias mais importantes diariamente em seu email" />
        <meta property="og:url" content="https://axiosnews.vercel.app/newsletter" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Newsletter Premium - Axios News" />
        <meta name="twitter:description" content="Inscreva-se em nossa newsletter premium" />
        <link rel="canonical" href="https://axiosnews.vercel.app/newsletter" />
      </Helmet>
      <Navbar />
      <br/>
      <br/>
      <div className={style.container}>
        <div className={style.header}>
        
        </div>

        <div className={style.menu}>
          <h3>Por que se juntar aos líderes que já assinam nossa newsletter?</h3>
          
          <p className={style.welcomeText}>
            Em um mundo de excesso de informações, oferecemos curadoria especializada. Nossa equipe de editores 
            seleciona diariamente os acontecimentos mais relevantes do mercado, política, tecnologia e inovação, 
            apresentando-os com profundidade jornalística e visão estratégica.
          </p>

          <blockquote className={style.quote}>
            "A newsletter do Axios News transformou minha maneira de consumir notícias. Em 10 minutos por dia, 
            consigo captar o essencial para minhas decisões estratégicas." 
            <br />— Kernel Box
          </blockquote>

          <p className={style.welcomeText}>
            Nossa missão é fornecer informações que importam, com contexto que faz diferença. 
            Junte-se a uma comunidade de profissionais que valorizam conteúdo de qualidade.
          </p>
        </div>

        <div className={style.content}>
          <form className={style.card} onSubmit={onSubmit}>
            <h2 className={style.title}>Inscreva-se agora</h2>
            <p className={style.subtitle}>
              Comece a receber nossa newsletter premium diretamente no seu email. 
              Primeira semana gratuita, depois R$ 29,90/mês. Cancele quando quiser.
            </p>

            <input
              type="email"
              name="email"
              required
              placeholder="seu.email@exemplo.com"
              className={style.input}
            />

            <button 
              type="submit" 
              className={style.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Começar minha assinatura"}
            </button>

            {result && (
              <div className={`
                ${style.resultMessage} 
                ${result.includes("sucesso") ? style.success : style.error}
              `}>
                {result}
              </div>
            )}

            <p className={style.privacy}>
              Ao se inscrever, você concorda com nossos Termos de Uso e Política de Privacidade. 
              Prometemos não compartilhar seus dados e enviar apenas conteúdo relevante.
            </p>
          </form>
        </div>

        <div className={style.footer}>
          
        </div>
        <br/>
      </div>
    </>
  );
}

export default Newsletter;