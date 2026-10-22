/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `hash` for static/sub-path hosting, `memory` for embedded previews; defaults to browser history routing. */
  readonly VITE_ROUTER?: 'hash' | 'memory' | 'browser';
  /** `true` in the embedded demo build: forms confirm locally instead of sending. */
  readonly VITE_DEMO?: string;
  /** Optional endpoint that receives form submissions as JSON (Formspree, serverless function, CRM…). */
  readonly VITE_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
