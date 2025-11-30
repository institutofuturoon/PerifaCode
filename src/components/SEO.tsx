
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  keywords?: string[];
  url?: string;
  jsonLd?: Record<string, any>; // Suporte a Dados Estruturados
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Plataforma de educação tecnológica focada em capacitar talentos da periferia. Cursos gratuitos de programação, design e soft skills.", 
  image = "https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg", 
  keywords = [], 
  url,
  jsonLd
}) => {
  
  useEffect(() => {
    const currentUrl = url || window.location.href;

    // 1. Atualizar Título
    document.title = title.includes('FuturoOn') ? title : `${title} | FuturoOn`;

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

    // 2. Meta Tags Básicas e de Robôs
    updateMeta('description', description);
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'Instituto FuturoOn');
    
    if (keywords.length > 0) {
        updateMeta('keywords', keywords.join(', '));
    }

    // 3. Open Graph (Facebook, LinkedIn, WhatsApp)
    updateMeta('og:locale', 'pt_BR', 'property');
    updateMeta('og:site_name', 'FuturoOn', 'property');
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:url', currentUrl, 'property');

    // 4. Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', image, 'name');

    // 5. Canonical Link (Evita conteúdo duplicado)
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 6. JSON-LD (Dados Estruturados para Google)
    if (jsonLd) {
        let scriptJsonLd = document.querySelector('script[type="application/ld+json"]');
        if (!scriptJsonLd) {
            scriptJsonLd = document.createElement('script');
            scriptJsonLd.setAttribute('type', 'application/ld+json');
            document.head.appendChild(scriptJsonLd);
        }
        scriptJsonLd.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup function (opcional, para SPAs complexas pode ser necessário remover tags ao desmontar)
    return () => {
        // Não removemos as tags básicas para não deixar a página "pelada" durante transições,
        // mas o próximo render do SEO irá sobrescrevê-las.
    };

  }, [title, description, image, keywords, url, jsonLd]);

  return null;
};

export default SEO;
