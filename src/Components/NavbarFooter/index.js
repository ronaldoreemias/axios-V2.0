import style from "./Navbar.module.css";
import { FaBell, FaStore, FaEnvelope, FaComments, FaBriefcase } from "react-icons/fa";


function NavbarFooter() {
    return (
       <div className={style.headerFooter}>
            <header className={style.containerFooter}>
                <nav className={style.navFooter}>
                    <ul className={style.navListFooter}>
                        <li>
                            <a href="/Notficacao">
                                <FaBell /> 
                            </a>
                        </li>
                        <li>
                            <a href="https://ecommerce-delta-ten-22.vercel.app/">
                                <FaStore /> 
                            </a>
                        </li>
                        <li>
                            <a href="/contato">
                                <FaEnvelope />
                            </a>
                        </li>
                        <li>
                            <a href="/Comentarios">
                                <FaComments />
                            </a>
                        </li>
                        <li>
                            <a href="/Vagas">
                                <FaBriefcase />
                            </a>
                        </li>
                    </ul>    
                </nav>
            </header>
       </div>
    );
}

export default NavbarFooter;