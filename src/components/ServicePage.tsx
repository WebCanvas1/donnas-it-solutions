import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PHONE, PHONE_TEL, EMAIL, whatsappLink, WhatsAppIcon } from './shared';
import { PickupForm } from './PickupForm';
import { type ServiceDetail } from '@/data/services';

export function ServicePage({ service }: { service: ServiceDetail; onNavigate: (path: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const { icon: Icon } = service;

  useEffect(() => {
    document.title = service.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', service.metaDescription);
    window.scrollTo(0, 0);
  }, [service]);

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); setSubmitted(true); }

  return <main className="service-page">
    <section className="section">
      <div className="container service-split">
        <div className="service-about-body">
          <div className="service-split-label"><Icon size={26} /><span className="eyebrow">{service.eyebrow}</span></div>
          <h1>{service.title}</h1>
          <h2>{service.aboutTitle}</h2>
          {service.aboutText.map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <div className="service-split-gallery">
          <div className="section-heading"><div><div className="eyebrow">GALLERY</div><h2>Collection in action</h2></div></div>
          <div className="service-gallery">
            <div className="gallery-feature"><img src={service.galleryImages[0].src} alt={service.galleryImages[0].alt} /></div>
            <div className="gallery-thumbs">
              {service.galleryImages.slice(1).map((img) => (
                <div className="gallery-thumb" key={img.src}><img src={img.src} alt={img.alt} loading="lazy" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Enquiry form */}
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
  </main>;
}
