import {
  Building2, Cable, Computer, Database, HardDrive, Laptop, Monitor, Router, School, Server, ShieldCheck, Smartphone, type LucideIcon,
} from 'lucide-react';

export interface CollectibleItem {
  name: string;
  icon: LucideIcon;
}

export interface ServiceDetail {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  shortText: string;
  icon: LucideIcon;
  heroImage: string;
  seoTitle: string;
  metaDescription: string;
  aboutTitle: string;
  aboutText: string[];
  collectItems: CollectibleItem[];
  galleryImages: { src: string; alt: string; fit?: 'cover' | 'contain' }[];
  whoFor: string[];
}

export let services: ServiceDetail[] = [
  {
    slug: 'office-business-e-waste',
    number: '01',
    eyebrow: 'BUSINESS & OFFICE',
    title: 'Office & business e-waste',
    shortText: 'Computers, monitors, workplace IT equipment.',
    icon: Building2,
    heroImage: 'https://images.pexels.com/photos/8353774/pexels-photo-8353774.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    seoTitle: 'Office & Business E-Waste Collection Sydney | Donna\u2019s IT Solution',
    metaDescription: 'Responsible office and business e-waste collection across Sydney. Computers, monitors, workplace IT equipment collected and recycled.',
    aboutTitle: 'About our office & business e-waste collection',
    aboutText: [
      'Donna\u2019s IT Solution helps Sydney businesses clear out unwanted office and IT equipment through a convenient collection service. Whether you\u2019re upgrading workstations, closing an office, or simply decluttering storage rooms, we collect the electronic waste your business no longer needs.',
      'We work with offices, businesses and organisations of all sizes. From a handful of old monitors to a full workplace clear-out, we arrange collection at a time that suits your operations.',
      'Collected equipment is handled responsibly, with a focus on keeping electronic waste out of landfill. Where possible, equipment and components are directed towards appropriate recycling and recovery pathways.',
    ],
    collectItems: [
      { name: 'Desktop computers', icon: Computer },
      { name: 'Laptops', icon: Laptop },
      { name: 'Monitors', icon: Monitor },
      { name: 'Other IT equipment', icon: Computer },
      { name: 'Cables & accessories', icon: Cable },
      { name: 'Office electronics', icon: Building2 },
    ],
    galleryImages: [
      { src: '/assets/images/client-ewaste-4.jpg', alt: 'Donna’s IT Solutions free e-waste collection artwork with collection truck, computer equipment and electronics', fit: 'contain' },
      { src: '/assets/images/client-ewaste-6.jpg', alt: 'Client-supplied collage of electronic devices, recycling equipment and collection services', fit: 'contain' },
      { src: '/assets/images/client-ewaste-5.jpg', alt: 'Donna’s IT Solutions recycling and disposal services brochure with secure data handling information', fit: 'contain' },
    ],
    whoFor: ['Small to medium businesses', 'Corporate offices', 'Co-working spaces', 'Organisations upgrading their IT'],
  },
  {
    slug: 'school-collections',
    number: '02',
    eyebrow: 'SCHOOLS & EDUCATION',
    title: 'School collections',
    shortText: 'Computer labs, laptops and educational technology.',
    icon: School,
    heroImage: 'https://images.pexels.com/photos/10638069/pexels-photo-10638069.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    seoTitle: 'School E-Waste Collection Sydney | Donna\u2019s IT Solution',
    metaDescription: 'E-waste collection for schools and educational institutions in Sydney. Computer labs, laptops and educational technology collected and responsibly recycled.',
    aboutTitle: 'About our school e-waste collection',
    aboutText: [
      'Schools and educational institutions regularly upgrade their technology, leaving older equipment that needs to be removed. Donna\u2019s IT Solution provides a dedicated collection service for schools across Sydney, helping clear out computer labs, classrooms and storage areas.',
      'We understand that schools have specific scheduling needs, so we arrange collections at times that minimise disruption to students and staff.',
      'Collected educational technology is handled with the same responsible approach we apply to all e-waste, keeping old devices out of landfill and directing equipment towards appropriate recycling.',
    ],
    collectItems: [
      { name: 'Desktop computers', icon: Computer },
      { name: 'Laptops & tablets', icon: Laptop },
      { name: 'Monitors', icon: Monitor },
      { name: 'Cables & chargers', icon: Cable },
      { name: 'Other IT equipment', icon: Computer },
      { name: 'Other electronics', icon: HardDrive },
    ],
    galleryImages: [
      { src: '/assets/images/client-ewaste-4.jpg', alt: 'Donna’s IT Solutions free e-waste collection artwork with collection truck, computer equipment and electronics', fit: 'contain' },
      { src: '/assets/images/client-ewaste-6.jpg', alt: 'Client-supplied collage of electronic devices, recycling equipment and collection services', fit: 'contain' },
    ],
    whoFor: ['Primary and secondary schools', 'TAFEs and training colleges', 'Universities', 'After-school and tutoring programmes'],
  },
  {
    slug: 'bulk-collection',
    number: '03',
    eyebrow: 'COMMERCIAL / BULK',
    title: 'Bulk collection',
    shortText: 'Larger quantities of equipment from commercial clear-outs.',
    icon: HardDrive,
    heroImage: 'https://images.pexels.com/photos/17489160/pexels-photo-17489160.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    seoTitle: 'Bulk E-Waste Collection Sydney | Donna\u2019s IT Solution',
    metaDescription: 'Bulk e-waste collection for commercial clear-outs in Sydney. Larger quantities of IT equipment and electronics collected efficiently and responsibly.',
    aboutTitle: 'About our bulk e-waste collection',
    aboutText: [
      'When a business is relocating, closing, or undertaking a large-scale IT refresh, the volume of electronic waste can be significant. Donna\u2019s IT Solution offers a bulk collection service to handle larger quantities of equipment from commercial clear-outs across Sydney.',
      'We discuss the scope of your clear-out in advance so we can plan the right approach for the volume and type of equipment involved.',
      'All collected equipment is processed through responsible recycling pathways, ensuring that bulk quantities of e-waste are kept out of landfill.',
    ],
    collectItems: [
      { name: 'Computers & PCs', icon: Computer },
      { name: 'Monitors', icon: Monitor },
      { name: 'Servers & racks', icon: Server },
      { name: 'Networking equipment', icon: Router },
      { name: 'Cables', icon: Cable },
      { name: 'Other electronic waste', icon: HardDrive },
    ],
    galleryImages: [
      { src: '/assets/images/client-ewaste-6.jpg', alt: 'Client-supplied collage of electronic devices, recycling equipment and collection services', fit: 'contain' },
      { src: '/assets/images/client-ewaste-5.jpg', alt: 'Donna’s IT Solutions recycling and disposal services brochure with secure data handling information', fit: 'contain' },
      { src: '/assets/images/client-ewaste-4.jpg', alt: 'Donna’s IT Solutions free e-waste collection artwork with collection truck, computer equipment and electronics', fit: 'contain' },
    ],
    whoFor: ['Businesses relocating or closing', 'IT refresh projects', 'Commercial clear-outs', 'Organisations with storage rooms of old equipment'],
  },
  {
    slug: 'secure-itad',
    number: '04',
    eyebrow: 'IT ASSET DISPOSAL',
    title: 'Secure ITAD',
    shortText: 'Servers, networking equipment and redundant business hardware.',
    icon: Database,
    heroImage: 'https://images.pexels.com/photos/17489151/pexels-photo-17489151.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    seoTitle: 'Secure IT Asset Disposal Sydney | Donna\u2019s IT Solution',
    metaDescription: 'Secure IT asset disposal (ITAD) in Sydney. Servers, networking equipment and redundant business hardware collected and handled with care.',
    aboutTitle: 'About our secure IT asset disposal',
    aboutText: [
      'IT asset disposal involves the careful removal and handling of business hardware that may have contained sensitive data or been part of critical infrastructure. Donna\u2019s IT Solution provides a collection service for servers, networking equipment and redundant business hardware across Sydney.',
      'We understand that disposing of IT assets requires careful handling. We discuss your requirements in advance so the collection is planned and managed appropriately.',
      'Collected IT assets are directed to responsible recycling pathways, keeping redundant hardware out of landfill.',
    ],
    collectItems: [
      { name: 'Servers', icon: Server },
      { name: 'Networking equipment', icon: Router },
      { name: 'Rack-mounted hardware', icon: Database },
      { name: 'Cables', icon: Cable },
      { name: 'Storage devices', icon: HardDrive },
      { name: 'Other IT hardware', icon: Computer },
    ],
    galleryImages: [
      { src: '/assets/images/client-ewaste-6.jpg', alt: 'Client-supplied collage of electronic devices, recycling equipment and collection services', fit: 'contain' },
      { src: '/assets/images/client-ewaste-4.jpg', alt: 'Donna’s IT Solutions free e-waste collection artwork with collection truck, computer equipment and electronics', fit: 'contain' },
      { src: '/assets/images/client-ewaste-5.jpg', alt: 'Donna’s IT Solutions recycling and disposal services brochure with secure data handling information', fit: 'contain' },
    ],
    whoFor: ['Businesses decommissioning servers', 'Data centre operators', 'Companies with networking infrastructure', 'Organisations upgrading IT systems'],
  },
  {
    slug: 'secure-data-destruction',
    number: '05',
    eyebrow: 'DATA HANDLING',
    title: 'Secure data destruction',
    shortText: 'Careful handling for devices that may contain sensitive information.',
    icon: ShieldCheck,
    heroImage: 'https://images.pexels.com/photos/38411741/pexels-photo-38411741.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800',
    seoTitle: 'Secure Data Destruction Sydney | Donna\u2019s IT Solution',
    metaDescription: 'Secure data destruction for devices with sensitive information in Sydney. Careful handling of hard drives, laptops and storage devices.',
    aboutTitle: 'About our secure data destruction service',
    aboutText: [
      'Many electronic devices contain storage that may hold sensitive or confidential information. Donna\u2019s IT Solution provides careful handling for devices that may contain sensitive data, ensuring they are collected and managed through the appropriate process.',
      'If you have concerns about data on devices being collected, let us know when you book your pickup. We can discuss how the equipment will be handled.',
      'This service is suitable for businesses, schools and organisations that need devices with potentially sensitive data to be handled carefully as part of the collection and recycling process.',
    ],
    collectItems: [
      { name: 'Hard drives', icon: HardDrive },
      { name: 'Laptops', icon: Laptop },
      { name: 'Desktop computers', icon: Computer },
      { name: 'Mobile devices', icon: Smartphone },
      { name: 'Servers', icon: Server },
      { name: 'Other storage devices', icon: ShieldCheck },
    ],
    galleryImages: [
      { src: 'https://images.pexels.com/photos/32923533/pexels-photo-32923533.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200', alt: 'Hard disk drive components showing circuitry' },
      { src: 'https://images.pexels.com/photos/2644598/pexels-photo-2644598.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200', alt: 'Broken hard disk drive with internal components exposed' },
      { src: 'https://images.pexels.com/photos/32920312/pexels-photo-32920312.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200', alt: 'Stack of internal hard disk drives' },
      { src: '/assets/images/client-ewaste-5.jpg', alt: 'Donna’s IT Solutions recycling and disposal services brochure with secure data handling information', fit: 'contain' },
    ],
    whoFor: ['Businesses with confidential data', 'Schools with student devices', 'Healthcare and legal practices', 'Any organisation handling sensitive information'],
  },
];

