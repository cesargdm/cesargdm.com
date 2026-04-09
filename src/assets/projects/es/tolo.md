---
title: TOLO
description: Plataforma full-stack para una cafetería de especialidad — desde integración con punto de venta y pedidos móviles hasta operaciones con IA, construida sobre el edge de Cloudflare.
date: 2025-09
url: https://tolo.cafe
highlight:
  logoUrl: 'https://www.tolo.cafe/icon.png'
  color: '#3D6039'
tags: [expo, stripe, mcp]
---

# TOLO

[TOLO](https://tolo.cafe) es una cafetería de especialidad con dos ubicaciones en el Valle de Toluca, México. Lo que comenzó como un proyecto de cafetería en septiembre de 2025 rápidamente evolucionó en la construcción de una plataforma digital completa para operar cada aspecto del negocio — desde operaciones de punto de venta y pedidos móviles hasta gestión empresarial asistida por IA.

La plataforma es un monorepo con Bun que contiene 6 aplicaciones y 4 paquetes compartidos, todo escrito en TypeScript y desplegado principalmente en la infraestructura edge de Cloudflare.

## Arquitectura de la Plataforma

El sistema se compone de seis aplicaciones interconectadas:

- **Expo App** — Aplicación móvil para clientes (iOS, Android, web) construida con Expo SDK 55, React Native y React 19. Maneja pedidos, monedero de lealtad, pagos con Stripe, notificaciones push y caché offline con MMKV. Internacionalizada con Lingui en 6 idiomas.
- **Workers API** — El backend principal, construido con Hono sobre Cloudflare Workers. Expone una API REST para autenticación (OTP + JWT), gestión de pedidos, sincronización con POS, flujos de pago con Stripe, mensajes masivos por WhatsApp y generación de pases para Apple/Google Wallet. Usa Drizzle ORM contra Neon PostgreSQL vía Cloudflare Hyperdrive para connection pooling.
- **Website** — Sitio de marketing y tienda construido con React Router 7 (SSR en Cloudflare Workers) y estilizado con Vanilla Extract. Renderiza contenido de Sanity CMS incluyendo blog, orígenes de café e información de ubicaciones.
- **Sanity Studio** — CMS headless para gestionar todo el contenido: posts del blog, productos, perfiles de granos de café con origen y notas de cata, eventos y promociones. Completamente localizado con bloques de contenido estructurado.
- **Servidor MCP** — Un servidor de Model Context Protocol desplegado en Cloudflare Durable Objects. Expone 12 categorías de herramientas que permiten a agentes de IA (como Claude) consultar datos de ventas, gestionar inventario, publicar en redes sociales, monitorear analíticas y operar el negocio mediante lenguaje natural. Esta es la capa que uso diariamente para gestionar las operaciones.
- **Plugin POS** — Una aplicación React embebida como iframe dentro del sistema Poster POS que usan los baristas. Extiende el punto de venta con funcionalidades específicas de TOLO.

## Sistemas Clave

### Sincronización con POS

La plataforma replica datos del sistema Poster POS hacia Neon PostgreSQL usando una estrategia de sincronización incremental por niveles. Cron triggers en Cloudflare Workers ejecutan tareas en segundo plano que sincronizan transacciones en diferentes horarios — los datos del día se refrescan frecuentemente, mientras que las agregaciones semanales y mensuales se ejecutan con menos frecuencia. Un enfoque basado en cursor rastrea la última transacción sincronizada para evitar reprocesamiento, y el estado de sincronización se persiste en la base de datos para confiabilidad entre deploys.

### Pagos y Lealtad

Los clientes pueden pagar con Stripe (tarjeta) o con un sistema de monedero electrónico con puntos de bonificación. La Workers API maneja el ciclo completo de PaymentIntent mediante webhooks de Stripe, incluyendo prevención de fraude y lógica de reintentos. Los miembros del programa de lealtad acumulan puntos en sus compras y pueden recibir bonos de cumpleaños mediante mensajes automatizados de WhatsApp. Los pases digitales (Apple Wallet y Google Pay) se generan del lado del servidor usando passkit-generator.

### Capa de Operaciones con IA (MCP)

El servidor MCP es posiblemente la pieza más interesante. Convierte todo el negocio en un conjunto de herramientas que agentes de IA pueden invocar: consultar la base de datos Neon para analíticas de ventas, gestionar el perfil de Google Business, moderar comentarios de Instagram, rastrear gasto en anuncios de TikTok, sincronizar con el CRM en Notion, e incluso colocar pedidos. El servidor se autentica vía OAuth 2.0 y separa el acceso a herramientas de nivel cliente y administrador. Corre sobre Cloudflare Durable Objects para manejo de sesiones con estado.

### Flujo de Pedidos en Línea

La app de Expo soporta pedidos en múltiples ubicaciones con modos para comer aquí y para llevar. Los clientes navegan un menú en tiempo real (sincronizado desde el POS), personalizan bebidas con modificadores, aplican códigos promocionales y pagan con Stripe o monedero electrónico. Los pedidos fluyen desde la app hacia la Workers API, que coordina la captura del pago, la creación del ticket en el POS y el envío de notificaciones push para confirmar la entrega.

## Infraestructura

Toda la plataforma corre en el edge de Cloudflare:

- **Cómputo**: Cloudflare Workers (API, SSR del sitio web, servidor MCP)
- **Base de datos**: Neon PostgreSQL con Cloudflare Hyperdrive (connection pooling)
- **Almacenamiento**: Cloudflare KV (sesiones, códigos OTP, caché de CMS), D1 (desarrollo local)
- **Servicios con estado**: Durable Objects (sesiones MCP)
- **Contenido**: Sanity CDN para imágenes y contenido estructurado
- **Observabilidad**: Sentry (rastreo de errores + check-ins de crons), PostHog (analíticas de producto en cliente y servidor)
- **CI/CD**: GitHub Actions con detección de cambios por ruta — cada app se despliega independientemente al hacer push a main

## Impacto en el Negocio

La plataforma actualmente opera las dos ubicaciones diariamente:

- **~1,400 pedidos/mes** procesados a través del pipeline de sincronización con POS
- **59 productos del menú** en 9 categorías gestionados en tiempo real entre POS y app
- **66% tarjeta / 34% efectivo** de distribución de pagos, con Stripe manejando todas las transacciones digitales
- **Programa de lealtad** con miembros activos, el cliente más comprometido con 77 pedidos
- **6 idiomas** soportados en la app móvil y el sitio web (español, inglés, alemán, francés, japonés, portugués)
- **12 categorías de herramientas MCP** habilitando operaciones AI-first — desde analíticas de ventas hasta gestión de redes sociales

La plataforma elimina la necesidad de herramientas separadas para analíticas, gestión de redes sociales, CRM y comunicación con clientes al consolidar todo en un solo sistema con una interfaz accesible por IA.
