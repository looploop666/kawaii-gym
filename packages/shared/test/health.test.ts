import { describe, expect, it } from 'vitest';
import { HealthResponseSchema } from '../src/index.js';

describe('HealthResponseSchema', () => {
  it('acepta una respuesta válida', () => {
    const result = HealthResponseSchema.safeParse({ status: 'ok', db: 'up', version: '0.1.0' });

    expect(result.success).toBe(true);
  });

  it('rechaza un estado de base desconocido', () => {
    const result = HealthResponseSchema.safeParse({
      status: 'ok',
      db: 'maybe',
      version: '0.1.0',
    });

    expect(result.success).toBe(false);
  });

  it('rechaza una respuesta sin versión', () => {
    const result = HealthResponseSchema.safeParse({ status: 'ok', db: 'up' });

    expect(result.success).toBe(false);
  });
});
