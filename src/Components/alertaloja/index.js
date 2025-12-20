import { useEffect, useState } from "react";
import style from "./alerta.module.css";
import alertaimagem from "../../assets/icons/iconfinder-viral-market-4341319_120565.ico";

export default function Alerta() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [finished, setFinished] = useState(false);

    const textos = [
    { id: 1, text: "Oi ! Vem visite nossa loja.", href: "https://ecommerce-delta-ten-22.vercel.app/" },
    { id: 2, text: "", href: "" },
    { id: 3, text: "Novos produtos chegando esta semana!.", href: "https://ecommerce-delta-ten-22.vercel.app/" },
    { id: 4, text: "", href: "" },
    { id: 5, text: "Estou em busca de testadores beta para o fórum", href: "/Forum" }

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