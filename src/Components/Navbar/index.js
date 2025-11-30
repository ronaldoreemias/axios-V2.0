import style from "./Navbar.module.css";
import Logo from "../../assets/icons/wordblue.ico";
import Menu from "../../assets/icons/Menu.ico";
import { useState } from "react";

function Navbar(){
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
                <div className={style.textonav}>
                    <img src={Logo} alt="logo-tipoAxios" />
                    <h2>Axios Tecno</h2>
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
                            <a href="/Loja" onClick={closeMenu}>Loja</a>
                        </li>
                        <li>
                            <a href="/Forum" onClick={closeMenu}>fóruns</a>
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