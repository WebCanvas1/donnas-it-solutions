export let PHONE = '0470 624 714';
export let PHONE_TEL = '0470624714';
export let EMAIL = 'info@donnasitsolutions.com.au';
export let whatsappLink = 'https://wa.me/61470624714?text=' + encodeURIComponent('Hi Donna\u2019s IT Solutions, I\u2019d like to enquire about an e-waste collection.');

export function configureContact(settings: { phone: string; email: string; whatsapp: string }) {
  PHONE = settings.phone; PHONE_TEL = settings.phone.replace(/[^+0-9]/g, ''); EMAIL = settings.email;
  whatsappLink = 'https://wa.me/' + settings.whatsapp.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Hi, I would like to arrange an e-waste collection.');
}
