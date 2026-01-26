import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar";
import style from "./Home.module.css";
import Slide from "../../components/Slide/index";
import Postagem from "../../components/Postagens";
import Destaque from "../../components/Destaque";
import Footer from "../../components/Footer";
import SlideLoja from "../SlideLoja"

function Home(){
    return(
        <div className={style.containerHome}>
            <Helmet>
                <title>Axios News - Notícias de Tecnologia, Vagas e E-commerce | Portal Tech Brasil</title>
                <meta name="description" content="Fique por dentro das últimas notícias de tecnologia, vagas de emprego, oportunidades de freelancer e novidades do e-commerce. Conteúdo atualizado diariamente no maior portal de notícias tech do Brasil." />
                <meta name="keywords" content="notícias tecnologia, vagas de emprego, freelancer, e-commerce, desenvolvedor, programação, carreira tech, oportunidades" />
                <meta name="author" content="Axios News" />
                <meta name="robots" content="index, follow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Axios News - Notícias de Tecnologia e Vagas" />
                <meta property="og:description" content="Portal de notícias focado em tecnologia, vagas e oportunidades de carreira" />
                <meta property="og:url" content="https://axiosnews.vercel.app" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Axios News - Notícias Tech" />
                <meta name="twitter:description" content="Notícias, vagas e oportunidades em tecnologia" />
                <link rel="canonical" href="https://axiosnews.vercel.app/" />
            </Helmet>
            
            <div className={style.headerHome}>
                <Navbar />
            </div>
            <div className={style.menuHome}>
                <Slide />
            </div>
            <div className={style.DestaqueHome}>
                <br/>
                <Destaque />
            </div>
            <div className={style.contentSlideLoja}>
                <SlideLoja />
            </div>
            <div className={style.contentHome}>
                <Postagem />
            </div>
            <div className={style.footerHome}>
                <Footer />
            </div>
        </div>
    );
}

export default Home;