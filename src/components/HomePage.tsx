import { FormEvent, useState, type CSSProperties } from 'react';
import {
  ArrowRight, Building2, Cable, Computer, Earth,
  HardDrive, Laptop, Mail, MapPin, Monitor, Phone, Printer, Recycle,
  Router, ShieldCheck, Smartphone,
} from 'lucide-react';
import { PickupForm } from './PickupForm';
import { PHONE, PHONE_TEL, EMAIL, whatsappLink, WhatsAppIcon } from './shared';
import { services } from '@/data/services';

const heroImage = 'https://images.pexels.com/photos/8353774/pexels-photo-8353774.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800';
const circuitImage = 'https://images.pexels.com/photos/38411741/pexels-photo-38411741.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200';

const collectItems = [
  { name: 'Computers & PCs', icon: Computer }, { name: 'Laptops', icon: Laptop }, { name: 'Monitors', icon: Monitor },
  { name: 'Mobile devices', icon: Smartphone }, { name: 'Printers', icon: Printer }, { name: 'Cables', icon: Cable },
  { name: 'Computer accessories', icon: HardDrive }, { name: 'Office electronics', icon: Building2 },
  { name: 'Networking equipment', icon: Router }, { name: 'Other electronic waste', icon: Recycle },
];

const processSteps = [
  ['01', 'Tell us what you have', 'Submit the collection form with details about your equipment, location and approximate quantity.'],
  ['02', 'We discuss the pickup', 'We’ll confirm the equipment, quantity, collection address and suitable collection arrangements.'],
  ['03', 'We collect', 'Our team arrives and removes the equipment.'],
];

export function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }

  function handleNavClick(e: React.MouseEvent, path: string) { e.preventDefault(); onNavigate(path); }

  return <main>
    <section className="hero" id="home">
      <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> E-WASTE RECYCLING SYDNEY</div>
        <h1>E-waste collection<br /><em>for businesses & schools.</em></h1>
        <p>Responsible electronic waste collection and recycling for businesses, schools and organisations across Sydney.</p>
        <div className="hero-actions">
          <a className="button button-gold" href="#contact" onClick={(e) => e.preventDefault()}>Book pickup <ArrowRight size={18} /></a>
          <a className="button button-whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} /> WhatsApp us</a>
        </div>
        <div className="hero-trust"><span>Convenient collection</span><span>Responsible recycling</span><span>Secure data handling</span></div>
      </div>
      <div className="hero-note"><span>01</span><span>Electronic waste<br />handled with care</span></div>
    </section>

    <section className="enquiry section" id="contact">
      <div className="container enquiry-grid">
        <div className="enquiry-copy">
          <div className="eyebrow">START HERE</div>
          <h2>Ready to clear<br /><span>the clutter?</span></h2>
          <p>Tell us what you need collected and we’ll help arrange the next step.</p>
          <div className="contact-details">
            <a href={`tel:${PHONE_TEL}`}><Phone size={19} /><span><small>Call us</small>{PHONE}</span></a>
            <a href={`mailto:${EMAIL}`}><Mail size={19} /><span><small>Email us</small>{EMAIL}</span></a>
            <div><MapPin size={19} /><span><small>Service area</small>Auburn Area / Sydney, NSW</span></div>
          </div>
        </div>
        <PickupForm submitted={submitted} onSubmit={handleSubmit} onReset={() => setSubmitted(false)} />
      </div>
    </section>

    <section className="services section" id="services">
      <div className="container">
        <div className="section-heading services-heading">
          <div><div className="eyebrow">OUR WORK</div><h2>Practical solutions<br /><span>for old technology.</span></h2></div>
          <p>Collection services for IT equipment and electronics that no longer have a place in your workplace or organisation.</p>
        </div>
        <div className="service-grid">
          {services.map(({ number, eyebrow, title, shortText, heroImage: image, icon: Icon, slug }) => (
            <article className="service-card service-panel" key={title} style={{ '--service-image': `url(${image})` } as CSSProperties}>
              <div className="service-panel-overlay" />
              <div className="service-panel-content">
                <div className="service-top"><span>{number}</span><Icon size={22} /></div>
                <div className="service-eyebrow">{eyebrow}</div>
                <h3>{title}</h3>
                <p>{shortText}</p>
                <a className="service-cta" href={`/services/${slug}`} onClick={(e) => handleNavClick(e, `/services/${slug}`)}>Learn more <ArrowRight size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="simple-process section" id="how-it-works">
      <div className="container">
        <div className="simple-process-heading"><div className="eyebrow">HOW IT WORKS</div><h2>SIMPLE PROCESS.<br /><span>NO HASSLE.</span></h2></div>
        <div className="process-steps">
          {processSteps.map(([number, title, text]) => (
            <article className="process-step" key={number}>
              <div className="process-step-number"><strong>{number}</strong><span /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <a className="button button-gold process-cta" href="#contact" onClick={(e) => e.preventDefault()}>Book pickup <ArrowRight size={17} /></a>
      </div>
    </section>

    <section className="trust-strip">
      <div className="container trust-grid">
        <div><Recycle size={20} /><span>E-waste pickup</span></div>
        <div><Phone size={20} /><span>Collection enquiries</span></div>
        <div><MapPin size={20} /><span>Sydney service area</span></div>
        <div><ShieldCheck size={20} /><span>Secure data handling</span></div>
        <div><Earth size={20} /><span>Responsible recycling</span></div>
      </div>
    </section>

    <section className="collect section section-muted" id="what-we-collect">
      <div className="container">
        <div className="section-heading">
          <div><div className="eyebrow">WHAT WE COLLECT</div><h2>One less thing<br /><span>to worry about.</span></h2></div>
          <p>Not sure if we can take it? Get in touch and tell us what you have.</p>
        </div>
        <div className="collect-layout">
          <div className="collect-list">
            {collectItems.map(({ name, icon: Icon }) => (
              <div className="collect-item" key={name}><Icon size={20} /><span>{name}</span><ArrowRight size={15} /></div>
            ))}
          </div>
          <div className="collect-feature">
            <img src={circuitImage} alt="Close-up of stacked circuit boards ready for responsible e-waste recycling" />
            <div className="feature-caption"><span>Electronic waste</span><strong>Sorted for a better future.</strong></div>
          </div>
        </div>
      </div>
    </section>
  </main>;
}
