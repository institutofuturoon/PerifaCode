
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  keywords?: string[];
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Plataforma de educação tecnológica focada em capacitar talentos da periferia. Cursos gratuitos de programação, design e soft skills.", 
  image = "https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg", 
  keywords = [], 
  url 
}) => {
  
  useEffect(() => {
    // Atualizar Título
    document.title = `${title} | FuturoOn`;

    // Helper para atualizar ou criar meta tags
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta Description Padrão
    updateMeta('description', description);
    
    // Keywords
    if (keywords.length > 0) {
        updateMeta('keywords', keywords.join(', '));
    }

    // Open Graph (Facebook, LinkedIn, WhatsApp)
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:type', 'website', 'property');
    if (url) {
        updateMeta('og:url', url, 'property');
    } else {
        updateMeta('og:url', window.location.href, 'property');
    }

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', image, 'name');

  }, [title, description, image, keywords, url]);

  return null;
};

export default SEO;
