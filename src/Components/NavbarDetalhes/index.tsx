import style from "./Navbar.module.css";
import Menu from "../../assets/icons/Menu.ico";
import { useState } from "react";
import { FaUser } from "react-icons/fa"; 

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
       <div className={style.header}>
            <header className={style.container}>
                <div className={style.menuAndLogo}>
                    
                    <div className={style.iconmenu} onClick={toggleMenu}>
                       <img src={Menu} alt="icon-menuLateral" />
                    </div>
                    
                    {/* Logo e nome do site */}
                    <div className={style.textonav}>
                        <div className={style.container_Palavras}>
                            <div className={style.palavras}>
                                    <h2>Axios News</h2>
                            </div>
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
                            <a href="/Notficacao" onClick={closeMenu}>Sistema</a>
                        </li>
                        <li>
                            <a href="https://ecommerce-delta-ten-22.vercel.app/">Loja</a>
                        </li>
                        <li>
                            <a href="/Forum" onClick={closeMenu}>Fóruns</a>
                        </li>
                        <li>
                            <a href="/Vagas" onClick={closeMenu}>Vagas de emprego</a>
                        </li>
                        {/* "Cadastre-se" movido para depois de "Vagas de emprego" */}
                        <li>
                            <a className={style.cadastrese} href="/contato" onClick={closeMenu}>
                                <FaUser className={style.userIcon} />
                                Contate-me
                            </a>
                        </li>
                    </ul>    
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