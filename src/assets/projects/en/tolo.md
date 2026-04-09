---
title: TOLO
description: Full-stack platform powering a specialty coffee shop — from POS integration and mobile ordering to AI-driven operations, built on Cloudflare's edge.
date: 2025-09
url: https://tolo.cafe
highlight:
  logoUrl: 'https://www.tolo.cafe/icon.png'
  color: '#3D6039'
tags: [expo, stripe, mcp]
---

# TOLO

[TOLO](https://tolo.cafe) is a specialty coffee shop with two locations in the Toluca Valley, Mexico. What started as a cafe project in September 2025 quickly evolved into building a complete digital platform to power every aspect of the business — from point-of-sale operations and mobile ordering to AI-assisted business management.

The platform is a Bun monorepo with 6 applications and 4 shared packages, all written in TypeScript and deployed primarily on Cloudflare's edge infrastructure.

## Platform Architecture

The system is composed of six interconnected applications:

- **Expo App** — Customer-facing mobile application (iOS, Android, web) built with Expo SDK 55, React Native, and React 19. Handles ordering, loyalty wallet, Stripe payments, push notifications, and offline caching via MMKV. Internationalized with Lingui across 6 languages.
- **Workers API** — The core backend, built with Hono running on Cloudflare Workers. Exposes a RESTful API for authentication (OTP + JWT), order management, POS synchronization, Stripe payment flows, WhatsApp broadcast messaging, and Apple/Google wallet pass generation. Uses Drizzle ORM against Neon PostgreSQL via Cloudflare Hyperdrive for connection pooling.
- **Website** — Marketing site and storefront built with React Router 7 (SSR on Cloudflare Workers) and styled with Vanilla Extract. Renders content from Sanity CMS including blog posts, coffee origins, and location information.
- **Sanity Studio** — Headless CMS for managing all content: blog posts, product listings, coffee bean profiles with origin and tasting notes, events, and promotions. Fully localized with structured content blocks.
- **MCP Server** — A Model Context Protocol server deployed on Cloudflare Durable Objects. Exposes 12 tool categories that allow AI agents (like Claude) to query sales data, manage inventory, post to social media, monitor analytics, and operate the business through natural language. This is the layer that powers all the TOLO tools I use daily to run operations.
- **POS Plugin** — A React application embedded as an iframe inside the Poster POS system used by baristas. Extends the point-of-sale with TOLO-specific features and staff-facing overlays.

## Key Systems

### POS Synchronization

The platform mirrors data from the Poster POS system into Neon PostgreSQL using a tiered incremental sync strategy. Cloudflare Workers cron triggers run background jobs that sync transactions on different schedules — today's data refreshes frequently, while weekly and monthly aggregations run less often. A cursor-based approach tracks the last synced transaction to avoid re-processing, and the sync state is persisted in the database for reliability across deploys.

### Payments & Loyalty

Customers can pay via Stripe (card) or an e-wallet system with bonus points. The Workers API handles the full PaymentIntent lifecycle through Stripe webhooks, including fraud prevention and retry logic. Loyalty members accumulate points on purchases and can receive birthday bonuses via automated WhatsApp messages. Digital wallet passes (Apple Wallet and Google Pay) are generated server-side using passkit-generator.

### AI Operations Layer (MCP)

The MCP server is arguably the most interesting piece. It turns the entire business into a set of tools that AI agents can invoke: querying the Neon database for sales analytics, managing Google Business Profile listings, moderating Instagram comments, tracking TikTok ad spend, syncing with Notion CRM, and even placing orders. The server authenticates via OAuth 2.0 and separates customer-level from admin-level tool access. It runs on Cloudflare Durable Objects for stateful session management.

### Online Ordering Flow

The Expo app supports multi-location ordering with dine-in and takeout modes. Customers browse a real-time menu (synced from POS), customize drinks with modifiers, apply promo codes, and pay via Stripe or e-wallet. Orders flow from the app to the Workers API, which coordinates payment capture, POS ticket creation, and push notification delivery to confirm fulfillment.

## Infrastructure

The entire platform runs on Cloudflare's edge:

- **Compute**: Cloudflare Workers (API, website SSR, MCP server)
- **Database**: Neon PostgreSQL with Cloudflare Hyperdrive (connection pooling)
- **Storage**: Cloudflare KV (sessions, OTP codes, CMS cache), D1 (local dev)
- **Stateful Services**: Durable Objects (MCP sessions)
- **Content**: Sanity CDN for images and structured content
- **Observability**: Sentry (error tracking + cron check-ins), PostHog (product analytics on both client and server)
- **CI/CD**: GitHub Actions with path-based change detection — each app deploys independently on push to main

## Business Impact

The platform currently powers daily operations across two locations:

- **~1,400 orders/month** processed through the POS sync pipeline
- **59 menu items** across 9 categories managed in real-time between POS and app
- **66% card / 34% cash** payment split, with Stripe handling all digital transactions
- **Loyalty program** with active members, the most engaged customer placing 77 orders
- **6-language** support across the mobile app and website (Spanish, English, German, French, Japanese, Portuguese)
- **12 MCP tool categories** enabling AI-first business operations — from sales analytics to social media management

The platform eliminates the need for separate tools for analytics, social media management, CRM, and customer communications by consolidating everything into a single system with an AI-accessible interface.
