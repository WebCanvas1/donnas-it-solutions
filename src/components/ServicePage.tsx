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
    <section className="service-overview">
      <div className="container service-overview-grid">
        <div className="service-overview-copy">
          <div className="service-overview-label"><Icon size={22} /><span className="eyebrow">{service.eyebrow}</span></div>
          <h1>{service.title}</h1>
          <h2>{service.aboutTitle}</h2>
          {service.aboutText.map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <div className="service-overview-gallery" aria-label="Service gallery">
          <div className="eyebrow">COLLECTION IN ACTION</div>
          <div className="service-overview-images">
            {service.galleryImages.map((img, i) => (
              <figure key={img.src} className={i === 0 ? 'overview-image overview-image-main' : 'overview-image'}>
                <img src={img.src} alt={img.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              </figure>
            ))}
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
