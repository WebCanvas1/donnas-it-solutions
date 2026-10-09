import defaults from './text-defaults.json';
import type { LucideIcon } from 'lucide-react';
import { Computer } from 'lucide-react';
export interface SiteContent { videos?: { url: string; title: string }[]; reviews?: { name: string; quote: string; rating: number }[]; googleReviewsUrl?: string;  texts: Record<string, string>; settings: { phone: string; email: string; whatsapp: string }; services: unknown[]; collectionItems: { name: string }[]; processSteps: string[][]; extraSections: { title: string; text: string; image: string }[]; }
export const defaultTexts: Record<string, string> = { ...defaults, 'Settings.logo': '/assets/images/image.png' };
let current: Partial<SiteContent> = {};
export function applyContent(content: Partial<SiteContent>) { current = content; }
export function text(key: string, fallback: string) { return current.texts?.[key] ?? fallback; }
export function getCollectionItems(fallback: { name: string; icon: LucideIcon }[]) { return current.collectionItems?.map((item, i) => ({ ...item, icon: fallback[i]?.icon || Computer })) ?? fallback; }
export function getProcessSteps(fallback: string[][]) { return current.processSteps ?? fallback; }

export function getVideos() { return current.videos ?? [{ url: 'https://youtu.be/1DvInYwMpjw', title: 'Donna’s IT Solutions video 1' }, { url: 'https://youtu.be/PXlHqLo8Xxk', title: 'Donna’s IT Solutions video 2' }]; }
export function getReviews() { return (current.reviews ?? []).filter(r => r.rating === 5 && r.name.trim() && r.quote.trim()); }
export function getGoogleReviewsUrl() { return current.googleReviewsUrl || 'https://share.google/RB5ApmKPJn3uebPDQ'; }
export function youtubeId(url: string): string | null { try { const u = new URL(url); const host = u.hostname.toLowerCase(); let id = ''; if (host === 'youtu.be' || host === 'www.youtu.be') id = u.pathname.slice(1).split('/')[0]; else if (['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)) id = u.pathname === '/watch' ? u.searchParams.get('v') || '' : u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] || ''; return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null; } catch { return null; } }
export function getExtraSections() { return current.extraSections ?? []; }
