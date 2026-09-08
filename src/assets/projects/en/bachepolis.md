---
title: Bachepolis
description: A Moon Patrol-style arcade game about driving a red Tsuru through Toluca's potholes — 2D Three.js geometry, a fixed-step engine, and an AI agent that wrote and tested it.
date: 2026-09
url: https://bachepolis.cesargdm.com
tags: [expo, react-native, three.js, webgl, cloudflare-workers]
---

# Bachepolis

[Bachepolis](https://bachepolis.cesargdm.com) is an arcade game about the ordinary act of driving across Toluca. You steer a red Tsuru down one endless road, jump potholes and uncovered drains, and shoot the oversized topes you can't clear. The joke writes itself: the trip is close enough to _Moon Patrol_ that the 1982 game works as the template with almost nothing changed. Craters become baches, moon rocks become topes, and the lunar surface becomes Paseo Tollocan.

The road cycles through four real avenues — Tollocan, Las Torres, Tecnológico, Hidalgo — and then loops back to Tollocan without stopping. Each has its own palette, hazard vocabulary and deadpan subtitle: Tecnológico is filed under _ingeniería de suspensión_, and its warning reads "ese tope tiene código postal."

## Damage instead of lives

Most endless runners give you three lives and take one per hit. Here the three hits are three states of the same car. The first breaks the suspension and drops the body onto its springs. The second flattens a front tyre, which then smokes until it's fixed. The third flattens the other one and ends the run. You keep driving, jumping and firing through all of it — a Tsuru with one flat tyre is still, culturally speaking, a working car.

That turns repair into the economy. Coins float above the road and are worth 25 points each. Every so often a vulcanizadora goes by, and passing it _without jumping_ spends six coins on a repair — the price climbing by three each time, because the second visit is never the same price as the first. The game-over screen is a workshop receipt: obstacles cleared, topes destroyed, coins collected, suspension and tyre hits, repairs, money spent, best streak, near misses, and a rotating challenge. It signs off with a warranty good "hasta el siguiente bache."

## A simulation the renderer can't touch

The engine is 226 lines and knows nothing about drawing. It advances on a fixed step, takes its random number generator as a constructor argument, and exposes state plus an event stream. Everything else subscribes.

That separation is what makes the game testable, and the tests are the interesting part. They run twenty seeded campaigns to prove every hazard sequence is solvable by jumping alone, replay the widest holes at minimum spacing at 20, 24, 30 and 60 frames per second to prove the physics don't depend on frame rate, and assert that hazards and projectiles stay bounded no matter how long a run goes.

Hazards themselves aren't random. Each avenue has a handful of short authored phrases — `patchwork`, `missing-covers`, `jump-or-shoot`, `last-block` — and the engine picks one, plays it out, then leaves a deliberate recovery stretch before the next. Randomness sits in the choice and in pothole widths, not in the rhythm. Weather runs on its own schedule, ignoring hazards entirely: rain starts at 24 seconds and grows longer and more frequent per avenue, and daylight slides into night on a distance curve, where headlights and a dozen periodically-dying streetlamps carry the scene.

## Everything is drawn, nothing is loaded

There are no textures, sprites or models at runtime. `scene.ts` builds all 620 lines of the world out of flat Three.js geometry under an orthographic camera: the Tsuru, its rotating wheels and suspension travel, the parallax city, the shallow dirt cutaway under the road with its sparse bones and water pockets, and the Nevado de Toluca on the far layer. Landmarks appear as stylized cameos behind the ordinary buildings — Torres Bicentenario, the Cathedral and Los Portales, the Cosmovitral, Teatro Morelos, the Nemesio Díez. It's a compressed panorama, not a street map; a Blender Tsuru exists in the repository as a shape reference and never ships.

The audio is generated the same way. A 24-line Python script synthesizes every sound — jump, land, hit, fire, destroy, engine loop, and a 32-note melody — straight into WAV files. No samples, no licensing.

Getting that to run on a phone was the real work. Expo GL needs `gl.flush()` before presenting or the frame never appears, and measuring performance is its own trap: `gl.finish` is itself queued, so an early 60 FPS reading was command submission rate, not displayed frames. Fencing JavaScript with a blocking `gl.getParameter` after it revealed the honest number, and the fix was to disable Three's color management for flat display-RGB art and render into a bounded 540-pixel target.

## Written by an agent, on the record

The game was built end to end by an AI coding agent, and the repository is organized around keeping that honest. A product requirements document holds the confirmed decisions and marks everything else as proposed. A memory file carries the constraints a fresh session couldn't re-derive. A validation file separates what was actually observed from what was only assumed — which is where that fake 60 FPS number went to die, alongside an explicit note that Android gameplay and physical-device performance remain unverified.

Verification ran through the same tooling: an agent driving an iOS simulator and a browser through device automation, playing full campaigns, taking screenshots and reading back frame rates. The result ships as an Expo web export on Cloudflare Workers, which is why a game written for phones opens instantly in a browser tab.
