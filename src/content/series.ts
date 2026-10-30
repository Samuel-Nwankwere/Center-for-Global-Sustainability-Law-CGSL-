import type { PublicationSeries } from './types';

/**
 * Publication series shown on /series. Each series' PDFs live in
 * `src/assets/series/<slug>/`, named `intro.pdf` (optional, shown first) and
 * `issue-1.pdf`, `issue-2.pdf`, … and are picked up automatically. Add issue
 * titles below as they are published.
 */
export const publicationSeries: PublicationSeries[] = [
  {
    slug: 'paris-agreement',
    title: 'The Paris Agreement Series',
    description:
      'A ten-part series taking a deep dive into the operation, implementation, and future of the Paris Agreement. Ten years on, what has the Agreement truly achieved?',
    // Subtitles as they appear on each issue's cover (every cover is headed "The Paris Agreement").
    issueTitles: {
      0: 'Introduction: The Paris Agreement at Ten',
      1: 'The Ambition Gap and the 1.5°C Limit',
      2: 'Scaling Climate Finance and the New Collective Quantitative Goal on climate finance (NCQG); Can Article 9 Deliver at the Scale Paris Requires?',
      3: 'Aligning Global Financial Flows (Article 2.1(c))',
      4: 'Money Matters, But So Does Capability; Understanding Articles 10 & 11 of the Paris Agreement',
      5: 'Sectoral Transformation and Fossil Fuel Phase-Out (Articles 2 & 4)',
      6: 'Reinterpreting Equity and CBDR-RC (Article 2.2)',
      7: 'Just Transition and Political Sustainability',
      8: 'Adaptation Finance, Resilience & Loss and Damage Governance (Articles 7, 8 & 9)',
      9: 'Climate Accountability, Domestic Codification & Litigation (Articles 4.2 & 13)',
      10: 'Multilateral Climate Governance & Implementation (Articles 4, 14 & 15) – Final Part',
    },
  },
];
