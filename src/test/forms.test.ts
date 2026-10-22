import { describe, expect, it } from 'vitest';
import { isEmail } from '@/lib/forms';

describe('isEmail', () => {
  it.each([
    ['info@cgsul.org', true],
    ['first.last@sub.example.co', true],
    ['not-an-email', false],
    ['a@b', false],
    ['', false],
  ])('%s -> %s', (value, expected) => expect(isEmail(value)).toBe(expected));
});
