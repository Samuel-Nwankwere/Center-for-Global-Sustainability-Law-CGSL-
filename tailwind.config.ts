import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

// Colours are defined once as CSS variables in src/styles/index.css so the
// palette can be re-themed without touching components.
const scale = (name: string) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
      step,
      `rgb(var(--${name}-${step}) / <alpha-value>)`,
    ]),
  );

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' } },
    extend: {
      colors: {
        brand: scale('brand'),
        ink: scale('ink'),
      },
      fontFamily: {
        // Ecofine uses Manrope for everything; `serif` is kept as an alias so
        // existing heading classes resolve to the theme's display face.
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      // Tailwind's default type scale reduced ~10% site-wide.
      fontSize: {
        xs: ['0.7rem', { lineHeight: '0.95rem' }],
        sm: ['0.8rem', { lineHeight: '1.15rem' }],
        base: ['0.9rem', { lineHeight: '1.35rem' }],
        lg: ['1rem', { lineHeight: '1.6rem' }],
        xl: ['1.125rem', { lineHeight: '1.6rem' }],
        '2xl': ['1.35rem', { lineHeight: '1.8rem' }],
        '3xl': ['1.7rem', { lineHeight: '2rem' }],
        '4xl': ['2rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.7rem', { lineHeight: '1' }],
        '6xl': ['3.4rem', { lineHeight: '1' }],
        '7xl': ['4rem', { lineHeight: '1' }],
      },
      maxWidth: { content: '72rem', prose: '44rem' },
      borderRadius: { eco: '15px', '4xl': '2rem' },
      boxShadow: {
        // Ecofine --box-shedow
        card: '0px 20px 42px rgb(0 0 0 / 0.053)',
        lift: '0px 41px 42px rgb(0 0 0 / 0.08)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
        'sticky-in': { from: { transform: 'translateY(-100%)' }, to: { transform: 'none' } },
        'ken-burns': { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .2s ease-out both',
        'slide-in': 'slide-in .3s cubic-bezier(.2,.7,.2,1) both',
        'sticky-in': 'sticky-in .4s ease-in-out both',
        'ken-burns': 'ken-burns 8s ease-out both',
      },
      typography: () => ({
        cgsl: {
          css: {
            '--tw-prose-body': 'rgb(var(--ink-600))',
            '--tw-prose-headings': 'rgb(var(--ink-900))',
            '--tw-prose-links': 'rgb(var(--brand-600))',
            '--tw-prose-bold': 'rgb(var(--ink-900))',
            '--tw-prose-bullets': 'rgb(var(--brand-500))',
            '--tw-prose-counters': 'rgb(var(--brand-600))',
            '--tw-prose-quotes': 'rgb(var(--ink-800))',
            '--tw-prose-quote-borders': 'rgb(var(--brand-500))',
            '--tw-prose-captions': 'rgb(var(--ink-500))',
            '--tw-prose-hr': 'rgb(var(--ink-200))',
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config;
