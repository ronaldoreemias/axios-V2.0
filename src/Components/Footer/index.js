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
                    vagas de emprego e Fórum</p>
                </div>
                <div>
                    <h3>Categorias</h3>
                    <p>Smartphones</p>
                    <p>Notebooks</p>
                    <p>TVs</p>
                    <p>Computadores</p>

                </div>
                <div>
                    <h3>Contato</h3>
                    <p>Email: ronaldoreemias@gmail.com</p>
                    <p>Telefone: (82) 98887-3225</p>
                    <p>Endereço: Rua Projetada, 123 - Maceió, AL</p>
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
