import { lazy } from 'react';
import { createBrowserRouter, createHashRouter, createMemoryRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { routerMode } from '@/lib/utils';
import HomePage from '@/pages/HomePage';

// Route-level code splitting: each page is its own chunk.
const AboutPage = lazy(() => import('@/pages/about/AboutPage'));
const HistoryPage = lazy(() => import('@/pages/about/HistoryPage'));
const ResourcePage = lazy(() => import('@/pages/ResourcePage'));
const DomainsPage = lazy(() => import('@/pages/work/DomainsPage'));
const DomainDetailPage = lazy(() => import('@/pages/work/DomainDetailPage'));
const LexCommonsPage = lazy(() => import('@/pages/work/LexCommonsPage'));
const TrainingPage = lazy(() => import('@/pages/work/TrainingPage'));
const AdvisoryPage = lazy(() => import('@/pages/work/AdvisoryPage'));
const ProgramsPage = lazy(() => import('@/pages/work/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('@/pages/work/ProgramDetailPage'));
const PublicationsPage = lazy(() => import('@/pages/publications/PublicationsPage'));
const SeriesPage = lazy(() => import('@/pages/publications/SeriesPage'));
const ArticlePage = lazy(() => import('@/pages/publications/ArticlePage'));
const ReviewPage = lazy(() => import('@/pages/publications/ReviewPage'));
const PeoplePage = lazy(() => import('@/pages/people/PeoplePage'));
const PersonPage = lazy(() => import('@/pages/people/PersonPage'));
const VolunteerPage = lazy(() => import('@/pages/involved/VolunteerPage'));
const PartnerPage = lazy(() => import('@/pages/involved/PartnerPage'));
const DonatePage = lazy(() => import('@/pages/involved/DonatePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'about/history', element: <HistoryPage /> },
      { path: 'about/sustainability-at-cgsl', element: <ResourcePage pageKey="sustainability" /> },
      { path: 'about/annual-reports', element: <ResourcePage pageKey="annualReports" /> },
      { path: 'about/financials', element: <ResourcePage pageKey="financials" /> },
      { path: 'domains', element: <DomainsPage /> },
      { path: 'domains/:slug', element: <DomainDetailPage /> },
      { path: 'lex-commons', element: <LexCommonsPage /> },
      { path: 'training', element: <TrainingPage /> },
      { path: 'advisory', element: <AdvisoryPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/:slug', element: <ProgramDetailPage /> },
      { path: 'publications', element: <PublicationsPage /> },
      { path: 'publications/digest', element: <SeriesPage series="digest" /> },
      { path: 'publications/trove', element: <SeriesPage series="trove" /> },
      { path: 'publications/:series/:slug', element: <ArticlePage /> },
      { path: 'publications/review', element: <ReviewPage /> },
      { path: 'publications/case-studies', element: <ResourcePage pageKey="caseStudies" /> },
      { path: 'publications/white-papers', element: <ResourcePage pageKey="whitePapers" /> },
      { path: 'publications/proposals', element: <ResourcePage pageKey="proposals" /> },
      { path: 'people', element: <PeoplePage /> },
      { path: 'people/:slug', element: <PersonPage /> },
      { path: 'get-involved/volunteer', element: <VolunteerPage /> },
      { path: 'get-involved/partner', element: <PartnerPage /> },
      { path: 'donate', element: <DonatePage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

const factories = { hash: createHashRouter, memory: createMemoryRouter, browser: createBrowserRouter };
export const router = factories[routerMode](routes);
