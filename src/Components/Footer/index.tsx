import style from "./Footer.module.css";
import WhatsappIcon from "../../assets/whatsapp_icon_161055.ico";
import InstagramIcon from "../../assets/instagram_icon_161086.ico";

function Footer() {
    return (
        <footer className={style.FooterContainer}>
            
            
            <div className={style.FooterHeader}>
                
                <a href="https://whatsapp.com/channel/0029Vb7AosZ35fM560l8J30M">
                    
                    <div className={style.Whatsapp}>
                        <img src={WhatsappIcon} />
                        Entrar no nosso canal do WhatsApp
                    </div>
                </a>

                <a href="https://www.instagram.com/axios_news?igsh=cG9pYXd4cHcxOGVo">
                    
                    <div className={style.Instagram}>
                        <img src={InstagramIcon} />
                        Nos seguir no Instagram
                    </div>
                </a>
            </div>

            
            <div className={style.FooterContent}>
                <div className={style.Sobre}>
                    <h3>Sobre o Axios News</h3>
                    <p>Seu destino para as melhores ofertas em produtos de tecnologia, 
                        informações atualizadas sobre o mundo tech, vagas de emprego 
                        e Comunidade no whatsapp e fórum (ainda em desenvolvimento ).
                    </p>
                </div>

                <div className={style.Parceiros}>
                    <h3>Parceiros e Colaboradores</h3>
                    <p>KernelBox</p>
                    <p>Ronaldo</p>
                    <p>Ana Karla</p>

                </div>

                <div className={style.Contato}>
                    <h3>Redes de Contato</h3>
                    <p>Email : axiosNews@gmail.com</p>
                    <p>WhatsApp (82) 9 8887-3225 </p>
                </div>
            </div>

            
            <div className={style.FooterBottom}>
                <h4>Axios News © 2026</h4>
                <p>Jornalismo independente e de qualidade</p>
                <p>axiosnews@gmail.com.br | (82) 98887-3225</p>
            </div>

        </footer>
    );
}

export default Footer;
