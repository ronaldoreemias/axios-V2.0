import style from "./forum.module.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function Forum() {
    return (
        <>
            <Navbar />
            <main className={style.Forummain}>
                <h1 className={style.h1main}> Essa pagina ainda está em desenvolvimento</h1>
                <h3 className={style.h3main}>assim que terminar a versão 1.37.11</h3>
                <h3 className={style.h3main}>vagas abertas para deve Java JSP Servlet</h3>
                <p>mais informações Whatsapp : (82) 9888-3225 </p>
                <p>assinatura : Axios_Feth </p>
            </main>
            <Footer />
        </>
    );
}

export default Forum;
