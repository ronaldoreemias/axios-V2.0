import style from "./Home.module.css";
import Navbar from "../../Components/Navbar";
import Destaque from "../../Components/destaque";
import Alerta from "../../Components/alertaloja";
import NoticiasGeral from "../../Components/noticias";
import DestaqueVagas from "../../Components/destaqueVagas";
import Contato from "../contato";

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
        <br/>
        <NoticiasGeral />
      </div>
      
      <div className={style.NoticiasHome}>
        <div className={style.vagasDaSemana} >
          <p>Vagas da semana</p>
        </div>
        <DestaqueVagas />
      </div>

      <div className={style.footerHome}>
      </div>
    </div>

    </>

  );
}
export default Home;