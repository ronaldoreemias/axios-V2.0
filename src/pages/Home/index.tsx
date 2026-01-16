import style from "./Home.module.css";
import { useEffect, useRef } from "react";
import Destaque from "../../Components/destaque";
import Comentarios from "../../Components/comentarios";
import Destaque2 from "../../Components/destaque2"
import Vagas from "../../Components/destaqueVagas";
import Navbar from "../../Components/Navbar";
import NavbarFooter from "../../Components/NavbarFooter";
import Footer from "../../Components/Footer";
import AlertaSistema from "../../Components/alertaloja";
import Newletter from "../../Components/Newsletter";
import Reels from "../../Components/Reels";
import PostagensGerais from "../../Components/NotasFiscais";

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
            {/* é um alerta que fica flutuando na página , não tocar nisso */}
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

            {/* Área de Reels / mostra os 3 últimos reeels do 
            axios noticias ( página de reels da própia página e não de uma rede social externa)   */}
            <div className={style.HomeReels}>
                <br/>
                <Reels />
                <br/>
            </div>
            

            {/* Área de Destaques / só aparece no mobile */}
            <div className={style.HomeDestaques}>
                <Destaque />
            </div>

            {/* Área de Destaques Desk-top / só aparece no desktop */}
            <div className={style.HomeDestaquesDeskTop}>
                <Destaque2 />
            </div>

            {/* Área de Anúncio - banner horizontal */}
            <div className={style.HomeAd}>
                <p>Área de Publicidade</p>
            </div>

            {/* Sidebar (coluna direita) mostra as vagas em destaque da semana */}
            <div className={style.Homevagas} >
                <Vagas />
            </div>

            {/* Conteúdo Principal (coluna esquerda) noticias em geral, tanto do axios noticias quando 
            de outros sites, linkando para ver a noticias na página original */}
            <div className={style.Homecontent}>
                <PostagensGerais />
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
            
            {/* Footer fica tanto no modo desk quando no mobile, não flutua , não faz nada. Ele é só para ficar no final da página */}
            <div className={style.Homefooter}>
                <Footer />
            </div>

            {/* footerMobile ele flutua e fica */}
            <div className={style.HomefooterMobile}>
                <NavbarFooter />
            </div>
        </div>
        </>
    );
}

export default Home;