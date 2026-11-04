// Server-provided metadata allows crawlers to identify each service before JavaScript runs.
const SEO_SERVICES = {"office-business-e-waste":{"title":"Office & Business E-Waste Collection Sydney | Donna’s IT Solution","description":"Responsible office and business e-waste collection across Sydney. Computers, monitors, workplace IT equipment collected and recycled.","heading":"Office & business e-waste"},"school-collections":{"title":"School E-Waste Collection Sydney | Donna’s IT Solution","description":"E-waste collection for schools and educational institutions in Sydney. Computer labs, laptops and educational technology collected and responsibly recycled.","heading":"School collections"},"bulk-collection":{"title":"Bulk E-Waste Collection Sydney | Donna’s IT Solution","description":"Bulk e-waste collection for commercial clear-outs in Sydney. Larger quantities of IT equipment and electronics collected efficiently and responsibly.","heading":"Bulk collection"},"secure-itad":{"title":"Secure IT Asset Disposal Sydney | Donna’s IT Solution","description":"Secure IT asset disposal (ITAD) in Sydney. Networking equipment and redundant business hardware collected and handled with care.","heading":"Secure ITAD"},"secure-data-destruction":{"title":"Secure Data Destruction Sydney | Donna’s IT Solution","description":"Secure data destruction for devices with sensitive information in Sydney. Careful handling of hard drives, laptops and storage devices.","heading":"Secure data destruction"}};
const escapeSeo = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function seoPage(request, env, path) {
  const slug = path.startsWith('/services/') ? path.slice('/services/'.length) : '';
  let service = SEO_SERVICES[slug];
  if (slug && !service) return new Response('Page not found', { status: 404 });
  if (service && env.SITE_CONTENT) {
    try {
      const saved = await env.SITE_CONTENT.get('site_content', 'json');
      const custom = saved?.services?.find(item => item.slug === slug);
      if (custom) service = { title: custom.seoTitle || service.title, description: custom.metaDescription || service.description, heading: custom.title || service.heading };
    } catch { /* Use the published defaults if KV is unavailable. */ }
  }
  const canonical = 'https://donnasitsolutions.com.au' + path;
  const response = await env.ASSETS.fetch(new Request(new URL('/', request.url), request));
  if (!response.ok) return response;
  let html = await response.text();
  const title = service?.title || (path === '/privacy-policy' ? 'Privacy Policy | Donna’s IT Solutions' : path === '/partners' ? 'E-Waste Referral Partners Sydney | Donna’s IT Solutions' : 'Terms & Conditions | Donna’s IT Solutions');
  const description = service?.description || 'Donna’s IT Solutions provides responsible e-waste collection across Sydney.';
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + escapeSeo(title) + '</title>')
    .replace(/(<meta name="description" content=")[^"]*(")/, '$1' + escapeSeo(description) + '$2')
    .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + escapeSeo(title) + '$2')
    .replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + escapeSeo(description) + '$2')
    .replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + canonical + '$2')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + canonical + '$2');
  if (service) html = html.replace('</head>', '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: service.heading, description: service.description, areaServed: 'Sydney, NSW', provider: { '@id': 'https://donnasitsolutions.com.au/#business' }, url: canonical }).replace(/</g, '\\u003c') + '</script></head>');
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}

