import { afterEach, describe, expect, it, vi } from 'vitest';
import { isEmail, submitForm } from '@/lib/forms';

describe('isEmail', () => {
  it.each([
    ['info@cgsul.org', true],
    ['first.last@sub.example.co', true],
    ['not-an-email', false],
    ['a@b', false],
    ['', false],
  ])('%s -> %s', (value, expected) => expect(isEmail(value)).toBe(expected));
});

describe('submitForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('addresses submissions to info@cgsul.org when no endpoint is configured', async () => {
    const location = { href: '' };
    vi.stubGlobal('location', location);
    const res = await submitForm('contact', { name: 'Ada', email: 'ada@example.com', subject: 'Hello' });
    expect(res.via).toBe('mailto');
    expect(location.href).toMatch(/^mailto:info@cgsul\.org\?subject=Website%20enquiry%3A%20Hello&body=/);
  });
});
