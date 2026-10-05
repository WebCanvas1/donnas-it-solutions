import { text } from '@/cms/content';
import { FormEvent, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function PickupForm({ submitted, onSubmit, onReset }: { submitted: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onReset: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    setPending(true); setError('');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to submit enquiry');
      onSubmit(event);
    } catch (e) { setError((e as Error).message); } finally { setPending(false); }
  }
  return <form className="pickup-form" onSubmit={submit}>{
    submitted
      ? <div className="form-success"><div className="success-icon"><Check size={24} /></div><h3>{text("PickupForm.text.1", "Thanks for getting in touch.")}</h3><p>{text("PickupForm.text.2", "Your pickup enquiry is ready to be followed up. Donna’s IT Solution will be in contact using the details you provided.")}</p><button className="text-link" type="button" onClick={onReset}>{text("PickupForm.text.3", "Send another enquiry ")}<ArrowRight size={17} /></button></div>
      : <>
        <div className="form-header"><h3>{text("PickupForm.text.4", "Request a pickup")}</h3><span>{text("PickupForm.text.5", "All fields marked * are required.")}</span></div>
        <div className="form-row"><label>{text("PickupForm.text.6", "Full name *")}<input required name="name" placeholder={text("PickupForm.placeholder.28", "Your name")} /></label><label>{text("PickupForm.text.7", "Business / organisation")}<input name="organisation" placeholder={text("PickupForm.placeholder.29", "Optional")} /></label></div>
        <div className="form-row"><label>{text("PickupForm.text.8", "Email *")}<input required type="email" name="email" placeholder={text("PickupForm.placeholder.30", "you@example.com")} /></label><label>{text("PickupForm.text.9", "Phone *")}<input required type="tel" name="phone" placeholder={text("PickupForm.placeholder.31", "0470 624 714")} /></label></div>
        <label>{text("PickupForm.text.10", "Pickup address / suburb *")}<input required name="address" placeholder={text("PickupForm.placeholder.32", "Where should we collect from?")} /></label>
        <div className="form-row"><label>{text("PickupForm.text.11", "Customer type")}<select required name="type" defaultValue=""><option value="" disabled>{text("PickupForm.text.12", "Select one")}</option><option>{text("PickupForm.text.13", "Business / Office")}</option><option>{text("PickupForm.text.14", "School / Education")}</option><option>{text("PickupForm.text.15", "Commercial")}</option><option>{text("PickupForm.text.16", "Bulk Collection")}</option><option>{text("PickupForm.text.17", "Other Organisation")}</option></select></label><label>{text("PickupForm.text.18", "Approximate quantity")}<select name="quantity" defaultValue=""><option value="" disabled>{text("PickupForm.text.19", "Select one")}</option><option>{text("PickupForm.text.20", "A few items")}</option><option>{text("PickupForm.text.21", "Small collection")}</option><option>{text("PickupForm.text.22", "Large collection")}</option><option>{text("PickupForm.text.23", "Not sure yet")}</option></select></label></div>
        <div className="form-row"><label>{text("PickupForm.text.24", "Preferred pickup date")}<input type="date" name="date" /></label><label>{text("PickupForm.text.25", "What would you like collected? ")}<input required name="items" placeholder={text("PickupForm.placeholder.33", "e.g. computers, monitors")} /></label></div>
        <label>{text("PickupForm.text.26", "Message / additional information")}<textarea name="message" rows={4} placeholder={text("PickupForm.placeholder.34", "Anything else we should know?")}></textarea></label>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
        {error && <p role="alert">{error}</p>}
        {pending && <p role="status">Sending enquiry…</p>}
        <button disabled={pending} className="button button-gold form-submit" type="submit">{text("PickupForm.text.27", "Book pickup ")}<ArrowRight size={17} /></button>
      </>
  }</form>;
}

