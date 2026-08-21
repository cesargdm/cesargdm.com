/**
 * Every tunable in the mosaic engine, in one place.
 *
 * Gathered here so the engine's behaviour can be read and adjusted without
 * hunting through the draw and match loops for a literal.
 */

/** Edge length of one tile in the atlas, in pixels. */
export const TILE_PX = 96

/** Atlas page edge. 16x16 slots of TILE_PX, comfortably inside old mobile GPU limits. */
export const ATLAS_PAGE_PX = 1536

export const TILES_PER_ROW = ATLAS_PAGE_PX / TILE_PX

export const TILES_PER_PAGE = TILES_PER_ROW * TILES_PER_ROW

/** Hard ceiling on library size. 512 tiles is 2 atlas pages, 18.9MB. */
export const MAX_TILES = 512

/** Files above this are rejected unread — a 40MB JPEG is ~200MP decoded. */
export const MAX_FILE_BYTES = 40 * 1024 * 1024

/** Only the header is needed to read dimensions without decoding. */
export const HEADER_BYTES = 64 * 1024

/** Concurrent decodes when the resize options dict works. */
export const DECODE_CONCURRENCY = 4

/** Safari <= 16.6 retains a full-resolution crop per decode, so serialise. */
export const DECODE_CONCURRENCY_FALLBACK = 1

/** Signature is SIGNATURE_GRID x SIGNATURE_GRID OKLab samples per tile. */
export const SIGNATURE_GRID = 3

export const SIGNATURE_CELLS = SIGNATURE_GRID * SIGNATURE_GRID

export const CHANNELS_PER_SAMPLE = 3

export const SIGNATURE_LENGTH = SIGNATURE_CELLS * CHANNELS_PER_SAMPLE

/** Pixels per signature axis before block-averaging: 12 = 3 blocks of 4. */
export const SIGNATURE_SOURCE_PX = 12

/**
 * Quarter turns a tile may be placed at when orientation matching is on.
 *
 * Rotating a signature is an index permutation, so this multiplies the effective
 * library by four without decoding anything again — a photo whose shapes run the
 * wrong way for a cell can still match it turned.
 */
export const ORIENTATIONS = 4

/** Luminance carries recognisability; chroma is secondary. */
export const WEIGHT_L = 2
export const WEIGHT_C = 1

/**
 * Below this weighted squared OKLab distance, two tiles are treated as the same
 * photo and the second is dropped.
 *
 * Filename plus size plus mtime catches the same file offered twice; this
 * catches the same picture arriving under another name — a re-export, a copy in
 * a second folder, a re-download. Deliberately tiny: a just-noticeable
 * difference in OKLab lightness is around 0.01, so squaring puts a visible
 * difference near 1e-4 and this sits well under it. Two genuinely different
 * photos that happen to be flat and similar are kept.
 */
export const DUPLICATE_DISTANCE_SQ = 5e-5

/** Squared OKLab distance added per prior use of a tile. */
export const REUSE_PENALTY = 0.0008

/** Squared OKLab distance added when a neighbour already uses this tile. */
export const ADJACENCY_PENALTY = 0.0064

/** Chebyshev radius searched for repeated neighbours. */
export const ADJACENCY_RADIUS = 2

/** maxUses = ceil(cells / tiles * SPREAD). Above 1 the library cannot run dry. */
export const DEFAULT_SPREAD = 1.5

/**
 * Ceiling on grid cells, so the worst case stays bounded.
 *
 * This is what lets the matcher stay a brute-force scan: MAX_CELLS * MAX_TILES
 * caps it at ~20M candidate pairs, which benchmarks under a second. A bucketed
 * pre-filter was considered and dropped — see the note at the end of match.ts.
 */
export const MAX_CELLS = 40_000

export const MIN_COLUMNS = 8
export const MAX_COLUMNS = 200
export const DEFAULT_COLUMNS = 60

/** Maximum absolute per-tile rotation the jitter slider can reach. */
export const MAX_ROTATION_DEGREES = 12
export const DEFAULT_ROTATION_DEGREES = 6

/** Extra pixels on a rotated tile, absorbing antialiasing on the rotated edge. */
export const BLEED_PX = 2

export const DEFAULT_TINT = 0.35

/** Neutral grey: any zero-saturation colour desaturates under the 'saturation' blend. */
export const NEUTRAL_GREY = '#808080'

/** Longest edge retained when analysing the source image. */
export const ANALYSIS_MAX_PX = 2048

/**
 * How often the generators offer a yield point.
 *
 * Only a granularity, not a cadence: the worker decides which of these offers
 * to act on, by elapsed time (see SLICE_BUDGET_MS). Resuming a generator costs
 * nanoseconds, so offering often is cheap and gives the time check resolution.
 *
 * Measuring is the only option — no API reports a device's speed.
 * `hardwareConcurrency` counts cores and `deviceMemory` is Chromium-only and
 * about RAM, so neither predicts how fast this particular loop will run.
 */
export const MATCH_YIELD_INTERVAL = 64
export const DRAW_YIELD_INTERVAL = 64

/**
 * Wall-clock budget for one slice of work between real yields.
 *
 * A little over one 60Hz frame: long enough that yield overhead stays
 * negligible, short enough that a `cancel` is picked up promptly. The worker
 * checks elapsed time rather than counting items, so the same code adapts
 * itself — a slow phone hands control back after fewer cells than a desktop
 * does, with nothing having to know which it is running on.
 */
export const SLICE_BUDGET_MS = 20

/** Progress messages are throttled to this, plus a guaranteed final one. */
export const PROGRESS_INTERVAL_MS = 100

/** Areas probed for the canvas ceiling: 2048^2, 4096^2, 8192^2. */
export const CANDIDATE_AREAS = [4_194_304, 16_777_216, 67_108_864]

/** Above this output area, default to JPEG — a 4096^2 PNG is 30-60MB. */
export const JPEG_THRESHOLD_AREA = 4_000_000

export const JPEG_QUALITY = 0.92

export const MIME_PNG = 'image/png'
export const MIME_JPEG = 'image/jpeg'

/** Worker must answer `init` within this, or the island falls back to unsupported. */
export const READY_TIMEOUT_MS = 2000

/** Slider changes re-render at most this often. */
export const RENDER_DEBOUNCE_MS = 150

/** Live-region text updates only on phase change or each of these steps. */
export const ANNOUNCE_STEP = 0.1

/** Cells above this upscale the 96px tiles, so the UI marks the boundary. */
export const NATIVE_DETAIL_CELL_PX = 85
