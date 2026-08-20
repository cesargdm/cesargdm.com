---
title: Bichos ID
description: Identifica artrópodos a partir de una foto — una app de Expo y una app web de Next.js sobre el mismo código, con un endpoint de visión de OpenAI detrás.
date: 2024
url: https://bichos-id.fucesa.com
repository:
  url: https://github.com/cesargdm/bichos-id
tags: [expo, react-native, nextjs, openai, postgres]
---

# Bichos ID

[Bichos ID](https://bichos-id.fucesa.com) identifica artrópodos — insectos, arañas y sus parientes — a partir de una foto, y te dice si el que tienes enfrente es venenoso. Existe como app nativa en la [App Store](https://apps.apple.com/app/bichos-id/id6689492259) y la [Play Store](https://play.google.com/store/apps/details?id=com.fucesa.bichos_id), y como app web, ambas construidas desde el mismo código.

## Un código, tres destinos

El repositorio es un monorepo con Bun y Turborepo: dos aplicaciones sobre un paquete compartido.

- **`apps/expo`** — la app nativa, Expo SDK 57 sobre React Native 0.86, con Vision Camera para la captura y Expo Image Picker para fotos existentes. Firebase se encarga de autenticación, analíticas y App Check; Sentry del reporte de errores; Expo Updates entrega JavaScript por aire.
- **`apps/next`** — la app web y la API, en Next.js 16. Renderiza las mismas pantallas a través de `react-native-web` vía `@expo/next-adapter`, y aloja las rutas `/api/v1` que ambos clientes consumen.
- **`packages/app`** — las pantallas, la navegación, el cliente de API y los tipos que ambas comparten, con variantes `.web.tsx` donde la plataforma realmente diverge.

Compartir pantallas entre React Native y web significa que el feed de exploración y las páginas de organismos se escriben una sola vez. La build web es la que se rastrea, así que cada organismo identificado tiene una página indexable real en lugar de vivir únicamente dentro de la app.

## Identificación

La identificación ocurre en el servidor, en `apps/next/app/api/v1/ai/vision/route.ts`. El cliente envía una imagen en base64; la ruta verifica el token de Firebase de quien llama y manda la foto a un modelo de visión de OpenAI con un prompt de entomólogo y un esquema de respuesta con Zod, de modo que el modelo devuelve una taxonomía ya parseada — filo, clase, orden, familia, género, especie — más un nombre común, en vez de prosa que habría que interpretar.

Dos detalles lo vuelven lo bastante barato como para sostenerlo:

- **El prompt pide una calificación de calidad de imagen.** El modelo evalúa composición, iluminación y nitidez del 0 al 10 junto con la identificación. Esa calificación es la que decide si una foto nueva reemplaza a la guardada para una especie, así que la galería mejora conforme la gente sube mejores tomas.
- **La descripción cara se genera una sola vez.** La llamada de taxonomía corre en cada escaneo, pero la descripción larga, el hábitat y la clasificación de veneno solo se piden la primera vez que se ve una especie, y luego se guardan en Postgres. Cada escaneo posterior del mismo organismo es una sola llamada de visión.

Los escaneos se deduplican por SHA-256 de la imagen antes de escribir nada, así que volver a subir la misma foto no la vuelve a almacenar.

## Almacenamiento e indexación

Los datos viven en Neon Postgres, consultados con Kysely; las imágenes van a Cloudflare R2 mediante el cliente de S3, con una llave formada por la ruta taxonómica y el hash del contenido, y se sirven como inmutables.

La restricción interesante es qué cuenta como una página que valga la pena indexar. Un escaneo que solo llega hasta la familia — sin género, sin especie — produce un fragmento con un slug terminado en guion y nada que leer, justo el tipo de página que Search Console archiva como "Rastreada: actualmente sin indexar". Por eso un organismo es indexable únicamente cuando tiene nombre común, descripción _y_ clasificación a nivel especie; lo que no llegue a eso se marca `noindex` y se queda fuera del sitemap. Esa regla está escrita dos veces, una en TypeScript y otra como predicado SQL, para que el sitemap pueda filtrar sin traerse todas las descripciones por la red.

Cuando está disponible, la geolocalización de la petición entra al prompt: país y región reducen de forma significativa qué especies son plausibles.

## Por qué existe

El problema interesante aquí nunca fue el modelo. Fue todo lo que lo rodea: mantener asequible una llamada de IA por foto, convertir una respuesta probabilística en una llave estable de base de datos, y decidir cuáles de las páginas resultantes son lo bastante sustanciales como para merecer una URL.
