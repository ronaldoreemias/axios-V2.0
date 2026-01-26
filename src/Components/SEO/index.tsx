import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl: string;
  articlePublishedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  robots?: "index, follow" | "noindex, follow" | "index, nofollow";
}

/**
 * Componente reutilizável para gerenciar SEO em qualquer página
 * 
 * Uso básico (página estática):
 * <SEO 
 *   title="Minha Página | Axios News"
 *   description="Descrição da minha página"
 *   ogUrl="https://axiosnews.vercel.app/minha-pagina"
 *   canonicalUrl="https://axiosnews.vercel.app/minha-pagina"
 * />
 * 
 * Uso avançado (página dinâmica com artigo):
 * <SEO 
 *   title={`${artigo.titulo} | Axios News`}
 *   description={artigo.descricao}
 *   keywords="tecnologia, programação, react"
 *   ogType="article"
 *   ogImage={artigo.imagem}
 *   ogUrl={`https://axiosnews.vercel.app/artigo/${artigo.id}`}
 *   canonicalUrl={`https://axiosnews.vercel.app/artigo/${artigo.id}`}
 *   articlePublishedTime={artigo.dataPublicacao}
 *   articleAuthor={artigo.autor}
 *   articleSection="Notícias"
 * />
 */
export default function SEO({
  title,
  description,
  keywords = "notícias, tecnologia, vagas, e-commerce",
  author = "Axios News",
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  articlePublishedTime,
  articleAuthor,
  articleSection,
  robots = "index, follow",
}: SEOProps) {
  return (
    <Helmet>
      {/* Tags Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />

      {/* Open Graph (Compartilhamento em Redes Sociais) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={ogUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}

      {/* Canonical URL (Evitar conteúdo duplicado) */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Meta tags específicas para artigos */}
      {ogType === "article" && (
        <>
          {articlePublishedTime && (
            <meta property="article:published_time" content={articlePublishedTime} />
          )}
          {articleAuthor && (
            <meta property="article:author" content={articleAuthor} />
          )}
          {articleSection && (
            <meta property="article:section" content={articleSection} />
          )}
        </>
      )}
    </Helmet>
  );
}
