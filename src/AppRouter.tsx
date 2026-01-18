import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./Components/comentarios";
import Contato from "./pages/contato";
import Notificacao from "./pages/Notificacao";
import Vagas from "./pages/Vagas"
import DhanteConfig from "./pages/dhanteconfig";
import PostagemDetalhe from "./Components/PostagemDetalhe";
import Newsletter from "./Components/Newsletter";
import Forum from "./pages/Forum"


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
                <Route path="/postagensgeral/:id" element={<PostagemDetalhe />} />
                <Route path="/Newsletter" element={<Newsletter />} />
                <Route path="/Forum" element={<Forum />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;