export const serviceProcessSteps = [
  ['01', 'Contact us', 'Get in touch by phone, WhatsApp or the pickup enquiry form.'],
  ['02', 'Tell us what you have', 'Share details about your equipment, location and approximate quantity.'],
  ['03', 'Arrange collection', 'We confirm the equipment, collection address and a suitable time.'],
  ['04', 'We collect your items', 'Our team arrives and removes the equipment for responsible recycling.'],
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}


export const defaultServices = services.map(service => ({ ...service, icon: undefined, collectItems: service.collectItems.map(item => ({ name: item.name })) }));
export function replaceServices(items: typeof defaultServices) {
  const withoutPrinters = (value: string) => value.replace(/,?\s*printers?(?:\s*(?:and|&)\s*scanners?)?/gi, '').replace(/\s+,/g, ',').replace(/,\s*and\s+/g, ' and ').replace(/\s{2,}/g, ' ').trim();
  const original = services;
  services = items.map((item, index) => ({ ...item, shortText: withoutPrinters(item.shortText), metaDescription: withoutPrinters(item.metaDescription), aboutText: item.aboutText.map(withoutPrinters), icon: original.find(s => s.slug === item.slug)?.icon || original[index]?.icon || Building2, collectItems: item.collectItems.filter(entry => !/\b(printers?|scanners?)\b/i.test(entry.name)).map(entry => ({ ...entry, icon: Computer })) }));
}
