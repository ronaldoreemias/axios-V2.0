import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Vagas from "./pages/vagas";
import Forum from "./pages/forum";
import Notificacao from "./pages/notificacao";
import ContactForm from "./pages/contato";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/notificacao" element={<Notificacao />}></Route>
                <Route path="/forum" element={<Forum />}></Route>
                <Route path="/vagas" element={<Vagas />}></Route>
                <Route path="/contato" element={<ContactForm />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
