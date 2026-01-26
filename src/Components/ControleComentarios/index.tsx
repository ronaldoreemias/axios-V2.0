import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ControleRotas.module.css'; // CSS Modules

// Tipos para os estados
interface FormData {
  titulo: string;
  descricao: string;
  imagem: string;
  artigo: string;
  referencias: string;
  autor: string;
  categoria: string;
  texto: string;
  postId: string;
  comentarioPaiId: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
}

type ApiType = 'postagensgeral' | 'comentario' | 'migrar';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function ControleRotas() {
  const [apiUrl, setApiUrl] = useState<string>('https://backendpostagens.vercel.app/api/handler');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ApiType>('postagensgeral');
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod>('GET');
  const [id, setId] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    imagem: '',
    artigo: '',
    referencias: '',
    autor: '',
    categoria: '',
    texto: '',
    postId: '',
    comentarioPaiId: ''
  });

  // Carregar token do localStorage quando o componente montar
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      setAdminUser(storedUser);
    }
    
    // Se não tem token, redireciona para login
    if (!storedToken) {
      setError('Você precisa fazer login para acessar esta página.');
      // Opcional: redirecionar automaticamente
      // navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Verificar se precisa de token
    const requiresAuth = selectedMethod !== 'GET';
    
    if (requiresAuth && !token) {
      setError('Token de autenticação não encontrado. Por favor, faça login primeiro.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = new URL(apiUrl);
      const params = new URLSearchParams();
      
      // Adiciona type como query parameter
      params.append('type', selectedType);
      
      // Adiciona id se existir e for GET, PUT ou DELETE
      if (id && ['GET', 'PUT', 'DELETE'].includes(selectedMethod)) {
        params.append('id', id);
      }
      
      url.search = params.toString();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Adiciona token de autenticação se existir
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method: selectedMethod,
        headers,
      };

      // Adiciona body para POST e PUT quando apropriado
      if (selectedMethod === 'POST' || selectedMethod === 'PUT') {
        let bodyData: any = {};
        
        // Prepara os dados baseado no tipo selecionado
        if (selectedType === 'postagensgeral' && selectedMethod === 'POST') {
          bodyData = {
            titulo: formData.titulo,
            descricao: formData.descricao,
            imagem: formData.imagem,
            artigo: formData.artigo,
            referencias: formData.referencias ? formData.referencias.split(',').map(ref => ref.trim()) : [],
            autor: formData.autor,
            categoria: formData.categoria
          };
        } else if (selectedType === 'comentario' && selectedMethod === 'POST') {
          bodyData = {
            texto: formData.texto,
            autor: formData.autor || "Anônimo",
            postId: formData.postId,
            comentarioPaiId: formData.comentarioPaiId || null
          };
        } else if (selectedType === 'postagensgeral' && selectedMethod === 'PUT') {
          // Para likes, não precisa de body, o handler usa o IP
          bodyData = {};
        }
        
        options.body = JSON.stringify(bodyData);
      }

      const res = await fetch(url.toString(), options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialAction = async (actionType: ApiType, actionMethod: HttpMethod = 'POST') => {
    // Verificar se precisa de token (ações especiais geralmente requerem autenticação)
    if (!token) {
      setError('Token de autenticação não encontrado. Por favor, faça login primeiro.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = `${apiUrl}?type=${actionType}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Adiciona token de autenticação
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: actionMethod,
        headers
      });
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdminUser(null);
    setResponse(null);
    setError(null);
    navigate('/login');
  };

  const handleTokenUpdate = () => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (storedToken) {
      setToken(storedToken);
      setAdminUser(storedUser);
      setError(null);
    } else {
      setError('Nenhum token encontrado no localStorage');
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const renderFormFields = () => {
    if (selectedType === 'postagensgeral' && selectedMethod === 'POST') {
      return (
        <>
          <div className={styles.formGroup}>
            <label>Título:</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Digite o título"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descrição:</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Digite a descrição"
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Imagem (URL):</label>
            <input
              type="text"
              name="imagem"
              value={formData.imagem}
              onChange={handleInputChange}
              placeholder="URL da imagem"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Artigo:</label>
            <textarea
              name="artigo"
              value={formData.artigo}
              onChange={handleInputChange}
              placeholder="Conteúdo do artigo"
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Referências (separadas por vírgula):</label>
            <input
              type="text"
              name="referencias"
              value={formData.referencias}
              onChange={handleInputChange}
              placeholder="ref1, ref2, ref3"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Autor:</label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleInputChange}
              placeholder="Nome do autor"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Categoria:</label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              placeholder="Categoria"
            />
          </div>
        </>
      );
    } else if (selectedType === 'comentario' && selectedMethod === 'POST') {
      return (
        <>
          <div className={styles.formGroup}>
            <label>Texto do Comentário:</label>
            <textarea
              name="texto"
              value={formData.texto}
              onChange={handleInputChange}
              placeholder="Digite o comentário"
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Autor (opcional):</label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleInputChange}
              placeholder="Anônimo"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Post ID (obrigatório):</label>
            <input
              type="text"
              name="postId"
              value={formData.postId}
              onChange={handleInputChange}
              placeholder="ID da postagem"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Comentário Pai ID (opcional):</label>
            <input
              type="text"
              name="comentarioPaiId"
              value={formData.comentarioPaiId}
              onChange={handleInputChange}
              placeholder="ID do comentário pai"
            />
          </div>
        </>
      );
    }
    return null;
  };

  // Se não tem token, mostrar mensagem de login
  if (!token) {
    return (
      <div className={styles.controleRotas}>
        <div className={styles.loginRequired}>
          <h2>🔒 Acesso Restrito</h2>
          <p>Você precisa estar autenticado para acessar o painel de administração.</p>
          <div className={styles.loginButtons}>
            <button 
              onClick={handleNavigateToLogin}
              className={styles.loginButton}
            >
              Ir para Login
            </button>
            <button 
              onClick={handleTokenUpdate}
              className={styles.secondaryButton}
            >
              Tentar Recarregar Token
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.controleRotas}>
      <div className={styles.header}>
        <h1>🏗️ Gerenciador de Rotas da API</h1>
        
        {/* Seção de Status do Token */}
        <div className={styles.tokenSection}>
          <div className={styles.tokenStatus}>
            <strong>Usuário:</strong>
            <span className={styles.tokenValid}>
              {adminUser || 'Administrador'}
            </span>
            <strong>Status:</strong>
            <span className={styles.tokenValid}>
              ✓ Autenticado
            </span>
          </div>
          <div className={styles.tokenButtons}>
            <button 
              type="button" 
              onClick={handleTokenUpdate}
              className={styles.secondaryButton}
            >
              Atualizar Token
            </button>
            <button 
              type="button" 
              onClick={handleLogout}
              className={styles.dangerButton}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.configSection}>
        <div className={styles.formGroup}>
          <label>URL da API:</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setApiUrl(e.target.value)}
            className={styles.apiUrlInput}
          />
        </div>
        
        <div className={styles.controlsRow}>
          <div className={styles.formGroup}>
            <label>Tipo (type):</label>
            <select 
              value={selectedType} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value as ApiType)}
            >
              <option value="postagensgeral">Postagens Gerais</option>
              <option value="comentario">Comentários</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Método HTTP:</label>
            <select 
              value={selectedMethod} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedMethod(e.target.value as HttpMethod)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>ID (para GET/PUT/DELETE):</label>
            <input
              type="text"
              value={id}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
              placeholder="ID do recurso"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.requestForm}>
        {renderFormFields()}
        
        <div className={styles.formButtons}>
          <button 
            type="submit" 
            disabled={loading}
            className={selectedMethod !== 'GET' ? styles.protectedButton : ''}
          >
            {loading ? 'Enviando...' : 'Enviar Requisição'}
            {selectedMethod !== 'GET' && <span className={styles.authBadge}>🔒</span>}
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              setFormData({
                titulo: '',
                descricao: '',
                imagem: '',
                artigo: '',
                referencias: '',
                autor: '',
                categoria: '',
                texto: '',
                postId: '',
                comentarioPaiId: ''
              });
              setId('');
              setResponse(null);
              setError(null);
            }}
          >
            Limpar Formulário
          </button>
        </div>
      </form>

      <div className={styles.specialActions}>
        <h3>Ações Especiais: <span className={styles.authRequired}>🔒 Requer Autenticação</span></h3>
        <div className={styles.actionButtons}>
          <button 
            onClick={() => handleSpecialAction('comentario', 'DELETE')}
            className={styles.danger}
            disabled={loading}
            title="Esta ação requer autenticação"
          >
            🗑️ Apagar Todos os Comentários
          </button>
          
          <button 
            onClick={() => handleSpecialAction('migrar', 'POST')}
            className={styles.warning}
            disabled={loading}
            title="Esta ação requer autenticação"
          >
            🔄 Migrar Comentários
          </button>
          
          <button 
            onClick={() => {
              setSelectedType('postagensgeral');
              setSelectedMethod('GET');
              setId('');
              const syntheticEvent = { preventDefault: () => {} } as FormEvent;
              handleSubmit(syntheticEvent);
            }}
            disabled={loading}
          >
            📋 Listar Todas Postagens
          </button>
          
          <button 
            onClick={() => {
              setSelectedType('comentario');
              setSelectedMethod('GET');
              setId('');
              const syntheticEvent = { preventDefault: () => {} } as FormEvent;
              handleSubmit(syntheticEvent);
            }}
            disabled={loading}
          >
            💬 Listar Todos Comentários
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Processando requisição...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <h3>❌ Erro:</h3>
          <pre>{error}</pre>
        </div>
      )}

      {response && (
        <div className={styles.responseSection}>
          <h3>✅ Resposta da API:</h3>
          <div className={styles.statusInfo}>
            <strong>Status:</strong> {response.status} {response.statusText}
          </div>
          <div className={styles.responseData}>
            <strong>Dados:</strong>
            <pre>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className={styles.apiDocs}>
        <h3>📚 Documentação das Rotas:</h3>
        <div className={styles.endpointsList}>
          <div className={styles.endpoint}>
            <h4>POSTAGENS GERAIS</h4>
            <ul>
              <li><code>GET ?type=postagensgeral</code> - Listar todas</li>
              <li><code>GET ?type=postagensgeral&id=ID</code> - Buscar por ID</li>
              <li><code>POST ?type=postagensgeral</code> - Criar nova <strong className={styles.authMarker}>(Auth)</strong></li>
              <li><code>PUT ?type=postagensgeral&id=ID</code> - Curtir/Descurtir</li>
              <li><code>DELETE ?type=postagensgeral&id=ID</code> - Excluir <strong className={styles.authMarker}>(Auth)</strong></li>
            </ul>
          </div>
          
          <div className={styles.endpoint}>
            <h4>COMENTÁRIOS</h4>
            <ul>
              <li><code>GET ?type=comentario</code> - Listar todos</li>
              <li><code>POST ?type=comentario</code> - Criar novo</li>
              <li><code>DELETE ?type=comentario</code> - Apagar todos <strong className={styles.authMarker}>(Auth)</strong></li>
            </ul>
          </div>
          
          <div className={styles.endpoint}>
            <h4>ESPECIAIS</h4>
            <ul>
              <li><code>POST ?type=migrar</code> - Migrar comentários <strong className={styles.authMarker}>(Auth)</strong></li>
            </ul>
          </div>
        </div>
        <div className={styles.authNote}>
          <strong>Nota:</strong> Rotas marcadas com <strong className={styles.authMarker}>(Auth)</strong> requerem token de autenticação (admin_token).
        </div>
      </div>
    </div>
  );
}

export default ControleRotas;