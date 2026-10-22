import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/content/site';
import { images } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { Container, Section } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';
import { EnquiryForm } from '@/components/sections/EnquiryForm';

const topics = ['General enquiry', 'Advisory services', 'Training', 'Partnerships & collaboration', 'Publications & media', 'Volunteering', 'Donations'];

/** Ecofine "Contact Page 1": three info boxes, then map + form side by side. */
export default function ContactPage() {
  useSeo('Contact', 'Get in touch with the Center for Global Sustainability Law.');
  const boxes = [
    { icon: Phone, title: 'Contact Info', lines: [site.phone], href: site.phoneHref },
    { icon: Mail, title: 'Mail Us', lines: [site.email], href: `mailto:${site.email}` },
    { icon: MapPin, title: 'Our Location', lines: [site.location] },
    { icon: Clock, title: 'Global Team', lines: ['Working across time zones'] },
  ];
  return (
    <>
      <PageHero title="Contact Us" image={images.homeHero} crumbs={[{ label: 'Contact' }]} />
      <Section className="pb-0 lg:pb-0">
        <Container className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {boxes.map((b) => (
            <div key={b.title} className="group flex items-start gap-5 rounded-eco bg-white p-7 shadow-card ring-1 ring-ink-200 transition hover:-translate-y-1 hover:ring-transparent">
              <span className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-brand-600 group-hover:text-white">
                <b.icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-ink-900">{b.title}</h2>
                {b.lines.map((l) =>
                  b.href ? (
                    <a key={l} href={b.href} className="mt-1 block break-words font-medium hover:text-brand-600">
                      {l}
                    </a>
                  ) : (
                    <p key={l} className="mt-1 font-medium">
                      {l}
                    </p>
                  ),
                )}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <a
            href="https://www.google.com/maps/search/?api=1&query=New+York%2C+United+States"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-eco bg-ink-50"
          >
            <div className="dots-map absolute inset-0 [mask-image:none]" aria-hidden />
            <svg className="absolute inset-0 h-full w-full text-brand-200" aria-hidden preserveAspectRatio="none" viewBox="0 0 600 420" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M0 300 C120 220 220 340 330 250 S520 120 600 170" />
              <path d="M0 90 C110 130 220 40 330 100 S500 330 600 300" />
              <path d="M170 0 L250 420 M430 0 L380 420" />
            </svg>
            <span className="relative flex flex-col items-center gap-3 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-lg ring-[10px] ring-brand-600/20 transition group-hover:scale-110">
                <MapPin className="h-7 w-7" aria-hidden />
              </span>
              <span className="text-2xl font-extrabold text-ink-900">{site.location}</span>
              <span className="text-sm font-bold text-brand-600 group-hover:underline">Open in Google Maps</span>
            </span>
          </a>
          <div>
            <p className="eyebrow">Contact Us</p>
            <h2 className="section-title">Do You Have Any Question?</h2>
            <p className="mb-8 mt-4 leading-[27px]">Whether you have a question about our work, want to collaborate, or simply want to connect — we’d love to hear from you.</p>
            <EnquiryForm
              kind="contact"
              submitLabel="Send Message"
              fields={[
                { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
                { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'organisation', label: 'Organisation', autoComplete: 'organization' },
                { name: 'subject', label: 'Topic', type: 'select', options: topics, required: true },
                { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help?' },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
