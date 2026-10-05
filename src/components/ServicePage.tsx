import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowRight, ArrowLeft, Check, ChevronRight, Mail, MapPin, Phone,
} from 'lucide-react';
import { PickupForm } from './PickupForm';
import { PHONE, PHONE_TEL, EMAIL, whatsappLink, WhatsAppIcon } from './shared';
import { type ServiceDetail, services, serviceProcessSteps } from '@/data/services';

export function ServicePage({ service, onNavigate }: { service: ServiceDetail; onNavigate: (path: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const { icon: Icon } = service;

  useEffect(() => {
    document.title = service.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', service.metaDescription);
    window.scrollTo(0, 0);
  }, [service]);

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); setSubmitted(true); }
  function handleNavClick(e: React.MouseEvent, path: string) { e.preventDefault(); onNavigate(path); }

  return <main>
    {/* Breadcrumb */}
    <div className="container breadcrumb"><a href="/#services" onClick={(e) => handleNavClick(e, '/#services')}>Services</a><ChevronRight size={14} /><span>{service.title}</span></div>

    {/* Hero */}
    <section className="service-hero">
      <div className="service-hero-image" style={{ backgroundImage: `url(${service.heroImage})` } as CSSProperties} />
      <div className="hero-overlay" />
      <div className="container service-hero-content">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> {service.eyebrow}</div>
        <h1>{service.title}</h1>
        <p>{service.shortText}</p>
        <div className="hero-actions">
          <a className="button button-gold" href="/#contact" onClick={(e) => handleNavClick(e, '/#contact')}>Book pickup <ArrowRight size={18} /></a>
          <a className="button button-whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} /> WhatsApp us</a>
          <a className="button button-outline" href={`tel:${PHONE_TEL}`}><Phone size={17} /> Call {PHONE}</a>
        </div>
      </div>
    </section>

    {/* About */}
    <section className="section">
      <div className="container service-about">
        <div className="service-about-side">
          <div className="service-icon-large"><Icon size={32} /></div>
          <div className="eyebrow">{service.eyebrow}</div>
        </div>
        <div className="service-about-body">
          <h2>{service.aboutTitle}</h2>
          {service.aboutText.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </div>
    </section>

    {/* What We Can Collect */}
    <section className="section section-muted">
      <div className="container">
        <div className="section-heading"><div><div className="eyebrow">WHAT WE CAN COLLECT</div><h2>Items we accept</h2></div></div>
        <div className="collect-grid">
          {service.collectItems.map(({ name, icon: ItemIcon }) => (
            <div className="collect-card" key={name}>
              <div className="collect-card-icon"><ItemIcon size={24} /></div>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Gallery */}
    <section className="section">
      <div className="container">
        <div className="section-heading"><div><div className="eyebrow">GALLERY</div><h2>Collection in action</h2></div></div>
        <div className="service-gallery">
          <div className="gallery-feature">
            <img src={service.galleryImages[0].src} alt={service.galleryImages[0].alt} />
          </div>
          <div className="gallery-thumbs">
            {service.galleryImages.slice(1).map((img) => (
              <div className="gallery-thumb" key={img.src}><img src={img.src} alt={img.alt} /></div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* How Collection Works */}
    <section className="section section-muted" id="how-it-works">
      <div className="container">
        <div className="simple-process-heading"><div className="eyebrow">HOW IT WORKS</div><h2>How collection works</h2></div>
        <div className="process-steps">
          {serviceProcessSteps.map(([number, title, text]) => (
            <article className="process-step" key={number}>
              <div className="process-step-number"><strong>{number}</strong><span /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Who This Service Is For */}
    <section className="section">
      <div className="container service-who-for">
        <div><div className="eyebrow">WHO THIS IS FOR</div><h2>Suitable for</h2></div>
        <div className="who-for-list">
          {service.whoFor.map((item) => (
            <div className="who-for-item" key={item}><Check size={18} /> <span>{item}</span></div>
          ))}
        </div>
      </div>
    </section>

    {/* Final CTA + Form */}
    <section className="section section-cta" id="contact">
      <div className="container enquiry-grid">
        <div className="enquiry-copy">
          <div className="eyebrow">GET STARTED</div>
          <h2>Have items ready for collection?</h2>
          <p>Get in touch with Donna’s IT Solution and arrange your collection today.</p>
          <div className="contact-details">
            <a href={`tel:${PHONE_TEL}`}><Phone size={19} /><span><small>Call us</small>{PHONE}</span></a>
            <a href={`mailto:${EMAIL}`}><Mail size={19} /><span><small>Email us</small>{EMAIL}</span></a>
            <div><MapPin size={19} /><span><small>Service area</small>Auburn Area / Sydney, NSW</span></div>
          </div>
          <div className="hero-actions cta-actions">
            <a className="button button-gold" href={whatsappLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} /> WhatsApp us</a>
          </div>
        </div>
        <PickupForm submitted={submitted} onSubmit={handleSubmit} onReset={() => setSubmitted(false)} />
      </div>
    </section>

    {/* Back to services */}
    <section className="section back-to-services">
      <div className="container">
        <a className="back-link" href="/#services" onClick={(e) => handleNavClick(e, '/#services')}><ArrowLeft size={17} /> Back to all services</a>
        <div className="other-services">
          {services.filter((s) => s.slug !== service.slug).map((s) => (
            <a key={s.slug} className="other-service-link" href={`/services/${s.slug}`} onClick={(e) => handleNavClick(e, `/services/${s.slug}`)}>
              {s.title} <ArrowRight size={15} />
            </a>
          ))}
        </div>
      </div>
    </section>
  </main>;
}
