export interface SEOMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function setPageMeta(meta: SEOMeta): void {
  document.title = meta.title;
  setMeta('description', meta.description);
  setMeta('og:title', meta.ogTitle || meta.title, 'property');
  setMeta('og:description', meta.ogDescription || meta.description, 'property');
  if (meta.canonical) {
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = meta.canonical;
  }
}

function setMeta(name: string, content: string, attr = 'name'): void {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}
