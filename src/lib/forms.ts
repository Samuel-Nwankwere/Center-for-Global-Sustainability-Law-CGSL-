import { site } from '@/content/site';

export type FormKind = 'contact' | 'volunteer' | 'partner' | 'newsletter' | 'donation-pledge';

export interface SubmitResult {
  /** `sent` — delivered to the configured endpoint; `mailto` — handed to the visitor's email app; `demo` — preview build, nothing sent. */
  via: 'sent' | 'mailto' | 'demo';
}

const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const demo = import.meta.env.VITE_DEMO === 'true';

const subjects: Record<FormKind, string> = {
  contact: 'Website enquiry',
  volunteer: 'Volunteer application',
  partner: 'Partnership enquiry',
  newsletter: 'Newsletter subscription',
  'donation-pledge': 'Donation pledge',
};

/**
 * Submit a website form. When `VITE_FORM_ENDPOINT` is configured (e.g. Formspree,
 * a serverless function or a CRM webhook) the data is POSTed as JSON. Without
 * one, the visitor's email client opens with a pre-filled message to CGSL, so
 * the forms are fully functional on static hosting with no backend.
 */
export async function submitForm(kind: FormKind, data: Record<string, string>): Promise<SubmitResult> {
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ form: kind, ...data }),
    });
    if (!res.ok) throw new Error(`Submission failed (${res.status})`);
    return { via: 'sent' };
  }
  if (demo) {
    await new Promise((r) => setTimeout(r, 600));
    return { via: 'demo' };
  }
  const body = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `${labelize(k)}: ${v}`)
    .join('\n');
  const subject = data.subject ? `${subjects[kind]}: ${data.subject}` : subjects[kind];
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { via: 'mailto' };
}

const labelize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
