import defaults from './text-defaults.json';
import type { LucideIcon } from 'lucide-react';
import { Computer } from 'lucide-react';
export interface SiteContent { texts: Record<string, string>; settings: { phone: string; email: string; whatsapp: string }; services: unknown[]; collectionItems: { name: string }[]; processSteps: string[][]; extraSections: { title: string; text: string; image: string }[]; }
export const defaultTexts: Record<string, string> = { ...defaults, 'Settings.logo': '/assets/images/image.png' };
let current: Partial<SiteContent> = {};
export function applyContent(content: Partial<SiteContent>) { current = content; }
export function text(key: string, fallback: string) { return current.texts?.[key] ?? fallback; }
export function getCollectionItems(fallback: { name: string; icon: LucideIcon }[]) { return current.collectionItems?.map((item, i) => ({ ...item, icon: fallback[i]?.icon || Computer })) ?? fallback; }
export function getProcessSteps(fallback: string[][]) { return current.processSteps ?? fallback; }

export function getExtraSections() { return current.extraSections ?? []; }
