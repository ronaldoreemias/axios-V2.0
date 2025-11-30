import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Loja from "./pages/loja";
import Vagas from "./pages/Vagas";
import Forum from "./pages/Forum";
import Notificacao from "./pages/Notificacao";

function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home/> } ></Route>
                <Route path="/Notficacao" element={ <Notificacao/> } ></Route>
                <Route path="/Loja" element={ <Loja/> } ></Route>
                <Route path="/Forum" element={ <Forum/> } ></Route>
                <Route path="/Vagas" element={ <Vagas/> } ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;