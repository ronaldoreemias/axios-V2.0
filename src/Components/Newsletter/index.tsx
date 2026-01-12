import { useState } from "react";
import style from "./Newsletter.module.css";

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
    <div className={style.wrapper}>
      <form className={style.card} onSubmit={onSubmit}>

        <h2 className={style.title}>Receba notícias exclusivas</h2>
        <p className={style.subtitle}>
          Assine nossa newsletter e receba atualizações do Axios News direto no seu email.
        </p>

        <input
          type="email"
          name="email"
          required
          placeholder="Digite seu email"
          className={style.input}
        />

        <button 
          type="submit" 
          className={style.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Inscrever-se"}
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
    </div>
  );
}

export default Newsletter;
