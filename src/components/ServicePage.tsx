import { useEffect, useState } from 'react';
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

  return <main>
    {/* About */}
    <section className="section">
      <div className="container service-about">
        <div className="service-about-side">
          <div className="service-icon-large"><Icon size={32} /></div>
          <div className="eyebrow">{service.eyebrow}</div>
        </div>
        <div className="service-about-body">
          <h1>{service.title}</h1>
          <h2>{service.aboutTitle}</h2>
          {service.aboutText.map((para, i) => <p key={i}>{para}</p>)}
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

    {/* Enquiry form */}
    <section className="section section-cta" id="contact">
      <div className="container" style={{ maxWidth: 800 }}>
        <PickupForm submitted={submitted} onSubmit={handleSubmit} onReset={() => setSubmitted(false)} />
      </div>
    </section>
  </main>;
}
