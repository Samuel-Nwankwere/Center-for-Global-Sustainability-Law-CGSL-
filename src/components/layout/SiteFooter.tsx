import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronsRight, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { site } from '@/content/site';
import { articles, articlePath, images } from '@/lib/content';
import { isEmail, submitForm } from '@/lib/forms';
import { asset, formatDate } from '@/lib/utils';
import { ButtonLink, Container } from '@/components/ui/primitives';

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Sustainability Domains', to: '/domains' },
  { label: 'Lex Commons', to: '/lex-commons' },
  { label: 'Programs', to: '/programs' },
  { label: 'Training', to: '/training' },
  { label: 'Our People', to: '/people' },
];

/* Ecofine footer newsletter: square input with an attached green submit button. */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done' | 'demo'>('idle');
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setState('error');
    const res = await submitForm('newsletter', { email });
    setState(res.via === 'demo' ? 'demo' : 'done');
  };
  if (state === 'done' || state === 'demo') {
    return (
      <p role="status" className="mt-6 bg-white/5 px-4 py-3 text-sm text-white">
        {state === 'demo' ? 'Demo preview: subscription captured, nothing sent.' : 'Thank you — you’re on the list.'}
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate className="mt-6">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className="flex">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState('idle');
          }}
          placeholder="Email Address"
          className="h-[60px] min-w-0 flex-1 bg-white px-4 text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-0"
          aria-invalid={state === 'error'}
        />
        <button type="submit" className="h-[60px] bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-500">
          Submit
        </button>
      </div>
      {state === 'error' && <p className="mt-2 text-sm text-brand-200">Please enter a valid email address.</p>}
    </form>
  );
}

const widgetTitle = 'mb-7 text-[20px] font-bold text-white';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const recent = articles.filter((a) => a.date).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 2);
  return (
    <footer className="bg-ink-900 text-[14px] text-ink-300">
      <Container className="grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-12 lg:py-[100px]">
        <div className="lg:col-span-3">
          <img src={asset(images.logoLight)} alt={site.name} className="h-12 w-auto brightness-[1.7]" loading="lazy" />
          <p className="mt-6 leading-[27px] text-ink-300">{site.description}</p>
          <ButtonLink to="/contact" arrow className="mt-8">
            Get Started
          </ButtonLink>
        </div>

        <div className="lg:col-span-3 lg:pl-10">
          <h2 className={widgetTitle}>Quick Links</h2>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group inline-flex items-center gap-2 font-medium text-ink-300 transition hover:text-white">
                  <ChevronsRight className="h-4 w-4 text-brand-400 transition group-hover:translate-x-0.5" aria-hidden />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className={widgetTitle}>Recent News</h2>
          <ul className="space-y-6">
            {recent.map((a) => (
              <li key={a.slug} className="group flex gap-4">
                <Link to={articlePath(a)} className="h-20 w-20 shrink-0 overflow-hidden rounded-[10px]" tabIndex={-1} aria-hidden>
                  <img src={asset(a.image)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </Link>
                <div className="min-w-0">
                  <Link to={articlePath(a)} className="line-clamp-2 text-base font-bold leading-6 text-white transition hover:text-brand-300">
                    {a.title}
                  </Link>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-300">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-400" aria-hidden />
                    {formatDate(a.date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className={widgetTitle}>Newsletter</h2>
          <p className="leading-[27px]">New research from the LeGsus Digest and briefings from the LeGsus Trove, straight to your inbox.</p>
          <Newsletter />
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-400" aria-hidden /> <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-400" aria-hidden /> <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" aria-hidden /> {site.location}
            </li>
          </ul>
        </div>
      </Container>

      {/* Ecofine copyright bar: solid theme colour with circular social icons */}
      <div className="bg-brand-600">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-white sm:flex-row">
          <p className="text-[14px] font-medium">Copyright © {year} {site.shortName}. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            {site.social.linkedin && (
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/70 transition hover:bg-white hover:text-brand-600">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            <a href={`mailto:${site.email}`} aria-label="Email" className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/70 transition hover:bg-white hover:text-brand-600">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
