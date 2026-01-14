import style from "./Home.module.css";
import { useEffect, useRef } from "react";
import Destaque from "../../Components/destaque";
import Comentarios from "../../Components/comentarios";
import Noticias from "../../Components/noticias";
import Destaque2 from "../../Components/destaque2"
import Vagas from "../../Components/destaqueVagas";
import Navbar from "../../Components/Navbar";
import NavbarFooter from "../../Components/NavbarFooter";
import Footer from "../../Components/Footer";
import AlertaSistema from "../../Components/alertaloja";
import Newletter from "../../Components/Newsletter";
import Reels from "../../Components/Reels";

function Home() {
    const menuRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const menu = menuRef.current!;
        const header = headerRef.current!;

        // Narrowing definitivo
        if (!menu || !header) return;

        const headerHeight = header.offsetHeight;

        function handleScroll() {
            if (window.scrollY > headerHeight) {
                // Adiciona a classe do CSS module
                menu.classList.add(style.fixed);
            } else {
                // Remove a classe do CSS module
                menu.classList.remove(style.fixed);
            }
        }

        window.addEventListener("scroll", handleScroll);
        
        // Executa uma vez para definir o estado inicial
        handleScroll();
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return(
        <>
            <AlertaSistema />
            
            <div className={style.ContentHome}>
                       
            {/* Header igual ao Euronews */}

            <div ref={headerRef} className={style.Homeheader}>
                <p>Jornal feito por dev para devs</p>
            </div>
            
            {/* Menu horizontal estilo Euronews - AQUI A REF É APLICADA */}
            <div ref={menuRef} className={style.Homemenu}>
                <Navbar />
            </div>

            {/* Área de Reels  */}
            <div className={style.HomeReels}>
                <div className={style.titulo}>
                    Notícias do Reels
                </div>
                <Reels />
            </div>
            

            {/* Área de Destaques */}
            <div className={style.HomeDestaques}>
                <Destaque />
            </div>

            {/* Área de Destaques Desk-top */}
            <div className={style.HomeDestaquesDeskTop}>
                <div className={style.titulo}>
                    Notícias sobre Tecnologia
                </div>
                <Destaque2 />
            </div>

            {/* Área de Anúncio - banner horizontal */}
            <div className={style.HomeAd}>
                <p>Área de Publicidade</p>
            </div>

            {/* Sidebar (coluna direita) - como no Euronews */}
            <div className={style.Homevagas} >
                <div className={style.vagasDestaque}>
                    Vagas de emprego ( Destaque da semana )
                </div>
                <Vagas />
            </div>

            {/* Conteúdo Principal (coluna esquerda) */}
            <div className={style.Homecontent}>
                <Noticias />
            </div>
            
            {/* Sidebar (coluna direita) - como no Euronews */}
            <div className={style.HomeSidebar} >
                <Comentarios />
            </div>

            {/* Área de Anúncio - banner horizontal */}
            <div className={style.HomeAd2}>
                <p>Área de Publicidade</p>
            </div>
            
            {/* Área de Mais notícias */}
            <div className={style.HomeMaisNoticias} >
                <Newletter />
            </div>
            
            {/* Footer */}
            <div className={style.Homefooter}>
                <Footer />
            </div>

            {/* footerMobile */}
            <div className={style.HomefooterMobile}>
                <NavbarFooter />
            </div>
        </div>
        </>
    );
}

export default Home;