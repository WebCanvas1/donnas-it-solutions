import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { PHONE_TEL, whatsappLink } from '@/cms/contact';
const questions = [
 ['What items can I enquire about?', 'Computers, laptops, monitors, cables and business IT equipment. Acceptance is confirmed when we review your item list.'],
 ['Do you collect in my suburb?', 'We serve Sydney and surrounding areas. Share your suburb or postcode so we can confirm pickup availability.'],
 ['How much will collection cost?', 'Pricing or free-collection eligibility depends on the equipment, volume and location. We will confirm arrangements before booking.'],
 ['What about sensitive data?', 'Tell us if your devices contain sensitive information. We can discuss handling requirements before collection.'],
 ['How do I request a pickup?', 'Use the pickup enquiry form with your name, contact details, suburb and item list.']
];
export function EnquiryAssistant() {
 const [open,setOpen]=useState(false),[answer,setAnswer]=useState<number|null>(null);
 return <>
  <div className="mobile-contact-bar"><a href={`tel:${PHONE_TEL}`}><Phone size={17}/> Call now</a><a href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> WhatsApp</a></div>
  <div className="help-widget">
   {open && <section className="help-panel" aria-label="Pickup enquiry assistant"><div className="help-panel-head"><strong>Need help with a pickup?</strong><button type="button" onClick={()=>setOpen(false)} aria-label="Close help"><X size={20}/></button></div><p>Choose a common question, or send us your details for a personal response.</p><div className="help-questions">{questions.map(([q],i)=><button type="button" key={q} onClick={()=>setAnswer(answer===i?null:i)} aria-expanded={answer===i}>{q}</button>)}</div>{answer!==null&&<p className="help-answer">{questions[answer][1]}</p>}<a className="button button-gold" href="/contact">Request a pickup / quote</a><a className="help-whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer">Talk to a person on WhatsApp</a><small>We use your information to respond to your enquiry. <a href="/privacy-policy">Privacy policy</a>.</small></section>}
   <button className="help-toggle" type="button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Close pickup help':'Open pickup help'}>{open?<X size={22}/>:<MessageCircle size={22}/>}<span>{open?'Close':'Ask a question'}</span></button>
  </div>
 </>;
}