const blogSlug = slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
const safeBlog = p => ({slug:p.slug,title:p.title,excerpt:p.excerpt,body:p.body,image:p.image,imageAlt:p.imageAlt,seoTitle:p.seoTitle,metaDescription:p.metaDescription,published:p.published,publishedAt:p.publishedAt,updatedAt:p.updatedAt});
async function allBlogPosts(env, includeDrafts=false) {
 const list=await env.SITE_CONTENT.list({prefix:'blog:',limit:1000});
 const posts=(await Promise.all(list.keys.map(k=>env.SITE_CONTENT.get(k.name,'json')))).filter(p=>p&& (includeDrafts||p.published));
 return posts.sort((a,b)=>(b.publishedAt||b.updatedAt||'').localeCompare(a.publishedAt||a.updatedAt||''));
}
async function blogSeoPage(request,env,path) {
 const slug=path.startsWith('/blog/')?path.slice(6).replace(/\/$/,''):null;
 const post=slug?await env.SITE_CONTENT.get('blog:'+slug,'json'):null;
 if(slug&&(!post||!post.published))return new Response('Article not found',{status:404,headers:{'Content-Type':'text/plain'}});
 const response=await env.ASSETS.fetch(new Request(new URL('/',request.url),request));
 if(!response.ok)return response;
 let html=await response.text();
 const canonical='https://donnasitsolutions.com.au'+(slug?'/blog/'+slug:'/blog');
 const title=post?(post.seoTitle||post.title)+' | Donna’s IT Solutions':"E-Waste Recycling Blog Sydney | Donna's IT Solutions";
 const description=post?(post.metaDescription||post.excerpt):'Practical articles on Sydney e-waste recycling, computer disposal and responsible IT equipment recycling.';
 html=html.replace(/<title>[^<]*<\/title>/,'<title>'+escapeSeo(title)+'</title>')
 .replace(/(<meta name="description" content=")[^"]*(")/,'$1'+escapeSeo(description)+'$2')
 .replace(/(<meta property="og:title" content=")[^"]*(")/,'$1'+escapeSeo(title)+'$2')
 .replace(/(<meta property="og:description" content=")[^"]*(")/,'$1'+escapeSeo(description)+'$2')
 .replace(/(<meta property="og:url" content=")[^"]*(")/,'$1'+canonical+'$2')
 .replace(/(<link rel="canonical" href=")[^"]*(")/,'$1'+canonical+'$2');
 if(post){
 const schema={'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description,mainEntityOfPage:canonical,datePublished:post.publishedAt,dateModified:post.updatedAt||post.publishedAt,author:{'@type':'Organization',name:"Donna's IT Solutions"},publisher:{'@type':'Organization',name:"Donna's IT Solutions"},...(post.image?{image:post.image}:{})};
 html=html.replace('</head>','<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head>');
 const article='<article><h1>'+escapeSeo(post.title)+'</h1><p>'+escapeSeo(post.excerpt)+'</p>'+post.body.split(/\n\s*\n/).map(p=>p.startsWith('## ')?'<h2>'+escapeSeo(p.slice(3))+'</h2>':'<p>'+escapeSeo(p)+'</p>').join('')+'</article>';
 html=html.replace(/<div id="root">[\s\S]*<\/div>\s*(?=<\/body>)/,'<div id="root"><main>'+article+'</main></div>');
 } else {
 const posts=await allBlogPosts(env);
 const list='<main><h1>E-waste recycling insights</h1>'+posts.map(p=>'<article><h2><a href="/blog/'+p.slug+'">'+escapeSeo(p.title)+'</a></h2><p>'+escapeSeo(p.excerpt)+'</p></article>').join('')+'</main>';
 html=html.replace(/<div id="root">[\s\S]*<\/div>\s*(?=<\/body>)/,'<div id="root">'+list+'</div>');
 }
 return new Response(html,{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public,max-age=120'}});
}

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });
const cookie = (value, age = 28800) => `admin_session=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
async function key(secret) { return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
const hex = bytes => [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('');
async function signature(message, secret) { return hex(await crypto.subtle.sign('HMAC', await key(secret), new TextEncoder().encode(message))); }
async function equal(a, b) { const enc = new TextEncoder(); const x = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(a))); const y = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(b))); return x.reduce((n, v, i) => n | (v ^ y[i]), 0) === 0; }
async function authorized(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const token = request.headers.get('Cookie')?.match(/(?:^|; )admin_session=([^;]+)/)?.[1];
  if (!token) return false;
  const [expires, nonce, sig] = token.split('.');
  return Number(expires) > Date.now() && !!nonce && !!sig && await equal(sig, await signature(`${expires}.${nonce}`, env.SESSION_SECRET || env.ADMIN_PASSWORD));
}
function validContent(c) {
  if (!c || typeof c !== 'object' || !c.texts || !c.settings || !Array.isArray(c.services) || !Array.isArray(c.collectionItems) || !Array.isArray(c.processSteps)) return false;
  if (Object.values(c.texts).some(v => typeof v !== 'string') || !['phone', 'email', 'whatsapp'].every(k => typeof c.settings[k] === 'string')) return false;
  if (c.videos !== undefined && (!Array.isArray(c.videos) || c.videos.length > 40 || c.videos.some(v => !v || typeof v.url !== 'string' || typeof v.title !== 'string' || v.title.length > 180 || !/^https:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\//.test(v.url) || v.url.length > 500))) return false;
  if (c.reviews !== undefined && (!Array.isArray(c.reviews) || c.reviews.length > 40 || c.reviews.some(r => !r || typeof r.name !== 'string' || typeof r.quote !== 'string' || r.name.length > 160 || r.quote.length > 2000 || r.rating !== 5))) return false;
  if (c.googleReviewsUrl !== undefined && (typeof c.googleReviewsUrl !== 'string' || !/^https:\/\/(?:share\.google|www\.google\.[a-z.]+|maps\.app\.goo\.gl)\//.test(c.googleReviewsUrl))) return false;
  const slugs = new Set();
  for (const s of c.services) {
    if (!s || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.slug) || slugs.has(s.slug) || !s.title || !Array.isArray(s.aboutText) || !Array.isArray(s.galleryImages) || !Array.isArray(s.collectItems) || !Array.isArray(s.whoFor)) return false;
    if (!['number','eyebrow','title','shortText','heroImage','seoTitle','metaDescription','aboutTitle'].every(k => typeof s[k] === 'string') || s.aboutText.some(v => typeof v !== 'string') || s.galleryImages.some(v => !v || typeof v.src !== 'string' || typeof v.alt !== 'string')) return false;
    slugs.add(s.slug);
  }
  if (c.extraSections && (!Array.isArray(c.extraSections) || c.extraSections.some(v => !v || !['title','text','image'].every(k => typeof v[k] === 'string')))) return false;
  const urls = [...(c.extraSections || []).map(s => s.image), ...Object.entries(c.texts).filter(([k]) => /image|logo/i.test(k)).map(([,v]) => v), ...c.services.flatMap(s => [s.heroImage, ...s.galleryImages.map(i => i.src)])];
  return urls.every(v => !v || v.startsWith('/') && !v.startsWith('//') || /^https:\/\//.test(v)) && c.collectionItems.every(v => typeof v?.name === 'string') && c.processSteps.every(v => Array.isArray(v) && v.length === 3 && v.every(x => typeof x === 'string'));
}
export default { async fetch(request, env) {
  const url = new URL(request.url), path = url.pathname;
  if(request.method==='GET' && (path==='/blog'||path==='/blog/'||path.startsWith('/blog/'))) {
    if(!env.SITE_CONTENT)return new Response('Blog storage unavailable',{status:503});
    return blogSeoPage(request,env,path);
  }
  if(request.method==='GET'&&path==='/sitemap-blog.xml'){
    if(!env.SITE_CONTENT)return new Response('Storage unavailable',{status:503});
    const posts=await allBlogPosts(env);
    const urls=['https://donnasitsolutions.com.au/blog',...posts.map(p=>'https://donnasitsolutions.com.au/blog/'+p.slug)];
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(u=>'<url><loc>'+u+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
  }
  if (request.method === 'GET' && (path.startsWith('/services/') || path === '/privacy-policy' || path === '/terms-and-conditions' || path === '/partners')) return seoPage(request, env, path);
  if (!path.startsWith('/api/') && !path.startsWith('/media/')) return env.ASSETS.fetch(request);
  if (!env.SITE_CONTENT) return json({ error: 'Storage is not configured. Add the SITE_CONTENT KV binding in Cloudflare.' }, 503);
  try {
    if (path.startsWith('/media/')) {
      const result = await env.SITE_CONTENT.getWithMetadata('media:' + path.slice(7), 'arrayBuffer');
      return result.value ? new Response(result.value, { headers: { 'Content-Type': result.metadata?.type || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } }) : new Response('Not found', { status: 404 });
    }
    if(path==='/api/blog'&&request.method==='GET')return json({posts:(await allBlogPosts(env)).map(safeBlog)});
    if (path === '/api/content' && request.method === 'GET') return json(await env.SITE_CONTENT.get('site_content', 'json') || {});
    if (request.method !== 'GET' && request.headers.get('Origin') !== url.origin) return json({ error: 'Invalid request origin' }, 403);
    if (path === '/api/login' && request.method === 'POST') {
      if (!env.ADMIN_PASSWORD) return json({ error: 'Add the ADMIN_PASSWORD secret in Cloudflare.' }, 503);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown'; const rateKey = 'login:' + ip;
      const attempts = Number(await env.SITE_CONTENT.get(rateKey) || 0);
      if (attempts >= 10) return json({ error: 'Too many login attempts. Try again in 15 minutes.' }, 429);
      const { password } = await request.json();
      if (typeof password !== 'string' || !await equal(password, env.ADMIN_PASSWORD)) { await env.SITE_CONTENT.put(rateKey, String(attempts + 1), { expirationTtl: 900 }); return json({ error: 'Incorrect password' }, 401); }
      const message = `${Date.now() + 28800000}.${crypto.randomUUID()}`; const token = message + '.' + await signature(message, env.SESSION_SECRET || env.ADMIN_PASSWORD);
      return json({ ok: true }, 200, { 'Set-Cookie': cookie(token) });
    }
    if (path === '/api/logout' && request.method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': cookie('', 0) });
    if (path === '/api/enquiries' && request.method === 'POST') {
      const form = await request.formData();
      if (form.get('website')) return json({ ok: true });
      const data = {};
      for (const field of ['name','email','phone','address','items','organisation','type','quantity','date','message']) {
        const value = form.get(field);
        if (typeof value !== 'string' || value.length > 3000) return json({ error: 'Invalid enquiry details.' }, 400);
        data[field] = value.trim();
      }
      for (const field of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref','landing_page','referrer_host','lead_type']) {
        const value = form.get(field);
        data[field] = typeof value === 'string' ? value.slice(0, 150).trim() : '';
      }
      if (!['name','email','phone','address','items'].every(k => data[k]) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return json({ error: 'Please complete the required fields.' }, 400);
      const attachment = form.get('attachment');
      let emailAttachment;
      if (attachment instanceof File && attachment.size) {
        const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png','image/webp'];
        const ext = attachment.name.split('.').pop()?.toLowerCase();
        const validExt = ['pdf','doc','docx','jpg','jpeg','png','webp'].includes(ext);
        if (!allowed.includes(attachment.type) || !validExt || attachment.size > 3 * 1024 * 1024) return json({ error: 'Attach a PDF, Word document or image up to 3 MB.' }, 400);
        const bytes = new Uint8Array(await attachment.arrayBuffer());
        let binary = ''; for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192)); const b64 = btoa(binary);
        emailAttachment = { filename: attachment.name.replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,120), content: b64 };
      }
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      if (await env.SITE_CONTENT.get('enquiry-rate:' + ip)) return json({ error: 'Please wait a minute before submitting another enquiry.' }, 429);
      if (!env.RESEND_API_KEY) {
        console.error('Resend API key is not configured');
        return json({ error: 'Email service is temporarily unavailable. Please call us.' }, 503);
      }
      const id = new Date().toISOString() + ':' + crypto.randomUUID();
      const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
      const fieldLabels = { lead_type: 'Enquiry type', utm_source: 'Marketing source', utm_medium: 'Marketing medium', utm_campaign: 'Campaign', utm_content: 'Campaign content', utm_term: 'Search term', ref: 'Referral code', landing_page: 'Landing page', referrer_host: 'Referring website', name: 'Full name', email: 'Email', phone: 'Phone', address: 'Pickup address / suburb', items: 'Items to collect', organisation: 'Business / organisation', type: 'Customer type', quantity: 'Approximate quantity', date: 'Preferred pickup date', message: 'Additional information' };
      const rows = Object.entries(fieldLabels).map(([key, label]) => '<tr><th style="text-align:left;padding:9px;border-bottom:1px solid #ddd;vertical-align:top">' + escapeHtml(label) + '</th><td style="padding:9px;border-bottom:1px solid #ddd;white-space:pre-wrap">' + escapeHtml(data[key]) + '</td></tr>').join('');
      const payload = {
        from: 'Donna\'s IT Solutions <enquiries@donnasitsolutions.com.au>',
        to: ['info@donnasitsolutions.com.au'],
        reply_to: data.email,
        subject: 'New free pickup enquiry - ' + data.name.slice(0, 80),
        html: '<h2>New website pickup enquiry</h2><table style="border-collapse:collapse">' + rows + '</table>' + (emailAttachment ? '<p>Attachment: ' + escapeHtml(emailAttachment.filename) + '</p>' : ''),
        text: 'New website pickup enquiry\n\n' + Object.entries(fieldLabels).map(([key, label]) => label + ': ' + data[key]).join('\n') + (emailAttachment ? '\nAttachment: ' + emailAttachment.filename : ''),
      };
      if (emailAttachment) payload.attachments = [{ filename: emailAttachment.filename, content: emailAttachment.content }];
      let sent;
      try {
        sent = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error('Resend request failed', String(error));
        return json({ error: 'We could not send your enquiry by email. Please try again or call us.' }, 502);
      }
      const delivery = await sent.json().catch(() => null);
      if (!sent.ok || !delivery?.id) {
        console.error('Resend enquiry delivery failed', { status: sent.status, code: delivery?.name || delivery?.statusCode || 'unknown', message: typeof delivery?.message === 'string' ? delivery.message.slice(0, 200) : '' });
        return json({ error: 'We could not send your enquiry by email. Please try again or call us.' }, 502);
      }
      await env.SITE_CONTENT.put('enquiry:' + id, JSON.stringify({ ...data, attachmentName: emailAttachment?.filename || '', id, createdAt: new Date().toISOString(), status: 'Emailed' }));
      await env.SITE_CONTENT.put('enquiry-rate:' + ip, '1', { expirationTtl: 60 });
      return json({ ok: true });
    }
    if (!await authorized(request, env)) return json({ error: 'Please sign in' }, 401);
    if (path === '/api/session') return json({ ok: true });
    if(path==='/api/admin/blog'&&request.method==='GET')return json({posts:(await allBlogPosts(env,true)).map(safeBlog)});
    if(path==='/api/admin/blog'&&request.method==='PUT'){
      const raw=await request.text();if(raw.length>120000)return json({error:'Article too long'},413);
      const p=JSON.parse(raw);
      if(!p||!blogSlug(p.slug)||!p.title||typeof p.title!=='string'||p.title.length>160||typeof p.body!=='string'||p.body.length>100000||!p.body.trim()||typeof p.excerpt!=='string'||p.excerpt.length>500||typeof p.image!=='string'||(p.image&&!(/^https:\/\//.test(p.image)||/^\/media\/[a-f0-9-]{36}$/.test(p.image)))||!['imageAlt','seoTitle','metaDescription'].every(k=>typeof p[k]==='string')||p.metaDescription.length>300||p.seoTitle.length>180||typeof p.published!=='boolean')return json({error:'Please check the article fields, slug, image URL and content.'},400);
      const existing=await env.SITE_CONTENT.get('blog:'+p.slug,'json');
      const now=new Date().toISOString();
      const clean={slug:p.slug,title:p.title.trim(),excerpt:p.excerpt.trim(),body:p.body.trim(),image:p.image,imageAlt:p.imageAlt.slice(0,200),seoTitle:p.seoTitle.trim(),metaDescription:p.metaDescription.trim(),published:p.published,publishedAt:p.published?(existing?.publishedAt||now):'',updatedAt:now};
      await env.SITE_CONTENT.put('blog:'+p.slug,JSON.stringify(clean));return json({ok:true,post:clean});
    }
    if(path.startsWith('/api/admin/blog/')&&request.method==='DELETE'){
      const slug=path.slice('/api/admin/blog/'.length);if(!blogSlug(slug))return json({error:'Invalid slug'},400);
      await env.SITE_CONTENT.delete('blog:'+slug);return json({ok:true});
    }
    if (path === '/api/content' && request.method === 'PUT') {
      const raw = await request.text(); if (raw.length > 1000000) return json({ error: 'Content is too large' }, 413);
      const content = JSON.parse(raw); if (!validContent(content)) return json({ error: 'Check service slugs, required fields and gallery images. Use HTTPS or local image URLs.' }, 400);
      const previous = await env.SITE_CONTENT.get('site_content');
      if (previous) await env.SITE_CONTENT.put('backup:' + new Date().toISOString(), previous, { expirationTtl: 2592000 });
      await env.SITE_CONTENT.put('site_content', raw); return json({ ok: true });
    }
    if (path === '/api/upload' && request.method === 'POST') {
      const form = await request.formData(), file = form.get('file');
      if (!(file instanceof File) || !['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) return json({ error: 'Choose a JPG, PNG, WebP or GIF up to 5 MB.' }, 400);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const valid = file.type === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 : file.type === 'image/png' ? bytes[0] === 137 && bytes[1] === 80 : file.type === 'image/gif' ? String.fromCharCode(...bytes.slice(0,3)) === 'GIF' : String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP';
      if (!valid) return json({ error: 'Invalid image file' }, 400);
      const id = crypto.randomUUID(); await env.SITE_CONTENT.put('media:' + id, bytes.buffer, { metadata: { type: file.type, name: file.name } }); return json({ url: '/media/' + id, name: file.name });
    }
    if (path.startsWith('/api/media/') && request.method === 'DELETE') {
      const id = path.slice('/api/media/'.length);
      if (!/^[a-f0-9-]{36}$/.test(id)) return json({ error: 'Invalid photo' }, 400);
      const photoUrl = '/media/' + id;
      const content = await env.SITE_CONTENT.get('site_content', 'json');
      const used = value => typeof value === 'string' ? value.includes(photoUrl) : value && typeof value === 'object' ? Object.values(value).some(used) : false;
      if (used(content)) return json({ error: 'This photo is still used on your website. Remove or replace it in its section, save your changes, then delete it here.' }, 409);
      await env.SITE_CONTENT.delete('media:' + id);
      return json({ ok: true });
    }
    if (path === '/api/media' && request.method === 'GET') {
      const list = await env.SITE_CONTENT.list({ prefix: 'media:', cursor: url.searchParams.get('cursor') || undefined });
      return json({ items: list.keys.map(k => ({ url: '/media/' + k.name.slice(6), name: k.metadata?.name || 'Uploaded image' })), cursor: list.list_complete ? null : list.cursor });
    }
    if (path === '/api/enquiries' && request.method === 'GET') {
      const list = await env.SITE_CONTENT.list({ prefix: 'enquiry:', cursor: url.searchParams.get('cursor') || undefined, limit: 50 });
      const items = await Promise.all(list.keys.map(k => env.SITE_CONTENT.get(k.name, 'json'))); return json({ items: items.filter(Boolean), cursor: list.list_complete ? null : list.cursor });
    }
    return json({ error: 'Not found' }, 404);
  } catch { return json({ error: 'Unable to process request. Check your input and storage configuration.' }, 500); }
} };
