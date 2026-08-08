# Trading AI Agent — contexto de traspaso

Este documento permite continuar el proyecto en otra computadora sin depender del historial local de Codex. No contiene secretos ni reemplaza `AGENTS.md`.

## Visión del producto

Trading AI Agent será un auditor y asistente personal para aprender trading, analizar una cartera, controlar riesgos, registrar decisiones y mejorar disciplina. El MVP no predice mágicamente el mercado, no ejecuta órdenes y no opera dinero real.

La aplicación debe seguir siendo útil sin conectar una cuenta: podrá analizar datos de mercado y señalar oportunidades para observación, swing trading o largo plazo. Toda señal deberá explicar evidencia, riesgos, condiciones de invalidación, vigencia de los datos y requerir aprobación humana.

## Decisiones permanentes

- Repositorio único con `back/` y `front/`.
- Backend: Node.js 22, TypeScript estricto, Prisma/PostgreSQL, Zod, Pino y OpenAI Agents SDK.
- Frontend: React con JavaScript, Vite y Material UI.
- Arquitectura inicial: monolito modular con dominio, puertos y adaptadores; sin microservicios.
- `BrokerProvider` desacopla los casos de uso de IOL.
- Los cálculos financieros y controles de riesgo son deterministas; la IA sólo interpreta y propone.
- Dinero y cantidades viajan como strings decimales; los cálculos usan `decimal.js`.
- Todo dato de mercado lleva timestamp `asOf` y se rechazan datos incompletos o vencidos.
- No existen herramientas de órdenes en el MVP.
- Las reglas de riesgo incluidas son ejemplos configurables, no recomendaciones financieras.
- Desarrollo exclusivamente con IOL sandbox. La producción queda bloqueada deliberadamente.

Las reglas completas están en `AGENTS.md` y deben leerse antes de modificar código.

## Estado implementado

- Estructura raíz, Makefile, Docker Compose y documentación.
- Backend HTTP en el puerto `8089`, con `GET /health` y `correlationId`.
- Frontend Vite en el puerto `5173`, con las ocho secciones iniciales del dashboard.
- Modelos de mercado, análisis de operación y diario.
- Interfaz `BrokerProvider` y `MockBrokerProvider`.
- Motor determinista de riesgo.
- Cálculos de PnL, tamaño de posición y riesgo-beneficio.
- Diario de trading en memoria y esquema inicial de Prisma.
- Herramientas tipadas iniciales del agente, sin ejecución de órdenes.
- Validación de entorno con Zod.
- Tests de cálculos, riesgo, broker mock, diario y configuración.
- npm es el package manager oficial; existen `package-lock.json` en ambas aplicaciones.

## Estado aún no implementado

- `IolBrokerProvider` y autenticación real contra sandbox.
- Renovación y almacenamiento seguro de bearer/refresh token.
- Repositorios Prisma activos y migraciones aplicadas.
- API REST de cartera, PnL, concentración, riesgo y diario.
- Logging de cada request HTTP y de llamadas salientes sanitizadas.
- Conexión del dashboard con el backend.
- Ejecución auditada del agente con OpenAI.
- Paper trading, aprobación de órdenes y cualquier automatización.

## IOL: hallazgos y límites

- La documentación pública de `https://api.invertironline.com` advierte que ese host corresponde al entorno real.
- El sandbox es una cuenta aislada y no está relacionado con el usuario ni la cartera real de IOL.
- No se debe inventar la URL del sandbox. Hay que solicitar a IOL la URL base oficial, credenciales exclusivas y confirmación de rutas API v2.
- La autenticación documentada usa `POST /token` con body `application/x-www-form-urlencoded`: `username`, `password` y `grant_type=password`.
- El bearer token informado dura 15 minutos y se renueva en `/token` con `refresh_token` y `grant_type=refresh_token`.
- IOL informó al usuario un límite gratuito de 25.000 llamadas mensuales. El diseño debe usar caché, consultas batch y polling adaptativo.
- En Postman, usuario, contraseña y tokens deben guardarse en Local Vault; nunca en el repositorio ni en capturas.
- Endpoints v2 de lectura identificados para validar luego contra el sandbox: estado de cuenta, portafolio, operaciones existentes, cotizaciones e históricos.
- Durante el MVP no se deben invocar endpoints POST/DELETE de órdenes.

## TradingView y otros datos

- TradingView no ofrece una API pública general para extraer sus cotizaciones o indicadores al backend.
- Sus bibliotecas de gráficos requieren que la aplicación aporte el proveedor de datos.
- Los widgets pueden mostrar datos dentro del iframe, pero no deben usarse como fuente de cálculos.
- A futuro, TradingView puede actuar como `SignalProvider` mediante alertas/webhooks. Toda alerta debe revalidarse con el proveedor de mercado antes de generar una propuesta.
- No usar scraping ni endpoints internos no documentados de TradingView, Yahoo Finance o Google Finance.

## Entorno de desarrollo conocido

El flujo usado fue Windows + WSL:

- GNU Make 4.2.1.
- Node.js 22.23.0.
- npm 10.9.8.
- Docker Compose 5.3.0 mediante Docker Desktop y su integración con WSL.
- Backend y Vite se ejecutan dentro de WSL; el navegador se abre en Windows.
- PostgreSQL es actualmente el único servicio ejecutado en Docker.
- Lazydocker muestra PostgreSQL, pero no backend ni frontend mientras estos no estén contenerizados.

Comandos principales:

```bash
make setup   # crea back/.env si falta, instala dependencias y levanta PostgreSQL
make dev     # levanta PostgreSQL, backend y frontend
make back
make front
make db-up
make db-down
make test
make lint
make build
```

URLs locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8089`
- Health: `http://localhost:8089/health`

## Arranque en una computadora nueva

1. Instalar Docker Desktop y habilitar la integración de la distribución WSL.
2. Instalar Node.js 22, npm y GNU Make dentro de WSL.
3. Copiar o clonar el repositorio sin `node_modules`, `dist` ni archivos `.env`.
4. Desde la raíz del proyecto, ejecutar `make setup`.
5. Mantener `IOL_ENABLED=false` hasta contar con el adaptador y las credenciales oficiales del sandbox.
6. Ejecutar `make dev` y validar las tres URLs locales.
7. Ejecutar typecheck, tests y lint antes de continuar cambios.

No ejecutar `npm audit fix --force` sin revisar cada actualización: puede introducir cambios incompatibles.

## Próximo paso recomendado

Implementar observabilidad HTTP antes de conectar IOL:

1. Logging estructurado de request/response con método, ruta, status, duración y `correlationId`.
2. Sin bodies, tokens ni credenciales en los logs.
3. Tests del logger y del endpoint `/health`.
4. Luego implementar `IolBrokerProvider` exclusivamente para lectura contra sandbox, con autenticación, timeouts, retries limitados, Zod y mocks contractuales.

## Prompt para retomar en la nueva PC

> Leé completamente `AGENTS.md`, `README.md` y `PROJECT_CONTEXT.md`. Inspeccioná el repositorio y verificá el estado real antes de cambiar código. Continuá desde “Próximo paso recomendado”. No uses credenciales reales, no habilites órdenes y no supongas la URL del sandbox de IOL.
