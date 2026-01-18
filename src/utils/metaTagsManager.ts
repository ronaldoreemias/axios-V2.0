interface MetaTagsOptions {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_META = {
  title: 'axiosnews | Notícias | Vagas | E-Commerce',
  description: 'Fique por dentro das últimas notícias, vagas de emprego e oportunidades no e-commerce. Conteúdo atualizado diariamente.',
  image: 'https://axiosnoticias.vercel.app/logotipo.png',
  url: 'https://axiosnoticias.vercel.app',
  type: 'website' as const,
};

class MetaTagsManager {
  private static instance: MetaTagsManager;
  private currentTags = new Map<string, HTMLElement>();

  static getInstance(): MetaTagsManager {
    if (!MetaTagsManager.instance) {
      MetaTagsManager.instance = new MetaTagsManager();
    }
    return MetaTagsManager.instance;
  }

  private getOrCreateMeta(attr: 'name' | 'property', key: string): HTMLElement {
    const selector = `meta[${attr}="${key}"]`;
    let element = document.querySelector(selector) as HTMLElement;
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
      this.currentTags.set(`${attr}-${key}`, element);
    }
    
    return element;
  }

  private getOrCreateLink(rel: string): HTMLElement {
    const selector = `link[rel="${rel}"]`;
    let element = document.querySelector(selector) as HTMLElement;
    
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
      this.currentTags.set(`link-${rel}`, element);
    }
    
    return element;
  }

  updateMetaTags(options: Partial<MetaTagsOptions>): void {
    if (typeof document === 'undefined') return;
    
    const config = { ...DEFAULT_META, ...options };
    
    // Title
    document.title = config.title;
    
    // Description
    this.getOrCreateMeta('name', 'description').setAttribute('content', config.description);
    
    // Open Graph
    this.getOrCreateMeta('property', 'og:site_name').setAttribute('content', 'axiosnews');
    this.getOrCreateMeta('property', 'og:type').setAttribute('content', config.type);
    this.getOrCreateMeta('property', 'og:title').setAttribute('content', config.title);
    this.getOrCreateMeta('property', 'og:description').setAttribute('content', config.description);
    this.getOrCreateMeta('property', 'og:url').setAttribute('content', config.url);
    this.getOrCreateMeta('property', 'og:image').setAttribute('content', config.image);
    this.getOrCreateMeta('property', 'og:image:width').setAttribute('content', '1200');
    this.getOrCreateMeta('property', 'og:image:height').setAttribute('content', '630');
    this.getOrCreateMeta('property', 'og:image:alt').setAttribute('content', config.title);
    this.getOrCreateMeta('property', 'og:locale').setAttribute('content', 'pt_BR');
    
    // Canonical URL
    this.getOrCreateLink('canonical').setAttribute('href', config.url);
    
    // Keywords
    const keywords = config.tags?.join(', ') || 'notícias, vagas, emprego, e-commerce, tecnologia, carreira, desenvolvimento';
    this.getOrCreateMeta('name', 'keywords').setAttribute('content', keywords);
    
    // Article-specific
    if (config.type === 'article') {
      if (config.publishedTime) {
        this.getOrCreateMeta('property', 'article:published_time').setAttribute('content', config.publishedTime);
      }
      if (config.author) {
        this.getOrCreateMeta('property', 'article:author').setAttribute('content', config.author);
      }
      if (config.section) {
        this.getOrCreateMeta('property', 'article:section').setAttribute('content', config.section);
      }
      
      // Article tags
      const articleTags = config.tags || [config.section || '', 'notícias', 'e-commerce'];
      articleTags.forEach(tag => {
        this.getOrCreateMeta('property', 'article:tag').setAttribute('content', tag);
      });
    } else {
      // Remove article tags if switching back to website
      this.removeArticleTags();
    }
  }

  private removeArticleTags(): void {
    const articleTags = document.querySelectorAll('meta[property^="article:"]');
    articleTags.forEach(tag => {
      const attr = tag.getAttribute('property');
      if (attr) {
        this.currentTags.delete(`property-${attr}`);
        tag.remove();
      }
    });
  }

  resetToDefault(): void {
    this.updateMetaTags(DEFAULT_META);
  }
}

// Export singleton
export const metaTagsManager = MetaTagsManager.getInstance();