import Style from "./style.module.css";
import { useState, useEffect } from "react";
import imagemprimo from "../../assets/slide/seguranca.jpg";
import imagemsegundo from "../../assets/slide/monitor-32-polegadas.jpg";
import imagemterceiro from "../../assets/slide/E-commerce.jpg";

const images = [imagemprimo, imagemsegundo, imagemterceiro];

export default function ImageSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: "100%", margin: "auto", height: "100%" }}>
            <a href="https://ecommerce-delta-ten-22.vercel.app/">
                <img src={images[index]} alt={`Slide ${index}`} className={Style.imagem} />
            </a>
        </div>
    );
}
