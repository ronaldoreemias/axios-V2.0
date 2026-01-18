import { useEffect } from 'react';
import { metaTagsManager } from '../utils/metaTagsManager';

interface MetaTagsUpdaterProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  section?: string;
}

export default function MetaTagsUpdater({
  title,
  description,
  image,
  type = 'website',
  author,
  publishedTime,
  section
}: MetaTagsUpdaterProps) {
  
  useEffect(() => {
    if (!title) return;
    
    metaTagsManager.updateMetaTags({
      title,
      description: description || 'Fique por dentro das últimas notícias, vagas de emprego e oportunidades no e-commerce.',
      image: image || 'https://axiosnoticias.vercel.app/logotipo.png',
      url: window.location.href,
      type,
      author,
      publishedTime,
      section,
      tags: section ? [section, 'notícias', 'e-commerce'] : undefined
    });
    
    return () => {
      metaTagsManager.resetToDefault();
    };
  }, [title, description, image, type, author, publishedTime, section]);
  
  return null;
}