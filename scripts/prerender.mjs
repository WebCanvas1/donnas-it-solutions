import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const base = 'https://donnasitsolutions.com.au';
const routes = [
  '/', '/partners', '/privacy-policy', '/terms-and-conditions',
  '/faq', '/what-we-accept', '/contact', '/service-areas',
  '/services/office-business-e-waste', '/services/school-collections',
  '/services/bulk-collection', '/services/secure-itad',
  '/services/secure-data-destruction'
];
const metadata = {
  '/': ['E-Waste Collection & Recycling Sydney | Donna’s IT Solutions', 'Business e-waste collection and computer recycling across Sydney. Secure data destruction, school and bulk pickups. Request a quote today.'],
  '/partners': ['E-Waste Referral Partners Sydney | Donna’s IT Solutions', 'Partner with Donna’s IT Solutions for Sydney e-waste collection referrals. Enquire about business IT equipment pickup opportunities.'],
  '/privacy-policy': ['Privacy Policy | Donna’s IT Solutions', 'How Donna’s IT Solutions collects, uses and protects personal information submitted through website enquiries in Sydney.'],
  '/terms-and-conditions': ['Terms & Conditions | Donna’s IT Solutions', 'Terms and conditions for e-waste collection, computer recycling and data handling enquiries with Donna’s IT Solutions.'],
  '/faq': ['E-Waste Collection FAQs Sydney | Donna’s IT Solutions', 'Answers to common questions about business e-waste collection in Sydney, including accepted equipment, pickup arrangements and data handling.'],
  '/what-we-accept': ['What E-Waste Can We Collect? | Donna’s IT Solutions', 'See examples of computers, monitors, cables and workplace IT equipment you can enquire about for e-waste collection in Sydney.'],
  '/contact': ['Contact & Book E-Waste Pickup | Donna’s IT Solutions', 'Contact Donna’s IT Solutions for business and school e-waste collection enquiries across Sydney. Tell us your items, suburb and preferred date.'],
  '/service-areas': ['Sydney E-Waste Collection Areas | Donna’s IT Solutions', 'Explore Sydney areas where you can enquire about business and school e-waste collection. Contact our team to confirm local pickup availability.']
};
const escapeAttr = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  // App reads the pathname during rendering; effects and browser-only handlers do not run on the server.
  globalThis.window = { location: { pathname: '/', hash: '', search: '' } };
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const { services } = await server.ssrLoadModule('/src/data/services.ts');
  const { faqs } = await server.ssrLoadModule('/src/components/ResourcePages.tsx');
  const React = await import('react');
  const template = await readFile('dist/index.html','utf8');
  for (const route of routes) {
    globalThis.window.location.pathname = route;
    const service = services.find(s => route === '/services/' + s.slug);
    const [title,description] = service ? [service.seoTitle,service.metaDescription] : metadata[route];
    const url = base + route;
    const body = renderToString(React.createElement(App));
    let html = template.replace('<div id="root"></div>', '<div id="root">' + body + '</div>');
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + title + '</title>');
    html = html.replace(/(<meta name="description" content=")[^"]*(" \/>)/, '$1' + escapeAttr(description) + '$2');
    html = html.replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, '$1' + url + '$2');
    html = html.replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, '$1' + escapeAttr(title) + '$2');
    html = html.replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, '$1' + escapeAttr(description) + '$2');
    html = html.replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, '$1' + url + '$2');
    if (route === '/faq') {
      const faqSchema = JSON.stringify({ '@context':'https://schema.org', '@type':'FAQPage', mainEntity: faqs.map(([name,text])=>({ '@type':'Question', name, acceptedAnswer: { '@type':'Answer', text } })) });
      html = html.replace('</head>', '<script type="application/ld+json">' + faqSchema + '</script></head>');
    }
    if (service) {
      const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.metaDescription, serviceType: service.title, areaServed: { '@type': 'Place', name: 'Sydney, NSW' }, provider: { '@id': base + '/#business' }, url });
      html = html.replace('</head>', '<script type="application/ld+json">' + schema + '</script></head>');
    }
    const out = route === '/' ? 'dist/index.html' : join('dist',route.slice(1),'index.html');
    await mkdir(dirname(out),{recursive:true});
    await writeFile(out,html,'utf8');
    if (!body.includes('<h1')) throw new Error('Pre-rendered route missing heading: ' + route);
    console.log('Pre-rendered',route);
  }
} finally {
  await server.close();
  delete globalThis.window;
}
