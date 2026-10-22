import type { ReactNode } from 'react';
import { Container } from '@/components/ui/primitives';

export function CtaBand({ title, text, actions }: { title: string; text?: string; actions: ReactNode }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[30px] bg-brand-700 px-6 py-14 text-center sm:px-16">
          <div className="leaf-pattern absolute inset-0 -z-10 opacity-40 mix-blend-overlay" aria-hidden />
          <div className="absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" aria-hidden />
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
          {text && <p className="mx-auto mt-4 max-w-xl text-lg text-brand-50/85">{text}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
        </div>
      </Container>
    </section>
  );
}
