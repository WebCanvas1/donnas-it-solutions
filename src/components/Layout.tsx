import { useState } from 'react';
import {
  ArrowRight, ChevronDown, Menu, Phone, X,
} from 'lucide-react';
import { BrandMark, PHONE, PHONE_TEL, EMAIL } from './shared';
import { services } from '@/data/services';


export function Header({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  function navigate(path: string) {
    setMenuOpen(false);
    setServicesOpen(false);
    onNavigate(path);
  }

  function handleNavClick(e: React.MouseEvent, path: string) {
    e.preventDefault();
    navigate(path);
  }

  return <header className="site-header">
    <div className="topline"><div className="container topline-inner"><span>Serving Sydney and surrounding areas</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div>
    <div className="container nav-inner">
      <a href="/#home" onClick={(e) => handleNavClick(e, '/')} className="brand-card"><BrandMark /></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">
        <a href="/#home" onClick={(e) => handleNavClick(e, '/')}>Home</a>
        <div className={`nav-dropdown ${servicesOpen ? 'dropdown-open' : ''}`}>
          <button className="nav-dropdown-toggle" type="button" onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen}>
            Services <ChevronDown size={14} className="dropdown-chevron" />
          </button>
          <div className="dropdown-menu">
            {services.map((s) => (
              <a key={s.slug} href={`/services/${s.slug}`} onClick={(e) => handleNavClick(e, `/services/${s.slug}`)}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
        <a href="/#what-we-collect" onClick={(e) => handleNavClick(e, '/#what-we-collect')}>What We Collect</a>
        <a href="/#about" onClick={(e) => handleNavClick(e, '/#about')}>About</a>
        <a href="/#contact" onClick={(e) => handleNavClick(e, '/#contact')}>Contact</a>
        <a className="nav-phone" href={`tel:${PHONE_TEL}`}><Phone size={16} /> {PHONE}</a>
        <a className="button button-gold button-small" href="/#contact" onClick={(e) => handleNavClick(e, '/#contact')}>Book pickup <ArrowRight size={15} /></a>
      </nav>
    </div>
  </header>;
}

export function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  function handleNavClick(e: React.MouseEvent, path: string) {
    e.preventDefault();
    onNavigate(path);
  }

  return <footer className="site-footer">
    <div className="container footer-grid">
      <div><p>Responsible e-waste collection and recycling solutions for businesses, schools and organisations.</p></div>
      <div>
        <h4>Quick links</h4>
        <a href="/#services" onClick={(e) => handleNavClick(e, '/#services')}>Services</a>
        <a href="/#what-we-collect" onClick={(e) => handleNavClick(e, '/#what-we-collect')}>What we collect</a>
        <a href="/#how-it-works" onClick={(e) => handleNavClick(e, '/#how-it-works')}>How it works</a>
        <a href="/#contact" onClick={(e) => handleNavClick(e, '/#contact')}>Contact</a>
      </div>
      <div>
        <h4>Services</h4>
        {services.map((s) => (
          <a key={s.slug} href={`/services/${s.slug}`} onClick={(e) => handleNavClick(e, `/services/${s.slug}`)}>{s.title}</a>
        ))}
      </div>
      <div>
        <h4>Contact</h4>
        <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <span>Auburn Area / Sydney, NSW</span>
      </div>
      <div>
        <h4>Start a conversation</h4>
        <p>Have IT equipment ready to go? We’re here to help.</p>
        <a className="button button-gold button-small" href="/#contact" onClick={(e) => handleNavClick(e, '/#contact')}>Book pickup <ArrowRight size={15} /></a>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© 2026 Donna’s IT Solution</span>
      <span>Serving Sydney and surrounding areas</span>
      <div><a href="/#home" onClick={(e) => handleNavClick(e, '/')}>Privacy Policy</a><a href="/#home" onClick={(e) => handleNavClick(e, '/')}>Terms & Conditions</a></div>
    </div>
  </footer>;
}
