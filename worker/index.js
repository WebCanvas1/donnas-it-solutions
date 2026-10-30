// Server-provided metadata allows crawlers to identify each service before JavaScript runs.
const SEO_SERVICES = {"office-business-e-waste":{"heading":"Office & business e-waste","title":"Office Electronics Recycling Sydney | Business E-Waste","description":"Office electronics recycling in Sydney. We collect computers, laptops, monitors and phones from businesses for responsible recycling. Enquire about a pickup."},"school-collections":{"heading":"School collections","title":"School E-Waste Collection Sydney | Computer Recycling","description":"Computer recycling for Sydney schools. Enquire about collections of old computers, laptops, tablets and IT equipment for responsible recycling."},"bulk-collection":{"heading":"Bulk collection","title":"Commercial E-Waste Collection Sydney | Bulk Pickups","description":"Commercial e-waste collection across Sydney for offices, warehouses and data centres. Discuss bulk pickups and responsible recycling. Request a quote."},"secure-itad":{"heading":"Secure ITAD","title":"IT Asset Disposal Sydney | Secure ITAD Services","description":"IT asset disposal in Sydney for corporate IT equipment, servers, networking gear and business hardware. Discuss safe collection and handling. Request a quote."},"secure-data-destruction":{"heading":"Secure data destruction","title":"Computer Disposal Sydney | Secure Data Handling","description":"Computer disposal enquiries in Sydney for hard drives, laptops and devices holding sensitive data. Discuss secure handling and data-destruction requirements."}};
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
  const response = await env.ASSETS.fetch(new Request(new URL(path, request.url), request));
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
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
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
  if (request.method === 'GET' && (path.startsWith('/services/') || path === '/privacy-policy' || path === '/terms-and-conditions' || path === '/partners')) return seoPage(request, env, path);
  if (!path.startsWith('/api/') && !path.startsWith('/media/')) return env.ASSETS.fetch(request);
  if (!env.SITE_CONTENT) return json({ error: 'Storage is not configured. Add the SITE_CONTENT KV binding in Cloudflare.' }, 503);
  try {
    if (path.startsWith('/media/')) {
      const result = await env.SITE_CONTENT.getWithMetadata('media:' + path.slice(7), 'arrayBuffer');
      return result.value ? new Response(result.value, { headers: { 'Content-Type': result.metadata?.type || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } }) : new Response('Not found', { status: 404 });
    }
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
