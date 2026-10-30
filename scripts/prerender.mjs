import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const base = 'https://donnasitsolutions.com.au';
const routes = [
  '/', '/partners', '/privacy-policy', '/terms-and-conditions',
  '/faq', '/what-we-accept', '/contact', '/service-areas', '/blog',
  '/services/office-business-e-waste', '/services/school-collections',
  '/services/bulk-collection', '/services/secure-itad',
  '/services/secure-data-destruction'
];
const metadata = {
  '/': ["E-Waste Recycling Sydney – Donna's IT Solutions","E-waste recycling and electronic waste disposal across Sydney. Business collection enquiries, IT equipment handling and responsible recycling. Book a pickup."],
  '/partners': ['E-Waste Referral Partners Sydney | Donna’s IT Solutions', 'Partner with Donna’s IT Solutions for Sydney e-waste collection referrals. Enquire about business IT equipment pickup opportunities.'],
  '/privacy-policy': ['Privacy Policy | Donna’s IT Solutions', 'How Donna’s IT Solutions collects, uses and protects personal information submitted through website enquiries in Sydney.'],
  '/terms-and-conditions': ['Terms & Conditions | Donna’s IT Solutions', 'Terms and conditions for e-waste collection, computer recycling and data handling enquiries with Donna’s IT Solutions.'],
  '/blog': ['E-Waste Recycling Tips & Guides Sydney | Donna’s IT Solutions', 'Practical information about e-waste collection, computer recycling and responsible IT equipment disposal for Sydney businesses and schools.'],
  '/faq': ["E-Waste Recycling FAQs Sydney | Donna's IT Solutions","Answers to common questions about e-waste recycling, IT equipment recycling, data handling and pickups in Sydney. Find out how our service works."],
  '/what-we-accept': ["Electronic Recycling Sydney | What We Accept","See what we collect for electronic recycling in Sydney: computers, laptops, monitors, phones, hard drives, cables and more. Check accepted items."],
  '/contact': ["Book E-Waste Disposal Sydney | Pickup Enquiries","Book e-waste disposal in Sydney. Enquire about pickup of business electronics, laptops and IT equipment. Contact Donna's IT Solutions today."],
  '/service-areas': ["E-Waste Collection Sydney | Areas We Service","E-waste collection across Sydney and surrounding NSW areas. Check service areas and enquire about a convenient business electronics pickup."]
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
