import { z } from 'zod';

// Un schema de Zod es un valor que se usa en runtime: `.parse()` valida datos desconocidos
// (un body, una respuesta de la API) y tira un error si no cumplen.
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  db: z.enum(['up', 'down']),
  version: z.string(),
});

// El tipo se deriva del schema, así que nunca se desincronizan: si cambia el schema,
// cambia el tipo y el compilador marca a cada consumidor que haya que actualizar.
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
