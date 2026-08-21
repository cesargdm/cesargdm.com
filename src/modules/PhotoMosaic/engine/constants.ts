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

/** Luminance carries recognisability; chroma is secondary. */
export const WEIGHT_L = 2
export const WEIGHT_C = 1

/** Squared OKLab distance added per prior use of a tile. */
export const REUSE_PENALTY = 0.0008

/** Squared OKLab distance added when a neighbour already uses this tile. */
export const ADJACENCY_PENALTY = 0.0064

/** Chebyshev radius searched for repeated neighbours. */
export const ADJACENCY_RADIUS = 2

/** maxUses = ceil(cells / tiles * SPREAD). Above 1 the library cannot run dry. */
export const DEFAULT_SPREAD = 1.5

/** Beyond this many (cell, tile) pairs, switch to the bucketed pre-filter. */
export const LINEAR_SCAN_BUDGET = 4_000_000

/** Buckets per OKLab axis in the pre-filter. */
export const BUCKET_AXIS = 16

/** Minimum candidates collected before the shell walk may stop. */
export const CANDIDATE_K = 64

/** OKLab a/b range covered by the bucket grid. */
export const AB_RANGE = 0.4

/** Ceiling on grid cells, so the worst case stays bounded. */
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

/** Cooperative yield cadence, so `cancel` can actually be delivered mid-run. */
export const MATCH_YIELD_INTERVAL = 512
export const DRAW_YIELD_INTERVAL = 256

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
