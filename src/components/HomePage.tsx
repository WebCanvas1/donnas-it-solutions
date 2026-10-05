import { FormEvent, useState, type CSSProperties } from 'react';
import {
  ArrowRight, Battery, Cable, Camera, CircuitBoard, Earth, Headphones,
  HardDrive, Laptop, Mail, MapPin, Monitor, Phone, Printer, Recycle,
  Server, ShieldCheck, Smartphone, Tablet,
} from 'lucide-react';
import { PickupForm } from './PickupForm';
import { PHONE, PHONE_TEL, EMAIL, whatsappLink, WhatsAppIcon } from './shared';
import { services } from '@/data/services';

const heroImage = 'https://images.pexels.com/photos/8353774/pexels-photo-8353774.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800';

const collectItems = [
  { name: 'Laptops', icon: Laptop }, { name: 'Desktops & Monitors', icon: Monitor }, { name: 'Mobile Phones', icon: Smartphone },
  { name: 'Cables & Wires', icon: Cable }, { name: 'Hard Drives', icon: HardDrive }, { name: 'Servers & Racks', icon: Server },
  { name: 'Printers & Scanners', icon: Printer }, { name: 'Tablets', icon: Tablet }, { name: 'Cameras', icon: Camera },
  { name: 'Headsets & Audio', icon: Headphones }, { name: 'Batteries & UPS', icon: Battery }, { name: 'Circuit Boards', icon: CircuitBoard },
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

    <section className="collect-reference section" id="what-we-collect">
      <div className="container collect-reference-layout">
        <div className="collect-reference-copy">
          <h2>We Recycle All IT &amp;<br />Electronic Equipment</h2>
          <p className="collect-reference-intro">From a single old laptop to an entire office of outdated equipment, we accept all types of IT technology for recycling. Don't see your item listed? Just ask — chances are we can take it.</p>
          <div className="collect-reference-cards">
            {collectItems.map(({ name, icon: Icon }) => (
              <div className="collect-reference-card" key={name}><div className="collect-reference-icon"><Icon size={24} strokeWidth={1.8} /></div><span>{name}</span></div>
            ))}
          </div>
          <div className="collect-reference-note">Don't see your item? We accept almost all electronic equipment. Contact us to confirm — we're happy to help!</div>
        </div>
        <div className="collect-reference-visual">
          <div className="collect-reference-poster"><img src="/assets/images/collection-reference.png" alt="Donna’s IT Solutions e-waste recycling poster showing computers, monitors, printers and accessories" /></div>
          <div className="collect-free-badge"><strong>FREE</strong><span>Pickup Service</span></div>
          <div className="collect-recycling-badge"><strong>100%</strong><span>of collected e-waste is properly recycled — nothing goes to landfill</span></div>
        </div>
      </div>
    </section>
  </main>;
}
