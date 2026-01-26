import Style from "./Style.module.css";
import { useState, useEffect, useCallback } from "react";
import imagemprimo from "../../assets/freelancer.jpg";
import imagemsegundo from "../../assets/shoping.jpg";
import imagemterceiro from "../../assets/ecommerce.jpg";

const images = [
  { src: imagemprimo, alt: "Promoção de E-commerce" },
  { src: imagemsegundo, alt: "Ofertas especiais" },
  { src: imagemterceiro, alt: "Produtos a partir de R$500" },
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Navegação para o slide anterior
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Navegação para o próximo slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  // Navegação direta para um slide específico
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // Pausar o autoplay quando o mouse está sobre o slider
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Auto-play com intervalo
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 4000); // 4 segundos entre transições

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  return (
    <div 
      className={Style.sliderContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container dos slides */}
      <div 
        className={Style.slidesContainer}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className={Style.slide}>
            <img
              src={image.src}
              alt={image.alt}
              className={Style.imagem}
              loading={index === 0 ? "eager" : "lazy"} // Otimização de carregamento
            />
            <div className={Style.overlay}></div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button 
        className={`${Style.navButton} ${Style.prevButton}`}
        onClick={goToPrevious}
        aria-label="Slide anterior"
      >
        ‹
      </button>
      
      <button 
        className={`${Style.navButton} ${Style.nextButton}`}
        onClick={goToNext}
        aria-label="Próximo slide"
      >
        ›
      </button>

      {/* Indicadores de posição (bolinhas) */}
      <div className={Style.indicators}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${Style.indicator} ${currentIndex === index ? Style.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador de slides */}
      <div className={Style.slideCounter}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}