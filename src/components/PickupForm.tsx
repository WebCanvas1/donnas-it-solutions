import { FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function PickupForm({ submitted, onSubmit, onReset }: { submitted: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onReset: () => void }) {
  return <form className="pickup-form" onSubmit={onSubmit}>{
    submitted
      ? <div className="form-success"><div className="success-icon"><Check size={24} /></div><h3>Thanks for getting in touch.</h3><p>Your pickup enquiry is ready to be followed up. Donna’s IT Solution will be in contact using the details you provided.</p><button className="text-link" type="button" onClick={onReset}>Send another enquiry <ArrowRight size={17} /></button></div>
      : <>
        <div className="form-header"><h3>Request a pickup</h3><span>All fields marked * are required.</span></div>
        <div className="form-row"><label>Full name *<input required name="name" placeholder="Your name" /></label><label>Business / organisation<input name="organisation" placeholder="Optional" /></label></div>
        <div className="form-row"><label>Email *<input required type="email" name="email" placeholder="you@example.com" /></label><label>Phone *<input required type="tel" name="phone" placeholder="0470 624 714" /></label></div>
        <label>Pickup address / suburb *<input required name="address" placeholder="Where should we collect from?" /></label>
        <div className="form-row"><label>Customer type<select required name="type" defaultValue=""><option value="" disabled>Select one</option><option>Business / Office</option><option>School / Education</option><option>Commercial</option><option>Bulk Collection</option><option>Other Organisation</option></select></label><label>Approximate quantity<select name="quantity" defaultValue=""><option value="" disabled>Select one</option><option>A few items</option><option>Small collection</option><option>Large collection</option><option>Not sure yet</option></select></label></div>
        <div className="form-row"><label>Preferred pickup date<input type="date" name="date" /></label><label>What would you like collected? <input required name="items" placeholder="e.g. computers, monitors" /></label></div>
        <label>Message / additional information<textarea name="message" rows={4} placeholder="Anything else we should know?"></textarea></label>
        <button className="button button-gold form-submit" type="submit">Book pickup <ArrowRight size={17} /></button>
      </>
  }</form>;
}
