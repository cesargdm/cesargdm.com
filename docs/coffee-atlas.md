# Coffee Atlas maintenance

The data lives in `src/lib/coffee/data.ts`. Add reviewed facts, not entire source catalogs. Keep stable IDs: shared URLs depend on them. Every factual claim has evidence status and a source; unknown values use null and an unknown status. Relationships require their own citations. Never turn genetic-group membership into a parent edge, or a genebank accession into a cultivar automatically. Keep translations together for data and use Lingui for interface copy.

Expanded review: 2026-09-16. 113 entries from WCR profiles and IAC's cultivar listings. This edition does not cover Liberica, most regional selections or emerging trade names. Publication dates are absent from reviewed web profiles and remain null, distinct from review dates. Origins are documented discovery/selection countries; ambiguous histories stay unknown. Featured flags are editorial, not measures of importance or prevalence.

Source reuse review: WCR publishes its catalog under CC BY-NC-ND 4.0 (see catalog PDF licensing). This project does not redistribute its catalog, photographs, illustrations, descriptions or diagrams. Profiles contain brief independently worded factual statements and direct citations. IAC listings are referenced for cultivar identifiers and basic release facts; no IAC descriptions or images are reproduced. Review permissions separately before adding copied media or bulk imported text.

For updates: verify the primary source, add/update the claim and citation, preserve disagreements with an explicit evidence status, update review dates and REVISION, translate both languages, and adjust coverage copy/counts. Run the coffee tests, i18n check and full CI checks. Do not update review dates just because a page responded successfully. Suggestions link to the repository issue composer; nothing is submitted automatically.

## Project Environment

Argent environment inspection (2026-09-16): `is_react_native: false`, `is_native_ios: false`, `is_native_android: false`. Astro 7 + React 19 on Cloudflare Workers. Bun commands: dev, build, preview, test, format:check, lint, typecheck, i18n:check. Browser QA uses Argent with a Chromium CDP target; Safari in a booted simulator can exercise touch. No mobile app build or Metro is required.

## Visualization

Original radial SVG layout inspired by the species hubs, perimeter nodes and family colors in [WCR’s varieties poster](https://worldcoffeeresearch.org/resources/coffee-varieties-poster). The poster artwork is not embedded or adapted. D3 handles zoom, pan and node dragging. Dots are curated records with radii based on documented outgoing relationships, shaded clusters indicate genetic groups, and only cited parent/mutation/selection relationships produce arrows. Mobile uses the same circles with stacked species hubs; no decorative or inferred records are added to make the graph denser.

The expanded edition adds 93 individually reviewed WCR profiles and three named breeding parents, alongside the original IAC entries. The two Timor accessions are explicitly labeled selections, not silently promoted to commercial cultivars. Pedigree selections use a separate edge type. Composite pedigrees, unknown parents, and cross-pollination partners are not turned into direct-parent edges. The committed additions contain original bilingual factual notes; raw fetched source pages are not distributed.
