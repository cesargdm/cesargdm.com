---
title: Bichos ID
description: Identify arthropods from a photo — an Expo app and a Next.js web app sharing one codebase, backed by an OpenAI vision endpoint.
date: 2024
url: https://bichos-id.fucesa.com
repository:
  url: https://github.com/cesargdm/bichos-id
tags: [expo, react-native, nextjs, openai, postgres]
---

# Bichos ID

[Bichos ID](https://bichos-id.fucesa.com) identifies arthropods — insects, spiders and their relatives — from a photo, and tells you whether the one in front of you is venomous. It ships as a native app on the [App Store](https://apps.apple.com/app/bichos-id/id6689492259) and [Play Store](https://play.google.com/store/apps/details?id=com.fucesa.bichos_id), and as a web app, both built from the same source.

## One codebase, three targets

The repository is a Bun and Turborepo monorepo with two apps over one shared package:

- **`apps/expo`** — the native app, Expo SDK 57 on React Native 0.86, using Vision Camera for capture and Expo Image Picker for existing photos. Firebase handles auth, analytics and App Check; Sentry handles crash reporting; Expo Updates ships JS over the air.
- **`apps/next`** — the web app and the API, Next.js 16. It renders the same screens through `react-native-web` via `@expo/next-adapter`, and hosts the `/api/v1` routes both clients call.
- **`packages/app`** — the screens, navigation, API client and types shared by both, with `.web.tsx` variants where a platform genuinely diverges.

Sharing screens across React Native and the web means the explore feed and organism pages are written once. The web build is what gets crawled, so each identified organism has a real indexable page rather than living only inside the app.

## Identification

Identification happens server-side, in `apps/next/app/api/v1/ai/vision/route.ts`. The client posts a base64 image; the route verifies the caller's Firebase ID token, then sends the photo to an OpenAI vision model with an entomologist system prompt and a Zod response schema, so the model returns a parsed taxonomy — phylum, class, order, family, genus, species — plus a common name, rather than prose to be scraped.

Two details make it cheap enough to run:

- **The prompt asks for an image quality rating.** The model scores composition, lighting and sharpness from 0 to 10 alongside the identification. That rating is what decides whether a new photo replaces the stored one for a species, so the gallery improves as people submit better shots.
- **The expensive description is generated once.** The taxonomy call runs per scan, but the long description, habitat and venom classification are only requested the first time a species is seen, then cached in Postgres. Every later scan of the same organism is one vision call.

Scans are deduplicated by SHA-256 of the image before anything is written, so re-uploading the same photo doesn't re-store it.

## Storage and indexing

Data lives in Neon Postgres, queried with Kysely; images go to Cloudflare R2 through the S3 client, keyed by taxonomy path and content hash, and served immutable.

The interesting constraint is what counts as a page worth indexing. A scan that only resolves to a family — no genus, no species — produces a stub with a trailing-dash slug and nothing to read, exactly the kind of page Search Console files under "Crawled — currently not indexed". So an organism is indexable only when it has a common name, a description _and_ a species-level classification; anything short of that is marked `noindex` and kept out of the sitemap. That rule is written twice, once in TypeScript and once as a SQL predicate, so the sitemap can filter without pulling every description across the wire.

Geolocation from the request is passed into the prompt when available — country and region meaningfully narrow which species are plausible.

## Why it exists

The interesting problem here was never the model. It was everything around it: keeping a per-photo AI call affordable, turning a probabilistic answer into a stable database key, and deciding which of the resulting pages are substantial enough to deserve a URL.
