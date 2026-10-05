import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/Layout';
import { HomePage } from '@/components/HomePage';
import { ServicePage } from '@/components/ServicePage';
import { getServiceBySlug } from '@/data/services';

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
  if (service) {
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

