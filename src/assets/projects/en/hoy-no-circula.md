---
title: Hoy No Circula
description: A companion app for Mexico City's driving restriction — a pure rule engine shared by phone and edge, contingency status parsed from government press releases, and reminders that arrive the night before.
date: 2026-07
url: https://hoynocircula.cesargdm.com
highlight:
  logoUrl: 'https://hoynocircula.cesargdm.com/icon.png'
  color: '#FFAD00'
tags: [expo, react-native, cloudflare-workers, trpc, d1]
---

# Hoy No Circula

[Hoy No Circula](https://hoynocircula.cesargdm.com) answers one question for drivers in the Valley of Mexico: can my car go out today. The program behind that question is not one rule but a stack of them — a weekday tied to the last digit of your plate, a Saturday program tied to your emissions hologram, separate treatment for out-of-state plates, exemptions, and an environmental contingency that can rewrite all of it by the afternoon. The app is on the [App Store](https://apps.apple.com/mx/app/hoy-no-circula-mx/id6760785520) and [Google Play](https://play.google.com/store/apps/details?id=com.cesargdm.hoynocircula), and keeps one vehicle free.

## The rules are the product

The whole program lives in one 448-line file of pure functions with no side effects, shared by the app and the Worker so both can never disagree. It covers the parts other apps skip. Hologram 2 is off every Saturday; hologram 1 is off on the first and third Saturday for odd plates and the second and fourth for even ones, which means a fifth Saturday leaves every hologram 1 plate free. Foreign plates are restricted every Saturday regardless of hologram, and on the weekdays their digit is _not_ restricted they still carry a morning-only window of 05:00–11:00. Disabled and antique plates are exempt even during a contingency, and so is hologram E — the electric and hybrid exemption that survives every phase.

That coverage came from reading the competition's one-star reviews before writing any of it. The recurring complaints were a driver who couldn't register a disabled plate, another who couldn't register an antique one, and a calendar that disagreed with reality often enough to need a second app to check it. The engine is backed by 137 cases in a single test file, which is the first thing to run when a rule changes.

## A contingency arrives as a press release

There is no API for environmental contingencies. There is a government press archive, so an hourly Worker cron reads it. The listing page renders its articles through jQuery `.append()` calls with escaped JavaScript strings, so the HTML has to be unescaped before it can be parsed at all. Each new notice is then classified by `gpt-4o-mini` into a phase — none, preventive, phase 1, phase 2 — plus the dates it applies to.

The dates are the hard part. A release published at 4pm announcing "Doble Hoy No Circula para mañana" is about tomorrow, so relative dates resolve against the publication date and never against today. Notices are processed oldest-first, so when an afternoon activation and an evening lift both touch the same day, the later one wins. And a failed classification is skipped without recording history, so the next run retries it: an unparseable response means _no information_, never "the contingency was lifted". Unrecognized phases fall back to base rules for the same reason.

## A cache that knows how far ahead it can see

Responses are cached at the edge on a horizon rather than a fixed TTL. A date already in the past can never change, so it is served `immutable` for a year. Anything within 72 hours of now can flip on a contingency, so it gets five minutes. Everything further out is cached exactly until it enters that 72-hour window — a query for a date three months away is good for nearly three months. Contingency endpoints get five minutes too, but clipped to the seconds remaining until midnight in Mexico City, so a cached answer can never outlive the service day it describes.

## The phone doesn't need the network

Vehicles live in expo-sqlite and contingency status is cached locally, so the app works with no signal — the Worker is the source of truth, not a dependency. A background task polls hourly for contingency changes, and notifications are scheduled locally a week ahead rather than pushed.

The default reminder fires at 20:00, and evening reminders describe _tomorrow_. That is a direct answer to a complaint about a competitor: its notification arrived at 7am, when the restriction had already been in force since five and the driver was on the road. A restriction you learn about the night before is a decision; one you learn about on the way to work is a fine. Verification reminders run on the same machinery — each plate digit has two verification periods a year, two months each, and the reminder respects a verification already logged inside the current period by moving to the next one.

## Small things that only show up in Mexico City

Two timezone traps shaped the code. `new Date('YYYY-MM-DD')` is UTC midnight, which is the previous evening locally, so a verification logged on the first of the month would fall outside its own period unless the date is parsed as a local calendar day. And the contingency day boundary is Mexico City's, not the Worker's, so every date the cron writes is resolved in CDMX time before it touches the database.

The iOS widget is built with expo-widgets, and its layout DSL has no conditionals — so the medium and large families always render three vehicle rows and blank the unused ones with empty strings. It scales all the way down to the lock-screen circular family, where the whole answer has to fit in a checkmark and a plate.
