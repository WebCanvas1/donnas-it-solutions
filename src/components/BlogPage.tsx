import { PHONE_TEL } from '@/cms/contact';

/** Editorial landing page; articles should be reviewed before publishing. */
export function BlogPage() {
  return <main className="resource-page"><div className="container resource-inner">
    <p className="eyebrow">E-WASTE RECYCLING INSIGHTS</p>
    <h1>Business e-waste recycling guides</h1>
    <p>Practical tips for Sydney businesses, schools and organisations planning responsible collection and recycling of old electronic equipment.</p>
    <section aria-labelledby="prepare-ewaste">
      <h2 id="prepare-ewaste">How to prepare office electronics for collection</h2>
      <p>Start with an inventory of old laptops, desktop computers, monitors, networking equipment and accessories. Note quantities, approximate sizes and the collection location so the team can discuss suitable arrangements.</p>
      <p>Identify any devices containing confidential information before collection. Discuss handling and any data-destruction requirements with your IT team and recycling provider in advance.</p>
      <p>Remove personal belongings and check whether batteries or other special items require separate handling. Do not assume all electronics can be collected without prior confirmation.</p>
      <p>Ready to arrange a collection? <a href="/contact">Send a pickup enquiry</a> or call <a href={`tel:${PHONE_TEL}`}>our team</a>.</p>
    </section>
    <section aria-labelledby="more-guides">
      <h2 id="more-guides">More resources</h2>
      <p>Explore <a href="/what-we-accept">what we accept</a>, <a href="/service-areas">Sydney service areas</a> and <a href="/faq">frequently asked questions</a>.</p>
    </section>
  </div></main>;
}
