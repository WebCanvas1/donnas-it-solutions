# Admin setup

Admin URL: `/admin` (also `/#/admin`).

## Cloudflare configuration

1. Create a Workers KV namespace named `DONNAS_SITE_CONTENT` in Cloudflare.
2. Add its ID to `wrangler.jsonc`:

```json
"kv_namespaces": [
  { "binding": "SITE_CONTENT", "id": "YOUR_NAMESPACE_ID" }
]
```

3. In the `donnas-it-solutions` Worker Settings → Variables and Secrets, add `ADMIN_PASSWORD` as a secret. Choose a unique strong password. Do not commit it to GitHub. Optional: add `SESSION_SECRET` as a separate random secret.
4. Deploy the latest commit. Keep build `npm run build` and deploy `npx wrangler deploy`.
5. Open `/admin` and sign in. The first save publishes the existing default content to KV.

The public website uses the built-in content until storage is configured. The admin panel will show a setup error instead of pretending to save. API and media paths are routed to the Worker; other requests serve the static site.

## Editing

- Homepage: edit headings, paragraphs, button labels, images and their alternative text.
- Services: edit existing services, duplicate/add a service, change its unique lowercase hyphenated slug, remove or reorder entries; edit descriptions, SEO text and gallery images.
- Collection items and process steps: add, edit, remove and reorder entries.
- Additional sections: add titled text/image sections to the homepage.
- Settings: phone, email, WhatsApp and logo.
- Header & footer, service page labels, form labels: edit shared wording.
- Upload JPG, PNG, WebP or GIF images up to 5 MB from any image field. SVG uploads are excluded. Images are stored in KV and shared across browsers.
- Media: view uploaded images and copy their URL to reuse them. Removing a gallery entry does not delete the image from storage.
- Save & publish: makes draft edits public. Changes may take up to a minute to propagate through KV. Unsaved changes are flagged.
- Export/restore JSON backups; the server also retains prior content versions for 30 days.
- Enquiries: pickup form submissions are saved to a protected inbox. Email notifications are not configured.

Login sessions last eight hours in secure HTTP-only cookies. Login attempts and enquiry submissions have basic rate limits. There is one administrator password, not individual accounts or roles.

## Validation

`npm run typecheck`, `npm run lint`, `npm run build`, `node --test worker/admin.test.mjs`.
