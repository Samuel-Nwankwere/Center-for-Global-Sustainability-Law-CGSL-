import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { donate } from '@/content/pages';
import { site } from '@/content/site';
import { images } from '@/lib/content';
import { submitForm } from '@/lib/forms';
import { cn } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Button, Container, Section } from '@/components/ui/primitives';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { FormSuccess } from '@/components/ui/Form';

export default function DonatePage() {
  useSeo('Donate', donate.intro);
  const [frequency, setFrequency] = useState<'One-time' | 'Monthly'>('One-time');
  const [amount, setAmount] = useState<number | null>(100);
  const [custom, setCustom] = useState('');
  const [pledged, setPledged] = useState<false | 'sent' | 'mailto' | 'demo'>(false);
  const value = amount ?? (Number(custom) || 0);

  const pledge = async () => {
    if (value <= 0) return;
    const res = await submitForm('donation-pledge', { frequency, amount: `USD ${value}` });
    setPledged(res.via);
  };

  return (
    <>
      <PageHero eyebrow="Get involved" title="Give to support our work" image={images.donate} crumbs={[{ label: 'Get Involved' }, { label: 'Donate' }]} intro={donate.intro} />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Your gift builds the legal foundation of sustainability</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Every gift, whether one-time or recurring, directly sustains our mission and expands our global impact.
            </p>
            <div className="mt-10">
              <FeatureGrid items={donate.impact} columns={2} />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-eco bg-white p-6 shadow-lift ring-1 ring-ink-200/70 sm:p-10 lg:sticky lg:top-28">
              {pledged ? (
                <FormSuccess title="Thank you for your generosity!">
                  {pledged === 'demo' ? (
                    <p>
                      <strong>Demo preview:</strong> your ${value} {frequency.toLowerCase()} pledge was captured, but nothing was sent. On the live site it is delivered to {site.email}.
                    </p>
                  ) : pledged === 'sent' ? (
                    <p>Your pledge has been received. Our team will reply with the simplest way to complete your gift.</p>
                  ) : (
                    <p>Your email app should open with your pledge to {site.email}. If it didn’t, email us directly and we’ll reply with giving options.</p>
                  )}
                </FormSuccess>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">Make a gift</h2>
                  <div className="mt-6 grid grid-cols-2 rounded-[5px] bg-ink-50 p-1 ring-1 ring-ink-200" role="radiogroup" aria-label="Frequency">
                    {(['One-time', 'Monthly'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        role="radio"
                        aria-checked={frequency === f}
                        onClick={() => setFrequency(f)}
                        className={cn('rounded-full py-2.5 text-sm font-semibold transition', frequency === f ? 'bg-brand-600 text-white shadow' : 'text-ink-600')}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3" role="radiogroup" aria-label="Amount">
                    {donate.amounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        role="radio"
                        aria-checked={amount === a}
                        onClick={() => {
                          setAmount(a);
                          setCustom('');
                        }}
                        className={cn(
                          'rounded-2xl py-4 text-lg font-semibold ring-1 transition',
                          amount === a ? 'bg-brand-50 text-brand-800 ring-2 ring-brand-600' : 'text-ink-800 ring-ink-200 hover:ring-brand-300',
                        )}
                      >
                        ${a}
                      </button>
                    ))}
                    <label className={cn('relative rounded-2xl ring-1 transition', amount === null ? 'ring-2 ring-brand-600' : 'ring-ink-200')}>
                      <span className="sr-only">Custom amount</span>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-ink-400">$</span>
                      <input
                        inputMode="numeric"
                        value={custom}
                        onChange={(e) => {
                          setCustom(e.target.value.replace(/[^\d]/g, ''));
                          setAmount(null);
                        }}
                        placeholder="Other"
                        className="h-full w-full rounded-2xl bg-transparent py-4 pl-7 pr-2 text-lg font-semibold focus:outline-none"
                      />
                    </label>
                  </div>
                  <Button type="button" size="lg" className="mt-8 w-full" disabled={value <= 0} onClick={pledge}>
                    <Mail className="h-5 w-5" aria-hidden /> Pledge ${value || 0} {frequency === 'Monthly' ? 'per month' : ''}
                  </Button>
                  <p className="mt-4 flex items-start gap-2 rounded-2xl bg-ink-50 p-4 text-xs leading-relaxed text-ink-600">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                    Secure online card payments are coming soon. For now, your pledge is sent to our team by email and we’ll follow up with giving options. For other enquiries, contact {site.email}.
                  </p>
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <section className="bg-brand-800 py-16 text-center text-white">
        <Container>
          <p className="font-serif text-2xl text-white sm:text-3xl">{donate.thanks}</p>
        </Container>
      </section>
    </>
  );
}
