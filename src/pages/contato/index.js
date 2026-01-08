import style from "./contato.module.css";
import { useState } from "react";

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
                body: formData,
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

            setTimeout(() => {
                setResult("");
            }, 5000);
        }
    };

    return (
        <form id="inbox" className={style.contactForm} onSubmit={onSubmit}>
            <h3>Entre em contato</h3>
            <div className={style.linha}></div>
            <input type="text" id="name" name="name" className={style.formInput} required placeholder="seu nome" />

            <br />

            <input type="email" id="email" name="email" className={style.formInput} required placeholder="seu email" />

            <br />
            <div className={style.formGroup}>
                <label htmlFor="message">Mensagem:</label>
                <textarea
                    id="message"
                    name="message"
                    className={style.formTextarea}
                    required
                    rows="4"
                    placeholder="Digite seu pedido detalhado aqui..."
                />
            </div>

            <button type="submit" className={style.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
            </button>

            {result && (
                <div
                    className={`
          ${style.resultMessage}
          ${result.includes("sucesso") ? style.success : style.error}
        `}
                >
                    {result}
                </div>
            )}
        </form>
    );
}

export default ContactForm;
