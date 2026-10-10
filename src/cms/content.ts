import defaults from './text-defaults.json';
import type { LucideIcon } from 'lucide-react';
import { Computer } from 'lucide-react';
export interface SiteContent { videos?: { url: string; title: string }[]; reviews?: { name: string; quote: string; rating: number }[]; googleReviewsUrl?: string;  texts: Record<string, string>; settings: { phone: string; email: string; whatsapp: string }; services: unknown[]; collectionItems: { name: string; image?: string }[]; processSteps: string[][]; extraSections: { title: string; text: string; image: string }[]; }
// Curated free-to-use Unsplash photos. Clients can replace each image in admin.
export const defaultCollectionPhotos: Record<string, string> = {
  'Laptops': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=480&q=80&auto=format',
  'Desktops & Monitors': 'https://images.unsplash.com/photo-1639413665566-2f75adf7b7ca?w=480&q=80&auto=format',
  'Mobile Phones': 'https://images.unsplash.com/photo-1665576847080-04dc28fde1bb?w=480&q=80&auto=format',
  'Cables & Wires': 'https://images.unsplash.com/photo-1640108176177-55d9418bc54e?w=480&q=80&auto=format',
  'Hard Drives': 'https://images.unsplash.com/photo-1601737487795-dab272f52420?w=480&q=80&auto=format',
  'Servers & Racks': 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?w=480&q=80&auto=format',
  'Tablets': 'https://images.unsplash.com/photo-1646494735075-db74d6df917d?w=480&q=80&auto=format',
  'Cameras': 'https://images.unsplash.com/photo-1680712409129-0d0bd0fe729e?w=480&q=80&auto=format',
  'Headsets & Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&q=80&auto=format',
  'Batteries & UPS': 'https://images.unsplash.com/photo-1788025487924-fdacced2fce6?w=480&q=80&auto=format',
  'Circuit Boards': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=480&q=80&auto=format',
};
export const defaultTexts: Record<string, string> = { ...defaults, 'Settings.logo': '/assets/images/image.png' };
let current: Partial<SiteContent> = {};
export function applyContent(content: Partial<SiteContent>) { current = content; }
export function text(key: string, fallback: string) { return current.texts?.[key] ?? fallback.map((item) => ({ ...item, image: defaultCollectionPhotos[item.name] })); }
export function getCollectionItems(fallback: { name: string; icon: LucideIcon }[]) { return current.collectionItems?.map((item, i) => ({ ...item, image: item.image === undefined ? defaultCollectionPhotos[item.name] : item.image, icon: fallback.find((original) => original.name === item.name)?.icon || Computer })) ?? fallback; }
export function getProcessSteps(fallback: string[][]) { return current.processSteps ?? fallback; }

export function getVideos() { return current.videos ?? [{ url: 'https://youtu.be/1DvInYwMpjw', title: 'Donna’s IT Solutions video 1' }, { url: 'https://youtu.be/PXlHqLo8Xxk', title: 'Donna’s IT Solutions video 2' }]; }
export function getReviews() { return (current.reviews ?? []).filter(r => r.rating === 5 && r.name.trim() && r.quote.trim()); }
export function getGoogleReviewsUrl() { return current.googleReviewsUrl || 'https://share.google/RB5ApmKPJn3uebPDQ'; }
export function youtubeId(url: string): string | null { try { const u = new URL(url); const host = u.hostname.toLowerCase(); let id = ''; if (host === 'youtu.be' || host === 'www.youtu.be') id = u.pathname.slice(1).split('/')[0]; else if (['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)) id = u.pathname === '/watch' ? u.searchParams.get('v') || '' : u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] || ''; return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null; } catch { return null; } }
export function getExtraSections() { return current.extraSections ?? []; }
