import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./Components/comentarios";
import Contato from "./pages/contato";
import Notificacao from "./pages/Notificacao";
import Vagas from "./pages/Vagas"
import DhanteConfig from "./pages/dhanteconfig";
import Home2 from "./pages/TesteHomeNovo";
import PostagemDetalhe from "./Components/PostagemDetalhe";

function AppRouter(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/Comentarios" element={<Chat />} />
                <Route path="/Notficacao" element={<Notificacao />} />
                <Route path="/Vagas" element={<Vagas />} />
                <Route path="/DhanteConfig" element={<DhanteConfig />} />
                <Route path="/Home2" element={<Home2 />} />
                <Route path="/postagensgeral/:id" element={<PostagemDetalhe />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;