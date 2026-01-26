# 📚 Exemplos de Uso do Componente SEO

## 🎯 Componente SEO Reutilizável

Criei um componente `<SEO />` em `src/components/SEO/index.tsx` para facilitar a implementação de SEO em novas páginas.

## 📖 Exemplos Práticos

### Exemplo 1: Página Estática Simples

```tsx
import SEO from "../../components/SEO";

function MinhaPage() {
  return (
    <>
      <SEO
        title="Sobre | Axios News"
        description="Conheça a história e missão do Axios News, o maior portal de notícias tech do Brasil."
        keywords="sobre, historia, missão, Axios News"
        ogUrl="https://axiosnews.vercel.app/sobre"
        canonicalUrl="https://axiosnews.vercel.app/sobre"
      />
      
      <h1>Sobre Nós</h1>
      <p>Conteúdo aqui...</p>
    </>
  );
}
```

### Exemplo 2: Página de Artigo Dinâmico

```tsx
import SEO from "../../components/SEO";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Artigo {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  autor: string;
  imagem: string;
  dataPublicacao: string;
  categoria: string;
}

function ArtigoPage() {
  const { id } = useParams();
  const [artigo, setArtigo] = useState<Artigo | null>(null);

  useEffect(() => {
    fetch(`/api/artigos/${id}`)
      .then(res => res.json())
      .then(data => setArtigo(data));
  }, [id]);

  if (!artigo) return <div>Carregando...</div>;

  return (
    <>
      <SEO
        title={`${artigo.titulo} | Axios News`}
        description={artigo.descricao}
        keywords={`${artigo.categoria}, notícias, tecnologia`}
        author={artigo.autor}
        ogType="article"
        ogImage={artigo.imagem}
        ogUrl={`https://axiosnews.vercel.app/artigo/${id}`}
        canonicalUrl={`https://axiosnews.vercel.app/artigo/${id}`}
        articlePublishedTime={artigo.dataPublicacao}
        articleAuthor={artigo.autor}
        articleSection={artigo.categoria}
      />

      <article>
        <h1>{artigo.titulo}</h1>
        <img src={artigo.imagem} alt={artigo.titulo} />
        <div>{artigo.conteudo}</div>
      </article>
    </>
  );
}

export default ArtigoPage;
```

### Exemplo 3: Página de Produto E-commerce

```tsx
import SEO from "../../components/SEO";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  marca: string;
}

function ProdutoPage() {
  const produto: Produto = {
    id: "1",
    nome: "Notebook Gaming",
    descricao: "Notebook de alta performance para gaming e programação",
    preco: 5999.90,
    imagem: "https://exemplo.com/notebook.jpg",
    marca: "Top Brand"
  };

  return (
    <>
      <SEO
        title={`${produto.nome} | Comprar Online | Axios Shopping`}
        description={`Compre ${produto.nome} por apenas R$ ${produto.preco.toLocaleString('pt-BR')}. ${produto.descricao}`}
        keywords="notebook, gaming, computador, comprar online"
        ogImage={produto.imagem}
        ogUrl={`https://shopping.axios.com.br/produto/${produto.id}`}
        canonicalUrl={`https://shopping.axios.com.br/produto/${produto.id}`}
        twitterCard="summary_large_image"
      />

      <div className="produto">
        <h1>{produto.nome}</h1>
        <img src={produto.imagem} alt={produto.nome} />
        <p>{produto.descricao}</p>
        <strong>R$ {produto.preco.toLocaleString('pt-BR')}</strong>
        <button>Comprar Agora</button>
      </div>
    </>
  );
}

export default ProdutoPage;
```

### Exemplo 4: Página com Meta Tags Customizadas

```tsx
import SEO from "../../components/SEO";

