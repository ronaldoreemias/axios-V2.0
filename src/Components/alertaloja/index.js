import { useEffect, useState } from "react";
import style from "./alerta.module.css";
import alertaimagem from "../../assets/icons/iconfinder-viral-market-4341319_120565.ico";

export default function Alerta() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [finished, setFinished] = useState(false);

    const textos = [
    { id: 1, text: "Oi ! Vem visitar a loja axios.", href: "https://ecommerce-delta-ten-22.vercel.app/" },
    { id: 2, text: "Tem mais vagas de emprego disponiveis !.", href: "https://ecommerce-delta-ten-22.vercel.app/" },
    { id: 3, text: "Estou em busca de testadores beta para o fórum", href: "https://front-weld-six.vercel.app/" },
     { id: 4, text: "A aba Fórum está em desenvolvimento", href: "https://front-weld-six.vercel.app/" },

  ];

  useEffect(() => {
 
    if (finished || currentTextIndex >= textos.length) {
      return;
    }

 
    const showCurrentText = () => {
      setShow(true);
      
 
      const visibleTime = 7000; 
      
      const hideTimer = setTimeout(() => {
 
        setShow(false);
        
 
        const nextTimer = setTimeout(() => {
 
          if (currentTextIndex === textos.length - 1) {
            setFinished(true);
          } else {
 
            setCurrentTextIndex(prev => prev + 1);
          }
        }, 1000); 
        
        return () => clearTimeout(nextTimer);
      }, visibleTime);
      
      return () => clearTimeout(hideTimer);
    };

    showCurrentText();
    return () => {
    };
  }, [currentTextIndex, textos.length, finished]);


  return (
       <div className={style.alerta}>
            <div className={style.imagemalerta}>
            <img src={alertaimagem} alt="alerta" />
            </div>

            {!finished && currentTextIndex < textos.length && (
            <div className={`${style.texto} ${show ? style.show : style.hide}`}>
                <a
                href={textos[currentTextIndex].href}
                target="_blank"
                rel="noopener noreferrer"
                >
                <h3>{textos[currentTextIndex].text}</h3>
                </a>
            </div>
            )}
        </div>
        );

}