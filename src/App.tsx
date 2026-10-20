import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/Layout';
import { HomePage } from '@/components/HomePage';
import { PartnerPage } from '@/components/PartnerPage';
import { FAQPage, AcceptedItemsPage, ContactPage, ServiceAreasPage } from '@/components/ResourcePages';
import { ServicePage } from '@/components/ServicePage';
import { getServiceBySlug } from '@/data/services';
import { getLegalPage } from '@/cms/content';

function parsePath(): string {
  return window.location.pathname || '/';
}

function navigate(path: string) {
  const [pathname, anchor] = path.split('#');
  const target = pathname || '/';
  window.history.pushState({}, '', target + (anchor ? '#' + anchor : ''));
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }));
  else window.scrollTo(0, 0);
}

function LegalPage({ kind }: { kind: 'privacyPolicy' | 'termsConditions' }) {
  const title = kind === 'privacyPolicy' ? 'Privacy Policy' : 'Terms & Conditions';
  const body = getLegalPage(kind).trim();
  return <main className="legal-page"><div className="container legal-page-inner">
    <a className="legal-back" href="/">← Back to home</a>
    <h1>{title}</h1>
    {body ? <div className="legal-copy">{body.split(/\n\s*\n/).map((paragraph, i) =>
      <p key={i}>{paragraph}</p>
    )}</div> : <p className="legal-empty">This document has not been published yet. Please contact us for further information.</p>}
  </div></main>;
}

export default function App() {
  const [path, setPath] = useState(parsePath());

  useEffect(() => {
    function onLocationChange() { setPath(parsePath()); }
    // Preserve old bookmarked hash routes without leaving duplicate URLs.
    const legacy = window.location.hash.match(/^#(\/services\/[a-z0-9-]+|\/privacy-policy|\/terms-and-conditions)$/);
    if (legacy) {
      window.history.replaceState({}, '', legacy[1]);
      setPath(parsePath());
    }
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [path]);

  const serviceMatch = path.match(/^\/services\/(.+)$/);
  const service = serviceMatch ? getServiceBySlug(serviceMatch[1]) : undefined;

  useEffect(() => {
    const title = service?.seoTitle || (path === '/privacy-policy' ? 'Privacy Policy | Donna’s IT Solutions' : path === '/terms-and-conditions' ? 'Terms & Conditions | Donna’s IT Solutions' : path === '/partners' ? 'E-Waste Referral Partners Sydney | Donna’s IT Solutions' : 'E-Waste Collection & Computer Recycling Sydney | Donna’s IT Solutions');
    const description = service?.metaDescription || (path === '/privacy-policy' ? 'How Donna’s IT Solutions collects, uses and protects personal information submitted through website enquiries in Sydney.' : path === '/terms-and-conditions' ? 'Terms and conditions for e-waste collection, computer recycling and data handling enquiries with Donna’s IT Solutions.' : path === '/partners' ? 'Partner with Donna’s IT Solutions for Sydney e-waste collection referrals. Enquire about business IT equipment pickup opportunities.' : 'Donna’s IT Solutions provides e-waste collection and recycling for businesses, schools and organisations across Sydney. Enquire about an electronic waste pickup.');
    const pageMeta: Record<string, [string,string]> = {
      '/faq': ['E-Waste Collection FAQs Sydney | Donna’s IT Solutions', 'Answers to common questions about business e-waste collection in Sydney, including accepted equipment, pickup arrangements and data handling.'],
      '/what-we-accept': ['What E-Waste Can We Collect? | Donna’s IT Solutions', 'See examples of computers, monitors, cables and workplace IT equipment you can enquire about for e-waste collection in Sydney.'],
      '/contact': ['Contact & Book E-Waste Pickup | Donna’s IT Solutions', 'Contact Donna’s IT Solutions for business and school e-waste collection enquiries across Sydney. Tell us your items, suburb and preferred date.'],
      '/service-areas': ['Sydney E-Waste Collection Areas | Donna’s IT Solutions', 'Explore Sydney areas where you can enquire about business and school e-waste collection. Contact our team to confirm local pickup availability.'],
    };
    const resolvedTitle = pageMeta[path]?.[0] || title;
    const resolvedDescription = pageMeta[path]?.[1] || description;
    document.title = resolvedTitle;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = resolvedDescription;
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = resolvedTitle;
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = resolvedDescription;
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = 'https://donnasitsolutions.com.au' + (service ? '/services/' + service.slug : path === '/privacy-policy' || path === '/terms-and-conditions' || path === '/partners' || !!pageMeta[path] ? path : '/');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://donnasitsolutions.com.au' + (service ? '/services/' + service.slug : path === '/privacy-policy' || path === '/terms-and-conditions' || path === '/partners' || !!pageMeta[path] ? path : '/');
  }, [path, service]);

  let content;
  if (path === '/privacy-policy' || path === '/terms-and-conditions') {
    content = <LegalPage kind={path === '/privacy-policy' ? 'privacyPolicy' : 'termsConditions'} />;
  } else if (path === '/partners') {
    content = <PartnerPage />;
  } else if (path === '/faq') {
    content = <FAQPage />;
  } else if (path === '/what-we-accept') {
    content = <AcceptedItemsPage />;
  } else if (path === '/contact') {
    content = <ContactPage />;
  } else if (path === '/service-areas') {
    content = <ServiceAreasPage />;
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

