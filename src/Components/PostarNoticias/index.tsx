import ControleRotas from "../../Components/ControleComentarios";
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./CadastrarPostagem.module.css";

interface PostagemFormData {
  titulo: string;
  descricao: string;
  imagem: string;
  artigo: string;
  autor: string;
  categoria: string;
  tags?: string;
  dataPublicacao?: string;
  miniatura?: string;
  fonte?: string;
}

export default function CadastrarPostagem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostagemFormData>({
    titulo: "",
    descricao: "",
    imagem: "",
    artigo: "",
    autor: "",
    categoria: "",
    tags: "",
    dataPublicacao: new Date().toISOString().split('T')[0],
    miniatura: "",
    fonte: ""
  });

   const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/Login');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const res = await fetch("https://backendpostagens.vercel.app/api/handler?type=postagensgeral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar postagem");

      const data = await res.json();
      
      setSuccessMessage(`✅ Postagem "${data.titulo}" criada com sucesso!`);
      
      // Reset form
      setFormData({
        titulo: "",
        descricao: "",
        imagem: "",
        artigo: "",
        autor: "",
        categoria: "",
        tags: "",
        dataPublicacao: new Date().toISOString().split('T')[0],
        miniatura: "",
        fonte: ""
      });
      
      // Auto-hide success message
      setTimeout(() => setSuccessMessage(""), 5000);
      
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao cadastrar postagem. Verifique o console para mais detalhes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriasPredefinidas = [
    "I.A",
    "notas-fiscais",
    "Tecnologia",
    "Desenvolvimento",
    "Inteligência Artificial",
    "Carreira",
    "Mobile",
    "Web",
    "DevOps",
    "Banco de Dados",
    "Segurança",
    "Inovação",
    "Startups",
    "Design"
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Header do Dashboard */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            Painel de Controle - Nova Postagem
          </h1>
          <p className={styles.headerSubtitle}>
            Cadastre novas postagens para o seu portal de notícias
          </p>

          <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
          
        </div>
        
        <div className={styles.headerStats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Status:</span>
            <span className={styles.statValue}>Pronto para Publicar</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Última Publicação:</span>
            <span className={styles.statValue}>Hoje</span>
          </div>
        </div>
      </header>

      {/* Mensagem de Sucesso */}
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
          <button 
            onClick={() => setSuccessMessage("")}
            className={styles.closeMessage}
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Principal */}
      <div className={styles.dashboardGrid}>
        
        {/* Coluna Principal - Formulário */}
        <main className={styles.mainContent}>
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Dados da Postagem</h2>
              <span className={styles.cardBadge}>Obrigatório</span>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.postForm}>
              
              {/* Seção 1: Informações Básicas */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  Informações Básicas
                </h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="titulo" className={styles.formLabel}>
                    Título da Postagem *
                  </label>
                  <input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Digite o título da postagem..."
                    className={styles.formInput}
                    required
                    maxLength={120}
                  />
                  <div className={styles.charCount}>
                    {formData.titulo.length}/120 caracteres
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="descricao" className={styles.formLabel}>
                    Descrição / Resumo *
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Digite uma breve descrição da postagem..."
                    className={`${styles.formInput} ${styles.textarea}`}
                    required
                    rows={3}
                    maxLength={200}
                  />
                  <div className={styles.charCount}>
                    {formData.descricao.length}/200 caracteres
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroupHalf}>
                    <label htmlFor="autor" className={styles.formLabel}>
                      Autor *
                    </label>
                    <input
                      id="autor"
                      name="autor"
                      value={formData.autor}
                      onChange={handleChange}
                      placeholder="Nome do autor"
                      className={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroupHalf}>
                    <label htmlFor="categoria" className={styles.formLabel}>
                      Categoria *
                    </label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className={styles.formSelect}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categoriasPredefinidas.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <span className={styles.selectArrow}>▼</span>
                    </div>
                    <div className={styles.customCategory}>
                      <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Ou digite uma categoria personalizada"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Imagens */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>🖼️</span>
                  Imagens e Mídia
                </h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="imagem" className={styles.formLabel}>
                    URL da Imagem Principal *
                  </label>
                  <input
                    id="imagem"
                    name="imagem"
                    value={formData.imagem}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className={styles.formInput}
                    required
                  />
                  <div className={styles.imagePreviewContainer}>
                    {formData.imagem && (
                      <>
                        <div className={styles.previewLabel}>Pré-visualização:</div>
                        <img 
                          src={formData.imagem} 
                          alt="Pré-visualização" 
                          className={styles.imagePreview}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="miniatura" className={styles.formLabel}>
                    URL da Miniaturas (Opcional)
                  </label>
                  <input
                    id="miniatura"
                    name="miniatura"
                    value={formData.miniatura}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/miniatura.jpg"
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Seção 3: Conteúdo */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📄</span>
                  Conteúdo Completo
                </h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="artigo" className={styles.formLabel}>
                    Artigo Completo (suporta Markdown) *
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="artigo"
                    name="artigo"
                    value={formData.artigo}
                    onChange={handleChange}
                    placeholder="Digite o conteúdo completo do artigo aqui... Use os botões abaixo para formatação."
                    className={`${styles.formInput} ${styles.articleTextarea}`}
                    required
                    rows={12}
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <span className={styles.buttonIcon}>🚀</span>
                      Publicar Postagem
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className={styles.draftButton}
                  onClick={() => {
                    // Futura funcionalidade: salvar como rascunho
                    alert('Funcionalidade de rascunho em desenvolvimento!');
                  }}
                >
                  <span className={styles.buttonIcon}>💾</span>
                  Salvar como Rascunho
                </button>
                
                <button
                  type="button"
                  className={styles.previewButton}
                  onClick={() => {
                    // Futura funcionalidade: pré-visualização
                    alert('Funcionalidade de pré-visualização em desenvolvimento!');
                  }}
                >
                  <span className={styles.buttonIcon}>👁️</span>
                  Pré-visualizar
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Sidebar - Painéis de Controle */}
        <aside className={styles.sidebar}>
          
          {/* Card: Pré-visualização */}
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pré-visualização</h3>
            </div>
            <div className={styles.previewCard}>
              {formData.titulo ? (
                <>
                  {formData.imagem && (
                    <img src={formData.imagem} alt="Preview" className={styles.previewImage} />
                  )}
                  <h4 className={styles.previewTitle}>{formData.titulo}</h4>
                  <p className={styles.previewDescription}>
                    {formData.descricao || "Sem descrição..."}
                  </p>
                  <div className={styles.previewMeta}>
                    <span className={styles.previewAuthor}>{formData.autor || "Autor"}</span>
                    <span className={styles.previewCategory}>{formData.categoria || "Categoria"}</span>
                  </div>
                </>
              ) : (
                <div className={styles.emptyPreview}>
                  <span className={styles.emptyIcon}>👁️</span>
                  <p>Preencha o formulário para ver a pré-visualização</p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Estatísticas Rápidas */}
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Estatísticas</h3>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{formData.titulo.length}</div>
                <div className={styles.statLabel}>Caracteres no Título</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{formData.artigo.length}</div>
                <div className={styles.statLabel}>Caracteres no Artigo</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {formData.artigo.split(' ').filter(word => word.length > 0).length}
                </div>
                <div className={styles.statLabel}>Palavras</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {Math.ceil(formData.artigo.split(' ').filter(word => word.length > 0).length / 200)}
                </div>
                <div className={styles.statLabel}>Minutos de Leitura</div>
              </div>
            </div>
          </div>
          <ControleRotas />
        </aside>
      </div>
    </div>
  );
}