import style from "./Forum.module.css";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function Forum() {
    return(
        <>
            <Navbar />
            <main className={style.Forummain}>
                <h1 className={style.h1main}> Essa pagina ainda está em desenvolvimento</h1>
                <h3 className={style.h3main}>assim que terminar a versão 3.0.1</h3>
                <p>mais informações Whatsapp : (82) 9888-3225 </p>
                <p>assinatura : Axios_Feth </p>
            </main>
            <Footer />
        </>
    );
}

export default Forum;