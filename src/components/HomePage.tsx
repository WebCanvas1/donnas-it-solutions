import { text } from '@/cms/content';
import { FormEvent, useState, type CSSProperties } from 'react';
import {
  ArrowRight, Battery, Cable, Camera, Earth, Headphones,
  HardDrive, Laptop, Mail, MapPin, Monitor, Phone, Recycle,
  Server, ShieldCheck, Smartphone, Tablet,
} from 'lucide-react';
import { PickupForm } from './PickupForm';
import { PHONE, PHONE_TEL, EMAIL, whatsappLink } from '@/cms/contact';
import { WhatsAppIcon } from './shared';
import { getCollectionItems, getProcessSteps, getExtraSections, getVideos, getReviews, getGoogleReviewsUrl, youtubeId } from '@/cms/content';
import { services } from '@/data/services';

const defaultHeroImage = 'https://images.pexels.com/photos/8353774/pexels-photo-8353774.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800';

const collectItems = [
  { name: 'Laptops', icon: Laptop }, { name: 'Desktops & Monitors', icon: Monitor }, { name: 'Mobile Phones', icon: Smartphone },
  { name: 'Cables & Wires', icon: Cable }, { name: 'Hard Drives', icon: HardDrive }, { name: 'Servers & Racks', icon: Server },
 { name: 'Tablets', icon: Tablet }, { name: 'Cameras', icon: Camera },
  { name: 'Headsets & Audio', icon: Headphones }, { name: 'Batteries & UPS', icon: Battery },
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
      <div className="hero-image" style={{ backgroundImage: `url(${text("HomePage.heroImage", defaultHeroImage)})` }} />

      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" />{text("HomePage.text.1", " E-WASTE RECYCLING SYDNEY")}</div>
        <h1>{text("HomePage.text.2", "E-waste collection")}<br /><em>{text("HomePage.text.3", "for businesses & schools.")}</em></h1>
        <p>{text("HomePage.text.4", "Responsible electronic waste collection and recycling for businesses, schools and organisations across Sydney.")}</p>
        <div className="hero-actions">
          <a className="button button-gold" href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>{"Book Free Pickup"}<ArrowRight size={18} /></a>
          <a className="button button-whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} />{text("HomePage.text.6", " WhatsApp us")}</a>
        </div>

      </div>

    </section>

    {getVideos().some(v => youtubeId(v.url)) && <section className="section" id="videos"><div className="container"><div className="eyebrow">WATCH OUR WORK</div><h2>See Donna’s IT Solutions in action</h2><div className="donna-video-grid">{getVideos().map((video, i) => { const id = youtubeId(video.url); return id ? <article className="donna-video" key={i}><div className="donna-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={video.title || `Video ${i+1}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></article> : null; })}</div></div></section>}

    <section className="enquiry section" id="contact">
      <div className="container enquiry-grid">
        <div className="enquiry-copy">
          <div className="eyebrow">{text("HomePage.text.18", "START HERE")}</div>
          <h2>{text("HomePage.text.19", "Ready to clear")}<br /><span>{text("HomePage.text.20", "the clutter?")}</span></h2>
          <p>{text("HomePage.text.21", "Tell us what you need collected and we’ll help arrange the next step.")}</p>
          <div className="contact-details">
            <a href={`tel:${PHONE_TEL}`}><Phone size={19} /><span><small>{text("HomePage.text.22", "Call us")}</small>{PHONE}</span></a>
            <a href={`mailto:${EMAIL}`}><Mail size={19} /><span><small>{text("HomePage.text.23", "Email us")}</small>{EMAIL}</span></a>
            <div><MapPin size={19} /><span><small>{text("HomePage.text.24", "Service area")}</small>{"Sydney, NSW"}</span></div>
          </div>
        </div>
        <PickupForm submitted={submitted} onSubmit={handleSubmit} onReset={() => setSubmitted(false)} />
      </div>
    </section>

    <section className="services section" id="services">
      <div className="container">
        <div className="section-heading services-heading">
          <div><div className="eyebrow">{text("HomePage.text.26", "OUR WORK")}</div><h2>{text("HomePage.text.27", "Practical solutions")}<br /><span>{text("HomePage.text.28", "for old technology.")}</span></h2></div>
          <p>{text("HomePage.text.29", "Collection services for IT equipment and electronics that no longer have a place in your workplace or organisation.")}</p>
        </div>
        <div className="service-grid">
          {services.map(({ number, eyebrow, title, shortText, heroImage: image, icon: Icon, slug }) => (
            <article className="service-card service-panel" key={title} style={{ '--service-image': `url(${image})` } as CSSProperties}>
              <div className="service-panel-overlay" />
              <div className="service-panel-content">
                <div className="service-top"><span>{number}</span><Icon size={22} /></div>
                <div className="service-eyebrow">{eyebrow}</div>
                <h3>{title}</h3>
                <p style={{ color: '#ffffff', opacity: 1, fontWeight: 650, fontSize: '15px', lineHeight: 1.6, textShadow: '0 2px 6px rgba(0,0,0,.95)' }}>{shortText}</p>
                <a className="service-cta" href={`/services/${slug}`} onClick={(e) => handleNavClick(e, `/services/${slug}`)}>{text("HomePage.text.30", "Learn more ")}<ArrowRight size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="simple-process section" id="how-it-works">
      <div className="container">
        <div className="simple-process-heading"><div className="eyebrow">{text("HomePage.text.31", "HOW IT WORKS")}</div><h2>{text("HomePage.text.32", "SIMPLE PROCESS.")}<br /><span>{text("HomePage.text.33", "NO HASSLE.")}</span></h2></div>
        <div className="process-steps">
          {getProcessSteps(processSteps).map(([number, title, text]) => (
            <article className="process-step" key={number}>
              <div className="process-step-number"><strong>{number}</strong><span /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <a className="button button-gold process-cta" href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>{"Book Free Pickup"}<ArrowRight size={17} /></a>
      </div>
    </section>

    <section className="trust-strip">
      <div className="container trust-grid">
        <div><Recycle size={20} /><span>{text("HomePage.text.35", "E-waste pickup")}</span></div>
        <div><Phone size={20} /><span>{text("HomePage.text.36", "Collection enquiries")}</span></div>
        <div><MapPin size={20} /><span>{text("HomePage.text.37", "Sydney service area")}</span></div>
        <div><ShieldCheck size={20} /><span>{text("HomePage.text.38", "Secure data handling")}</span></div>
        <div><Earth size={20} /><span>{text("HomePage.text.39", "Responsible recycling")}</span></div>
      </div>
    </section>

    <section className="collect-reference section" id="what-we-collect">
      <div className="container collect-reference-layout">
        <div className="collect-reference-copy">
          <h2>{text("HomePage.text.40", "We Recycle All IT &")}<br />{text("HomePage.text.41", "Electronic Equipment")}</h2>
          <p className="collect-reference-intro">{text("HomePage.text.42", "From a single old laptop to an entire office of outdated equipment, we accept all types of IT technology for recycling. Don't see your item listed? Just ask — chances are we can take it.")}</p>
          <div className="collect-reference-cards">
            {getCollectionItems(collectItems).filter(item => !/\b(printers?|scanners?)\b|^circuit boards?\.?$/i.test(item.name.trim())).map(({ name, icon: Icon, image }) => (
              <div className="collect-reference-card" key={name}>
                <div className={image ? "collect-reference-photo" : "collect-reference-icon"}>
                  {image ? <>
                    <img src={image} alt={name} loading="lazy" decoding="async" onError={(event) => {
                      event.currentTarget.style.display = 'none';
                      event.currentTarget.parentElement?.classList.add('photo-failed');
                    }} />
                    <Icon className="photo-fallback-icon" size={24} strokeWidth={1.8} />
                  </> : <Icon size={24} strokeWidth={1.8} />}
                </div>
                <span>{name}</span>
              </div>
            ))}
          </div>
          <div className="collect-reference-note"><><strong>Can’t find your equipment listed?</strong><span> We accept a wide range of electronic and IT equipment. Get in touch with our team to confirm your items and discuss collection options.</span></></div>
        </div>
        <div className="collect-reference-visual">
          <div className="collect-reference-poster"><img loading="lazy" decoding="async" src={text("HomePage.image.51", "/assets/images/client-ewaste-4.jpg")} alt={text("HomePage.alt.49", "Donna\u2019s IT Solutions e-waste recycling poster showing computers, monitors, printers and accessories")} /></div>
          <div className="collect-recycling-badge"><strong>{text("HomePage.text.46", "100%")}</strong><span>{text("HomePage.text.47", "of collected e-waste is properly recycled — nothing goes to landfill")}</span></div>
        </div>
      </div>
    </section>
    <section className="section donna-reviews" id="reviews"><div className="container"><div className="eyebrow">CUSTOMER FEEDBACK</div><h2>What our customers say</h2><div className="donna-review-grid">{getReviews().map((review,i)=><blockquote className="donna-review" key={i}><div aria-label="5 out of 5 stars" className="donna-review-stars">★★★★★</div><p>“{review.quote}”</p><footer>— {review.name}</footer></blockquote>)}</div><a className="button button-gold" href={getGoogleReviewsUrl()} target="_blank" rel="noopener noreferrer">Read our Google reviews <ArrowRight size={17}/></a></div></section>
    {getExtraSections().map((section, i) => <section className="section" key={i}><div className="container free-pickup-layout"><div className="free-pickup-copy"><h2>{section.title}</h2><p style={{ whiteSpace: 'pre-line' }}>{section.text}</p></div>{section.image && <img className="free-pickup-truck" src={section.image} alt={section.title} loading="lazy" />}</div></section>)}
  </main>;
}


