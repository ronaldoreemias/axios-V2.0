import style from "./Forum.module.css";
import Navbar from "../../Components/Navbar";

function Forum(){
    return(
        <div className={style.container}>
            <div className={style.header} >
                <Navbar />
            </div>
            
            <div className={style.content} >
                 Forum ainda está sendo desenvolvido
                 <br/>
                        versão 10.0.3
                    <br/>
                    caso queira contribuir 
                        <br/>
                        entre em contato
            </div>
        </div>
    );
}

export default Forum;