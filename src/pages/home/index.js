import style from "./home.module.css";
import Navbar from "../../components/navbar";
import Destaque from "../../components/destaque";
import Alerta from "../../components/alertaloja";
import NoticiasGeral from "../../components/noticias";
import DestaqueVagas from "../../components/destaquevagas";
import Contato from "../contato";
import Footer from "../../components/footer";

function Home() {
    return (
        <>
            <Alerta />
            <div className={style.containerHome}>
                <div className={style.headerHome}>
                    <Navbar />
                </div>

                <div className={style.menuHome}>
                    <Contato />
                </div>

                <div className={style.contentHome}>
                    <Destaque />
                    <br />
                    <NoticiasGeral />
                    <Footer />
                </div>

                <div className={style.NoticiasHome}>
                    <div className={style.vagasDaSemana}>
                        <p>Vagas da semana</p>
                    </div>
                    <DestaqueVagas />
                </div>

                <div className={style.footerHome}></div>
            </div>
        </>
    );
}
export default Home;
