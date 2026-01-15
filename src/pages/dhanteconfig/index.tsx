import style from "./dante.module.css";
import CadastrarPostagem from "../../Components/PostarNoticias";

function PainelControle(){
  return(
    <div className={style.controlesCentrais}>
      <CadastrarPostagem />
    </div>
  );
}

export default PainelControle;