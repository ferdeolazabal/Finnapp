# Trading AI Agent

Repositorio único con dos aplicaciones:

- `back/`: Node.js 22 + TypeScript estricto, dominio, Prisma, broker, riesgo, diario y OpenAI Agents SDK.
- `front/`: React + JavaScript + Vite + Material UI.

El MVP es un auditor: no predice precios, no opera dinero real y no contiene herramientas de órdenes. Los valores de `EXAMPLE_RISK_RULES` son ejemplos configurables, no recomendaciones financieras.

## Arquitectura y supuestos

Monolito modular con dominio puro, puertos y adaptadores. Dinero viaja como strings decimales y se calcula con `decimal.js`; todos los datos de mercado incluyen timestamp. Prisma/PostgreSQL persiste el diario. IOL quedará detrás de `BrokerProvider` y sólo usará sandbox. Se asumen cantidades enteras inicialmente y se rechazan datos vencidos, incompletos, órdenes de mercado y operaciones sin stop/target.

## Backlog MVP

1. Base de dominio, riesgo, mock broker y diario (incluida).
2. Repositorio Prisma, auditoría, correlation ID e idempotencia.
3. Cliente IOL sandbox con timeouts, retries limitados y tests contractuales.
4. Casos de uso/API REST para cartera, PnL, concentración y diario.
5. Ejecución auditada del agente y reportes; sin tools de órdenes.
6. Conectar las ocho secciones del dashboard.
7. Integración PostgreSQL/API y pruebas end-to-end.

## Desarrollo

Requiere Node.js 22, Docker y GNU Make (por ejemplo desde WSL, Git Bash o una instalación de Make para Windows).

```bash
make setup
make dev
```

`make dev` levanta PostgreSQL, el backend en `http://localhost:8089` y Vite en `http://localhost:5173`. El backend usa `nodemon` y reinicia al cambiar archivos TypeScript. Su estado puede comprobarse en `GET http://localhost:8089/health`.

Comandos útiles: `make back`, `make front`, `make db-up`, `make db-down`, `make test`, `make lint` y `make build`. `make env` crea `back/.env` desde el ejemplo sólo cuando todavía no existe.

Futuro documentado, no implementado: propuestas sin envío, paper trading sandbox, aprobación humana y automatización limitada con kill switch. El backtesting futuro contemplará costos, spread, slippage, dividendos, benchmark, fuera de muestra y sesgos look-ahead/survivorship; nunca será garantía de resultados.
