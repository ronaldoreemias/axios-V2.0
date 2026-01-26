import Style from "./Style.module.css";
import { useState, useEffect } from "react";
import imagemprimo from "../../assets/slide/E-commerce.jpg";
import imagemsegundo from "../../assets/slide/E-commerce2.jpg";
import imagemterceiro from "../../assets/slide/a partir de R$500,00.jpg";

const images = [
  imagemprimo,
  imagemsegundo,
  imagemterceiro,
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", margin: "auto" , height: "100%" }}>
      <img
        src={images[index]}
        alt={`Slide ${index}`}
        className={Style.imagem}
      />
    </div>
  );
}
