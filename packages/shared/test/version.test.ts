import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTRACT_VERSION } from '../src/index.js';

describe('CONTRACT_VERSION', () => {
  it('coincide con la versión de package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      version: string;
    };

    expect(CONTRACT_VERSION).toBe(pkg.version);
  });
});
