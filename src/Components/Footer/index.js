import style from "./Footer.module.css";

function Footer(){
    return(
        <footer className={style.footer}>
            <br/>
            <div className={style.arealinks}>
                <div>
                    <h3>Axios Tecnologia</h3>
                    <p>Seu destino para as melhores ofertas em produtos 
                    de tecnologia, 
                    informações atualizadas sobre o mundo tech,
                    vagas de emprego e Comunidade no whatsapp e fórum (ainda em desenvolvimento )</p>
                </div>
                <div>
                    <h3>Categorias</h3>
                    <p>Tecnologia em geral</p>
                    <p>cyber secutity</p>
                    <p>Front-end</p>
                    <p>Back-end</p>
                    <p>Estudantes de Tecnologo</p>
                </div>
                <div>
                    <h3>Contato</h3>
                </div>

            </div>
            <br/>
            <div className={style.areatextofooter}>
                <p>© 2025 Axios_fetch. Todos os direitos reservados.</p>
            </div>
            <br/>
        </footer>
    );
}

export default Footer;
