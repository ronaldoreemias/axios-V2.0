import style from "./Navbar.module.css";
import Logo from "../../assets/icons/axios.ico";
import Menu from "../../assets/icons/Menu.ico";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

function Navbar() {
    const palavrasRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        // Animação original das palavras (vertical)
        const el = palavrasRef.current;
        if (!el) return;
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(el, { duration: 3, y: "-2rem", ease: "expo.out" })
          .to(el, { duration: 3, y: "-4rem", ease: "expo.out" })
          .to(el, { duration: 3, y: "-6rem", ease: "expo.out" })
          .to(el, { duration: 3, y: "-8rem", ease: "expo.out" })
          .to(el, { duration: 3, y: "-10rem", ease: "expo.out" })
          .to(el, { duration: 6, y: "-12rem", ease: "expo.out" })
          .to(el, { duration: 3, y: "-14rem", ease: "expo.out" });
        
        return () => {
            tl.kill();
        };
    }, []);

    return (
       <div className={style.header}>
            <header className={style.container}>
                <div className={style.textonav}>
                    <img src={Logo} alt="logo-tipoAxios" />
                    <div className={style.container_Palavras}>
                        <div className={style.palavras} ref={palavrasRef}>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Axios Tecno</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Portal de Notícias</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Fórum</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Vagas de emprego</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Cursos</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Comunidade</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>seja bem vindo !</h2></a>
                            <a href="/" className={style.active} onClick={closeMenu}><h2>Axios Tecno</h2></a>
                        </div>
                    </div>
                </div>
                
                <nav className={style.nav}>
                    {/* Menu para desktop */}
                    <ul className={`${style.navList} ${isMenuOpen ? style.navListActive : ''}`}>
                        <li>
                            <a href="/" className={style.active} onClick={closeMenu}>Notícias</a>
                        </li>
                        <li>
                            <a href="/Notficacao" className={style.active} onClick={closeMenu}>Sistema</a>
                        </li>
                        <li>
                            <a href="https://ecommerce-delta-ten-22.vercel.app/">Loja</a>
                        </li>
                        <li>
                            <a href="https://front-weld-six.vercel.app/" onClick={closeMenu}>fóruns</a>
                        </li>
                        <li>
                            <a href="https://chat.whatsapp.com/FivMCudmv1wENlalqeIth0" onClick={closeMenu}>contrate-me </a>
                        </li>
                        
                        <li>
                            <a href="/Vagas" onClick={closeMenu}>Vagas de emprego</a>
                        </li>
                        
                    </ul>    
                    
                    {/* Ícone do menu hamburger */}
                    <div className={style.iconmenu} onClick={toggleMenu}>
                       <img src={Menu} alt="icon-menuLateral" />
                    </div>
                </nav>

                {/* Overlay quando menu está aberto */}
                <div 
                    className={`${style.overlay} ${isMenuOpen ? style.overlayActive : ''}`}
                    onClick={closeMenu}
                ></div>
            </header>
                   
       </div>
    );
}

export default Navbar;