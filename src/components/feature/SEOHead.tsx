
import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogType?: string;
  structuredData?: object;
}

const SEOHead = ({ title, description, keywords, canonicalPath, ogType = 'website', structuredData }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', `https://dyamwater.com${canonicalPath}`, true);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://dyamwater.com${canonicalPath}`;

    const lastMod = document.querySelector('meta[http-equiv="last-modified"]') as HTMLMetaElement | null;
    if (lastMod) {
      lastMod.content = new Date().toISOString().split('T')[0];
    }

    let scriptEl: HTMLScriptElement | null = document.getElementById('page-structured-data') as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'page-structured-data';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const el = document.getElementById('page-structured-data');
      if (el) el.remove();
    };
  }, [title, description, keywords, canonicalPath, ogType, structuredData]);

  return null;
};

export default SEOHead;
