import { Helmet } from 'react-helmet'; 

interface SeoMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  articleData?: {
    publishedTime: string;
    modifiedTime: string;
    author: string;
    section: string;
    tags: string[];
  };
}

export default function SeoMetaTags({
  title = 'axiosnews | Notícias | Vagas | E-Commerce',
  description = 'Fique por dentro das últimas notícias, vagas de emprego e oportunidades no e-commerce. Conteúdo atualizado diariamente.',
  image = '/logotipo.png',
  url = typeof window !== 'undefined' ? window.location.href : 'https://axiosnoticias.vercel.app',
  type = 'website',
  articleData
}: SeoMetaTagsProps) {
  
  const siteUrl = 'https://axiosnoticias.vercel.app'; // ATUALIZE
  
  return (
    <Helmet>
      {/* Meta Tags Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="notícias, vagas, emprego, e-commerce, tecnologia, carreira, desenvolvimento" />
      
      {/* Open Graph */}
      <meta property="og:site_name" content="axiosnews" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Article-specific tags */}
      {type === 'article' && articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          <meta property="article:modified_time" content={articleData.modifiedTime} />
          <meta property="article:author" content={articleData.author} />
          <meta property="article:section" content={articleData.section} />
          {articleData.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}