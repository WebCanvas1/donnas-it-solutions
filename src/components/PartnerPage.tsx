import { useState, type FormEvent } from 'react';
import { EMAIL, PHONE, PHONE_TEL } from '@/cms/contact';
export function PartnerPage() {
 const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>) {
  e.preventDefault();setBusy(true);setError('');
  const data=new FormData(e.currentTarget);
  const q=new URLSearchParams(location.search);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref']){const v=q.get(key);if(v)data.set(key,v.slice(0,150));}
  data.set('lead_type','Referral partnership');data.set('landing_page','/partners');
  try{const r=await fetch('/api/enquiries',{method:'POST',body:data});const j=await r.json();if(!r.ok)throw Error(j.error||'Unable to send enquiry');setDone(true);}
  catch(err){setError((err as Error).message);}finally{setBusy(false);}
 }
 return <main className="legal-page partner-page"><div className="container legal-page-inner">
 <a className="legal-back" href="/">← Back to home</a><div className="eyebrow">PARTNER WITH US</div>
 <h1>Refer an e-waste collection opportunity</h1>
 <p className="partner-intro">Donna’s IT Solutions welcomes enquiries from Sydney IT providers, office relocation teams, facilities managers and other businesses looking for help with unwanted computers and IT equipment.</p>
 <div className="partner-benefits"><article><h2>Who we work with</h2><p>Managed IT providers, commercial removalists, fit-out companies, schools and facilities teams.</p></article><article><h2>How referrals work</h2><p>Tell us about your business and the equipment involved. We will discuss collection suitability and next steps directly.</p></article><article><h2>Clear arrangements</h2><p>Submitting this form does not guarantee collection or create an exclusive partnership. Any fees or referral arrangements must be agreed separately.</p></article></div>
 <section className="partner-form-panel"><h2>Discuss a referral partnership</h2>
 {done?<p role="status">Thanks! Your enquiry has been sent. We'll be in touch.</p>:<form className="partner-form" onSubmit={submit}>
 <input className="partner-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
 <div className="partner-form-row"><label>Your name *<input name="name" required maxLength={120}/></label><label>Business name *<input name="organisation" required maxLength={160}/></label></div>
 <div className="partner-form-row"><label>Email *<input name="email" type="email" required maxLength={200}/></label><label>Phone *<input name="phone" type="tel" required maxLength={80}/></label></div>
 <label>Business location / service area *<input name="address" required maxLength={250}/></label>
 <label>Type of business<select name="type" defaultValue=""><option value="">Select a type</option><option>IT support / managed services</option><option>Office relocation / fit-out</option><option>Facilities / property management</option><option>Education</option><option>Other</option></select></label>
 <label>Equipment or potential referrals *<textarea name="items" required rows={3} maxLength={1000}/></label>
 <label>Additional details<textarea name="message" rows={3} maxLength={1500}/></label>
 {error&&<p className="partner-error" role="alert">{error}</p>}
 <button className="button button-gold" type="submit" disabled={busy}>{busy?'Sending…':'Send partnership enquiry'}</button>
 <p className="partner-privacy">Your details will be used to respond to your enquiry. See our <a href="/privacy-policy">Privacy Policy</a>.</p>
 </form>}</section>
 <p className="partner-contact">Prefer to talk? Call <a href={`tel:${PHONE_TEL}`}>{PHONE}</a> or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
 </div></main>;
}