function EventoPage() {
  return (
    <>
      <SEO
        title="Tech Summit 2024 | Registre-se | Axios News"
        description="Participe do maior evento de tecnologia do Brasil. Confira palestrantes, programação e como se registrar."
        ogTitle="Você está convidado! Tech Summit 2024"
        ogDescription="O maior evento de tecnologia do ano com os melhores palestrantes e networking"
        ogImage="https://axiosnews.vercel.app/evento-2024.jpg"
        ogUrl="https://axiosnews.vercel.app/evento-2024"
        canonicalUrl="https://axiosnews.vercel.app/evento-2024"
        twitterCard="summary_large_image"
        twitterTitle="Tech Summit 2024 - Inscrições Abertas!"
        robots="index, follow"
      />

      <div className="evento">
        <h1>Tech Summit 2024</h1>
        <p>O maior evento de tecnologia do Brasil</p>
      </div>
    </>
  );
}

export default EventoPage;
```

## 🔄 Migrando páginas existentes para usar o componente SEO

### Antes (sem componente):
```tsx
import { Helmet } from "react-helmet";

function MinhaPage() {
  return (
    <>
      <Helmet>
        <title>Meu Título | Axios News</title>
        <meta name="description" content="..." />
        <meta property="og:title" content="..." />
        {/* ... mais tags ... */}
      </Helmet>
      {/* Conteúdo */}
    </>
  );
}
```

### Depois (com componente):
```tsx
import SEO from "../../components/SEO";

function MinhaPage() {
  return (
    <>
      <SEO
        title="Meu Título | Axios News"
        description="..."
        ogUrl="https://axiosnews.vercel.app/minha-page"
        canonicalUrl="https://axiosnews.vercel.app/minha-page"
      />
      {/* Conteúdo */}
    </>
  );
}
```

## 🎓 Props Disponíveis do Componente SEO

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `title` | string | ✅ | Título da página (aparece na aba do navegador e Google) |
| `description` | string | ✅ | Descrição da página (aparece no Google) |
| `ogUrl` | string | ✅ | URL da página para Open Graph |
| `canonicalUrl` | string | ✅ | URL canônica (evita duplicação) |
| `keywords` | string | ❌ | Palavras-chave (padrão: notícias, tecnologia, vagas, e-commerce) |
| `author` | string | ❌ | Autor (padrão: Axios News) |
| `ogTitle` | string | ❌ | Título para redes sociais (usa title se não informado) |
| `ogDescription` | string | ❌ | Descrição para redes sociais (usa description se não informado) |
| `ogImage` | string | ❌ | URL da imagem para compartilhamento |
| `ogType` | "website" \| "article" | ❌ | Tipo de conteúdo (padrão: website) |
| `twitterCard` | "summary" \| "summary_large_image" | ❌ | Tipo de card do Twitter (padrão: summary_large_image) |
| `twitterTitle` | string | ❌ | Título para Twitter |
| `twitterDescription` | string | ❌ | Descrição para Twitter |
| `twitterImage` | string | ❌ | Imagem para Twitter |
| `articlePublishedTime` | string | ❌ | Data de publicação (ISO 8601: 2024-01-24T10:30:00Z) |
| `articleAuthor` | string | ❌ | Autor do artigo |
| `articleSection` | string | ❌ | Seção/categoria do artigo |
| `robots` | string | ❌ | Instruções para crawlers (padrão: index, follow) |

## 🚀 Quando usar `noindex, follow`

Use `robots="noindex, follow"` em páginas que não devem aparecer no Google:

- ✅ Páginas de resultado de busca
- ✅ Páginas de erro (404, 500)
- ✅ Páginas administrativas
- ✅ Páginas de teste/staging

```tsx
<SEO
  title="Resultados de Busca"
  description="Resultados de busca"
  ogUrl="https://axiosnews.vercel.app/busca"
  canonicalUrl="https://axiosnews.vercel.app/busca"
  robots="noindex, follow"  // ← Não será indexada pelo Google
/>
```

## 💡 Dicas Finais

1. **Always provide ogUrl and canonicalUrl** - Essencial para SEO
2. **Use imagens de alta qualidade** - Mínimo 1200x630px para og:image
3. **Keep descriptions under 160 chars** - Google corta descrições mais longas
4. **Use keywords naturally** - Não faça keyword stuffing
5. **Test with Google Search Console** - https://search.google.com/search-console

Agora você tem uma forma padronizada e eficiente de gerenciar SEO em todo seu projeto! 🎉
