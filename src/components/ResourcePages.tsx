import { useState } from 'react';
import { PickupForm } from './PickupForm';
import { EMAIL, PHONE, PHONE_TEL, whatsappLink } from '@/cms/contact';
import { services } from '@/data/services';

export const faqs = [
  ['What kinds of electronic waste can I enquire about?', 'We regularly receive enquiries about computers, laptops, monitors, cables, networking hardware and other workplace electronics. Please send an item list so we can confirm collection suitability.'],
  ['Do you collect from businesses and schools?', 'Yes. Our services are designed for offices, schools and organisations in Sydney and surrounding areas. Collection arrangements depend on the equipment and location.'],
  ['How do I arrange a collection?', 'Send a pickup enquiry with the equipment, approximate quantity and suburb. Our team will discuss the next steps with you.'],
  ['Is every collection free?', 'Collection terms can vary depending on the items, quantity and location. Please contact us to confirm any applicable charges before booking.'],
  ['Can you handle equipment containing sensitive data?', 'Please mention data-bearing equipment in your enquiry. We will discuss the handling arrangements and any specific data-destruction requirements before collection.'],
  ['Which Sydney suburbs do you cover?', 'We serve Sydney and surrounding areas. Tell us your suburb or postcode so we can confirm availability for your location.'],
  ['Can I send photos or a list of equipment?', 'Yes. The pickup enquiry form accepts a supporting document or image, subject to its stated file size limit.'],
  ['How quickly can you collect?', 'Collection dates are arranged individually. Include your preferred date when requesting a pickup.'],
];

export function FAQPage() {
  return <main className="resource-page"><div className="container resource-inner"><p className="eyebrow">HELP & ANSWERS</p><h1>Frequently asked questions</h1><p>Answers to common questions about Sydney e-waste collection. For a specific quote or collection request, contact our team.</p><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div><p>Still have questions? <a href="/contact">Request a pickup</a> or call <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>.</p></div></main>;
}
export function AcceptedItemsPage() {
 const items = [...new Set(services.flatMap(s=>s.collectItems.map(i=>i.name)))];
 return <main className="resource-page"><div className="container resource-inner"><p className="eyebrow">E-WASTE COLLECTION</p><h1>What electronic waste can we collect?</h1><p>We handle enquiries for business and school IT equipment across Sydney. The following are examples of equipment you can ask us about; acceptance is confirmed before collection.</p><ul className="resource-item-grid">{items.map(item=><li key={item}>{item}</li>)}</ul><h2>Items requiring confirmation</h2><p>For batteries, damaged electronics, hazardous components, unusually large equipment or anything not listed, contact us first. Please do not leave equipment at an address without an agreed collection.</p><a className="button button-gold" href="/contact">Check your items and request a pickup</a></div></main>;
}
export function ContactPage() {
 const [submitted,setSubmitted]=useState(false);
 return <main className="resource-page"><div className="container resource-inner"><p className="eyebrow">CONTACT DONNA'S IT SOLUTIONS</p><h1>Request an e-waste collection in Sydney</h1><p>Tell us what you need collected, your suburb and preferred date. We'll review your enquiry and contact you to discuss arrangements.</p><div className="resource-contact-grid"><div><h2>Speak to our team</h2><p>Call <a href={`tel:${PHONE_TEL}`}>{PHONE}</a></p><p>Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p><p><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p><p>Service area: Sydney and surrounding suburbs. Availability is confirmed by enquiry.</p></div><PickupForm submitted={submitted} onSubmit={e=>{e.preventDefault();setSubmitted(true);}} onReset={()=>setSubmitted(false)}/></div></div></main>;
}
export function ServiceAreasPage() {
 const areas=['Sydney CBD and inner city','North Sydney and the North Shore','Parramatta and Western Sydney','Ryde and Macquarie Park','Liverpool and South West Sydney','Norwest and the Hills District','Inner West','St George and Sutherland area'];
 return <main className="resource-page"><div className="container resource-inner"><p className="eyebrow">SYDNEY SERVICE AREAS</p><h1>E-waste collection across Sydney</h1><p>Donna's IT Solutions handles collection enquiries from Sydney businesses, schools and organisations. The areas below are examples of locations you can enquire about; coverage and pickup availability are confirmed individually.</p><ul className="resource-item-grid">{areas.map(a=><li key={a}>{a}</li>)}</ul><p>Not sure whether we can collect from your location? Send us your suburb, postcode and equipment details.</p><a className="button button-gold" href="/contact">Check collection availability</a></div></main>;
}
