import { useEffect } from 'react';
import { metaTagsManager } from '../utils/metaTagsManager';

interface UseMetaTagsOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  section?: string;
  tags?: string[];
}

export function useMetaTags(options: UseMetaTagsOptions): void {
  useEffect(() => {
    const fullUrl = options.url || (typeof window !== 'undefined' ? window.location.href : 'https://axiosnoticias.vercel.app/');
    
    metaTagsManager.updateMetaTags({
      ...options,
      url: fullUrl,
    });
    
    return () => {
      metaTagsManager.resetToDefault();
    };
  }, [options]);
}