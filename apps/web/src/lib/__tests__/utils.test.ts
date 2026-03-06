import { cn } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles conditional classes', () => {
    const condition = false;
    expect(cn('base', condition && 'excluded', 'included')).toBe('base included');
  });
});
