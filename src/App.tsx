import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/Layout';
import { HomePage } from '@/components/HomePage';
import { ServicePage } from '@/components/ServicePage';
import { getServiceBySlug } from '@/data/services';
import { getLegalPage } from '@/cms/content';

function parsePath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function navigate(path: string) {
  window.location.hash = path;
  const anchor = path.split('#')[1];
  if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }));
  else window.scrollTo(0, 0);
}

function LegalPage({ kind }: { kind: 'privacyPolicy' | 'termsConditions' }) {
  const title = kind === 'privacyPolicy' ? 'Privacy Policy' : 'Terms & Conditions';
  const body = getLegalPage(kind).trim();
  return <main className="legal-page"><div className="container legal-page-inner">
    <a className="legal-back" href="#/">← Back to home</a>
    <h1>{title}</h1>
    {body ? <div className="legal-copy">{body.split(/\n\s*\n/).map((paragraph, i) =>
      <p key={i}>{paragraph}</p>
    )}</div> : <p className="legal-empty">This document has not been published yet. Please contact us for further information.</p>}
  </div></main>;
}

export default function App() {
  const [path, setPath] = useState(parsePath());

  useEffect(() => {
    function onHashChange() { setPath(parsePath()); }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const anchor = path.split('#')[1];
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [path]);

  const serviceMatch = path.match(/^\/services\/(.+)$/);
  const service = serviceMatch ? getServiceBySlug(serviceMatch[1]) : undefined;

  let content;
  if (path === '/privacy-policy' || path === '/terms-and-conditions') {
    content = <LegalPage kind={path === '/privacy-policy' ? 'privacyPolicy' : 'termsConditions'} />;
  } else if (service) {
    content = <ServicePage service={service} onNavigate={navigate} />;
  } else {
    content = <HomePage onNavigate={navigate} />;
  }

  return <div className="site-shell">
    <Header onNavigate={navigate} />
    {content}
    <Footer onNavigate={navigate} />
  </div>;
}

