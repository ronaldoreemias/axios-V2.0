import Style from "./Navbar.module.css";
import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import carrinho from "../../../public/axiols.jpg";
import lupa from "../../assets/lupa.ico";

// Interface para tipar os produtos
interface Produto {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  link: string;
  desconto: string;
  preco: string;
  categoria: string;
}

function FormFiltrar() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produto, setProduto] = useState<string>("");
  const [resultados, setResultados] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const resultadosRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultadosRef.current &&
        !resultadosRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setResultados([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Carregar produtos
  useEffect(() => {
    setIsLoading(true);
    fetch("/Dbjason/Produtosvariados.json")
      .then(response => response.json())
      .then(data => {
        setProdutos(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar produtos:", error);
        setIsLoading(false);
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar os produtos',
          icon: 'error'
        });
      });
  }, []);

  // Função para sanitizar entrada
  function sanitizeInput(input: string): string | null {
    const s = input.trim();
    if (s.length === 0) return "";
    if (s.length > 200) return s.slice(0, 200);

    const patterns = [
      /</, />/, /<\//, /`/, /;|--/, /\/\*/, /\*\//, /\$/, /\%/,
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC|UNION)\b/i
    ];

    if (patterns.some((rx) => rx.test(s))) return null;
    return s;
  }

  // Filtrar produtos
  function filtrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sanitized = sanitizeInput(produto);

    if (sanitized === null) {
      Swal.fire({
        title: 'Entrada inválida',
        text: 'Foram detectados caracteres suspeitos na sua pesquisa.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!sanitized) {
      Swal.fire({
        title: 'Digite algo',
        text: 'Digite o nome de um produto para pesquisar',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsLoading(true);
    
    // Simular delay para UX (remover em produção)
    setTimeout(() => {
      const filtrados = produtos.filter(p =>
        p.titulo.toLowerCase().includes(sanitized.toLowerCase()) ||
        p.descricao.toLowerCase().includes(sanitized.toLowerCase())
      );

      setResultados(filtrados);
      setIsLoading(false);

      if (filtrados.length === 0) {
        Swal.fire({
          title: 'Nenhum resultado',
          text: `Não encontramos produtos para "${sanitized}"`,
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    }, 300);
  }

  // Limpar pesquisa
  function limparPesquisa() {
    setProduto("");
    setResultados([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div className={Style.naotenhomaiscriatividade}>
      <form 
        id="formulariofiltragem" 
        className={Style.formefiltrar} 
        onSubmit={filtrar}
      >
        <input
          ref={inputRef}
          value={produto}
          onChange={(e) => {
            setProduto(e.target.value);
            // Busca automática enquanto digita (opcional)
            if (e.target.value.length >= 2) {
              const filtrados = produtos.filter(p =>
                p.titulo.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setResultados(filtrados.slice(0, 8)); // Limita a 8 resultados
            } else {
              setResultados([]);
            }
          }}
          type="text"
          id="produto"
          placeholder="Buscar produtos, marcas e muito mais..."
          className={Style.textoforme}
          aria-label="Buscar produtos"
        />
        
        {produto && (
          <button 
            type="button" 
            onClick={limparPesquisa}
            className={Style.limparButton}
            aria-label="Limpar pesquisa"
          >
            ×
          </button>
        )}
        
        <button 
          type="submit" 
          value="Pesquisar" 
          className={Style.buttonforme}
          aria-label="Pesquisar"
        >
          <img src={lupa} alt="Pesquisar" />
        </button>
      </form>

      {/* Resultados da pesquisa */}
      {(resultados.length > 0 || isLoading) && (
        <div ref={resultadosRef} className={Style.resultados}>
          {isLoading ? (
            // Skeleton loading
            [...Array(3)].map((_, index) => (
              <div key={index} className={`${Style.resultadoItem} ${Style.loading}`}>
                <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '6px' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ width: '70%', height: '16px', background: '#eee', marginBottom: '8px', borderRadius: '3px' }}></div>
                  <div style={{ width: '90%', height: '12px', background: '#eee', borderRadius: '3px' }}></div>
                </div>
              </div>
            ))
          ) : (
            resultados.map(r => (
              <div key={r.id} className={Style.resultadoItem}>
                <a 
                  href={r.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    setResultados([]); // Fecha resultados ao clicar
                    setProduto(""); // Limpa o campo de busca
                  }}
                >
                  <img src={r.imagem} alt={r.titulo} loading="lazy" />
                  <div className={Style.areatexto}>
                    <h3>{r.titulo}</h3>
                    <p>{r.descricao}</p>
                    <div className={Style.precoContainer}>
                      {r.desconto && (
                        <span className={Style.desconto}>{r.desconto}</span>
                      )}
                      <span className={Style.preco}>{r.preco}</span>
                    </div>
                  </div>
                </a>
              </div>
            ))
          )}
          
          {resultados.length > 0 && !isLoading && (
            <div className={Style.footerResultados}>
              <small>{resultados.length} produto(s) encontrado(s)</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  return (
    <div className={Style.Navbar}>
      <div className={Style.partedecima}>
        <div className={Style.logo}>
          <a href="/">
          <img src={carrinho} alt="Logo Loja Axios" />
          
            <h1>Axios Shopping</h1>
          </a>
        </div>
        <div className={Style.pesquisa}>
          <FormFiltrar />
        </div>
        
      </div>
    </div>
  );
}

export default Navbar;