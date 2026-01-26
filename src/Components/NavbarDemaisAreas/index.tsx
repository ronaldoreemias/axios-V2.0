import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Navbar.module.css";
import Logoimagem from "../../assets/imagensNavbar/logoNavbar.png";

// Tipos
interface MenuItem {
    id: string;
    label: string;
    url: string;
    icon?: string;
}

interface MenuSection {
    title: string;
    icon: string;
    items: MenuItem[];
}

// Categorias do SEU painel de cadastro + abas específicas
const menuSections: MenuSection[] = [
    {
        title: "Menu",
        icon: "☰",
        items: [
            
        ]
    },
    {
        title: "Navegação Principal",
        icon: "",
        items: [
            { id: "14", label: "Home", url: "/" },
            { id: "15", label: "APIs", url: "/apis" },
            { id: "16", label: "Axios Shopping", url: "/Loja" },
            { id: "17", label: "Vagas", url: "/vagas" },
            { id: "17", label: "Contato", url: "/Contato" },
            { id: "17", label: "Newsletter", url: "/newsletter" },
        ]
    }
];

// Categorias para barra principal desktopgi
const mainCategories = [
    { label: "Home", url: "/", active: true },
    { label: "APIs", url: "/apis" },
    { label: "Axios Shopping ", url: "/Loja" },
    { label: "Vagas de Empregos", url: "/vagas" },
    { label: "Contato", url: "/Contato" },
    { label: "newsletter", url: "/Newsletter" },

];

// Componente Menu Hamburguer
function MenuHamburguer({ isOpen, toggleMenu }: { isOpen: boolean; toggleMenu: () => void }) {
    return (
        <div 
            className={`${style.Menu} ${isOpen ? style.active : ''}`} 
            onClick={toggleMenu}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
        >
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

// Componente de Pesquisa - Conectado ao seu backend
function Pesquisa() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // No componente Pesquisa da sua navbar (index.tsx)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!searchTerm.trim()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('https://backendpostagens.vercel.app/api/handler?type=postagensgeral');
            
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            
            const data = await response.json();
            
            // Filtrar resultados
            const resultados = data.filter((post: any) => 
                post.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.autor?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            // Redireciona para página de resultados com TODOS os resultados
            navigate('/resultados-busca', {
                state: {
                    resultados: resultados, // Todos os resultados filtrados
                    termo: searchTerm
                }
            });
            
            setSearchTerm('');
        } catch (error) {
            console.error('Erro na busca:', error);
            navigate('/resultados-busca', {
                state: {
                    resultados: [],
                    termo: searchTerm
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={style.searchContainer}>
            <form className={style.formpesquisa} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar notícias tech..."
                    aria-label="Buscar notícias de tecnologia"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'buscando..' : 'Buscar'}
                </button>
            </form>
        </div>
    );
}

// Menu Lateral
function SideMenu({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) {
    const handleLinkClick = () => {
        closeMenu();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <div 
                className={`${style.overlay} ${isOpen ? style.active : ''}`} 
                onClick={closeMenu}
                role="button"
                tabIndex={0}
                aria-label="Fechar menu"
                onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
            />
            
            <div className={`${style.sideMenu} ${isOpen ? style.active : ''}`}>
                <div className={style.menuHeader}>
                    <h3>Axios news Notícias</h3>
                    <button 
                        className={style.closeButton}
                        onClick={closeMenu}
                        aria-label="Fechar menu"
                    >
                        ×
                    </button>
                </div>
                
                <div className={style.menuContent}>
                    {menuSections.map((section) => (
                        <div key={section.title} className={style.menuSection}>
                            <h4>
                                <span>{section.icon}</span>
                                {section.title}
                            </h4>
                            <ul>
                                {section.items.map((item) => (
                                    <li key={item.id}>
                                        <a 
                                            href={item.url} 
                                            onClick={handleLinkClick}
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                           
                    
                </div>
            </div>
        </>
    );
}

// Componente principal Navbar
function NavbarDemaisAreas() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className={style.ContainerNavbar} role="navigation">
                {/* Menu Hamburguer (visível em mobile) */}
                <MenuHamburguer isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                
                {/* Logo centralizada - Sobre a navbar */}
                <div className={style.logoContainer}>
                    <a href="/" aria-label="TechDev News - Portal de Tecnologia">
                        <img 
                            src={Logoimagem} 
                            alt="TechDev News - Notícias para Desenvolvedores" 
                            className={style.logo}
                        />
                    </a>
                </div>
                
                {/* Menu de Categorias (visível em desktop) */}
                <div className={style.categoriesMenu}>
                    <ul>
                        {mainCategories.map((cat) => (
                            <li key={cat.label}>
                                <a 
                                    href={cat.url} 
                                    className={window.location.pathname === cat.url || 
                                              (cat.url.includes('/categoria') && 
                                               window.location.pathname.includes(cat.url.split('/')[2])) ? 
                                              style.active : ''}
                                >
                                    {cat.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Barra de Pesquisa (visível em desktop) */}
                <Pesquisa />
            </nav>
            
            {/* Menu Lateral (funciona em mobile e desktop) */}
            <SideMenu isOpen={isMenuOpen} closeMenu={closeMenu} />
        </>
    );
}

export default NavbarDemaisAreas;