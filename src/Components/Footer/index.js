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
                    <h3>Projeto de Código aberto</h3>
                    <a href="https://github.com/ronaldoreemias/axios-V2.0"><p>Guithub do projeto</p></a>
                    <a href="www.linkedin.com/in/ronaldo-reemias-b66b7a166" ><p>linkedin</p></a>
                    
                </div>
                <div>
                    <h3>Contato</h3>
                    <p>ronaldo12345@gmail.com</p>
                    <p>número: (82) 9 8887-3225</p>
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
