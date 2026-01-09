import style from "./Home.module.css";
import Navbar from "../../Components/Navbar";
import Noticias from "../../Components/noticias";
import Destaque from "../../Components/destaque";
import DestaqueVagas from "../../Components/destaqueVagas";
import Comentarios from "../../Components/comentarios";
import React from "react";
import Footer from "../../Components/Footer";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo deu errado ao carregar os comentários.</h2>;
    }
    return this.props.children;
  }
}


function Home() {

  return (
  <div className={style.containerHome}>

    <div className={style.headerHome} >
      <Navbar />
    </div>

    <div className={style.menuHome} >
        <ErrorBoundary>
          <Comentarios />
        </ErrorBoundary>

    </div>

    <div className={style.contentHome} >
      <Destaque />
      
      <Noticias />
      <Footer />
    </div>

    <div className={style.NoticiasHome} >
      <div className={style.vagasDaSemana}>
          <p>Vagas da semana ( destaque )</p>
      </div>
      <DestaqueVagas />
    </div>

    <div className={style.footerHome} >
    </div>

  </div>

  );
}
export default Home;