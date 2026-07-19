# Trading AI Agent — reglas permanentes

## Prioridades

1. Seguridad, 2. exactitud, 3. trazabilidad, 4. tests, 5. simplicidad, 6. aprendizaje.

## Límites obligatorios

- El código determinista es la única autoridad para precios, PnL, comisiones, tamaño, stops, riesgo, exposición, límites, idempotencia y persistencia.
- La IA interpreta y propone; nunca inventa datos ni ejecuta órdenes.
- Todas las propuestas requieren aprobación humana. En el MVP no existen herramientas de órdenes.
- Usar sólo IOL sandbox durante desarrollo. Nunca persistir ni registrar secretos.
- Ante datos ausentes, vencidos, inconsistentes o errores externos, fallar de forma cerrada.
- No fijar reglas financieras definitivas: los defaults son ejemplos y deben estar marcados como configurables.
- Mantener una abstracción `BrokerProvider`; ningún caso de uso depende directamente de IOL.
- Evitar microservicios, modelos predictivos y abstracciones genéricas de ejecución.

## Convenciones técnicas

- Node.js 22, TypeScript estricto, Zod en fronteras, PostgreSQL y Prisma.
- Dinero y cantidades se representan como strings decimales en contratos persistidos/API; los cálculos usan `Decimal`.
- Timestamps en ISO-8601 UTC y datos de mercado siempre con `asOf`.
- Logs JSON con `correlationId`; no incluir tokens, credenciales ni prompts con datos sensibles.
- Toda mutación auditable debe incluir actor, timestamp, correlation ID e idempotency key cuando corresponda.
- Tests unitarios para dominio/riesgo y tests de contrato para adaptadores de broker.

## Verificación

- Ejecutar `npm run typecheck`, `npm test` y `npm run lint` antes de dar una tarea por terminada.
- No debilitar tipos o tests para hacer pasar la verificación.
- Documentar supuestos y cambios de reglas de riesgo en README.

