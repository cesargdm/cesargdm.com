/* eslint-disable jsx-a11y/prefer-tag-over-role -- the preview is a <canvas>,
   which cannot be an <img>; role="img" plus a label is the only way to give the
   rendered mosaic an accessible name. */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- the drop
   zone carries drag handlers but is not itself a control; the buttons inside it
   are, and they are what the keyboard uses. Dropping is enhancement on top, and
   removing it would cost mouse users the drop target for nothing. */
import { IconArrowsMaximize, IconArrowsShuffle } from '@tabler/icons-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

import Checkbox from '@/components/Checkbox'
import Slider from '@/components/Slider'
import type { MosaicCopy } from '@/lib/mosaic-copy'

import {
	MAX_COLUMNS,
	MAX_ROTATION_DEGREES,
	MIN_COLUMNS,
} from './engine/constants'
import { imageFilesFrom, imageFilesFromDrop } from './files'
import { InfoLabel } from './InfoLabel'
import type { MosaicPhase } from './protocol'
import * as styles from './styles.css'
import { useMosaicEngine } from './useMosaicEngine'

const PERCENT = 100
const ICON_SIZE = 18

function format(template: string, values: Record<string, number | string>) {
	return Object.entries(values).reduce(
		(text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
		template,
	)
}

function phaseLabel(copy: MosaicCopy, phase: MosaicPhase): string {
	if (phase === 'ingest') return copy.phaseIngest
	if (phase === 'match') return copy.phaseMatch
	if (phase === 'draw') return copy.phaseDraw
	return copy.phaseEncode
}

function looksLikeHeic(names: string[]): boolean {
	if (names.length === 0) return false
	const heic = names.filter((name) => /\.hei[cf]$/i.test(name)).length
	return heic * 2 > names.length
}

export default function PhotoMosaic({ copy }: { copy: MosaicCopy }) {
	const orientationId = useId()
	const densityId = useId()
	const monoId = useId()
	const tintId = useId()
	const rotationId = useId()
	const sizeId = useId()

	const [dragging, setDragging] = useState(false)
	const [zoomed, setZoomed] = useState(false)
	const closeZoomRef = useRef<HTMLButtonElement | null>(null)
	const zoomTriggerRef = useRef<HTMLButtonElement | null>(null)
	const [sizeIndex, setSizeIndex] = useState(1)

	const {
		state,
		canvasKey,
		exportOptions,
		isBusy,
		canExport,
		attachCanvas,
		setMainImage,
		addPhotos,
		updateSettings,
		cancel,
		exportAt,
		clearExport,
	} = useMosaicEngine()

	const { settings, grid, rejected } = state

	// Announced separately from the visual bar and only in 10% steps: a live
	// region updated at 10Hz is unusable with a screen reader.
	const announced = useMemo(() => {
		if (!state.phase) return ''
		const step = Math.round(state.progress * PERCENT * 0.1) * 10
		return `${phaseLabel(copy, state.phase)} ${format(copy.progressAnnouncement, { percent: step })}`
	}, [copy, state.phase, state.progress])

	// Escape closes it, as any dialog should. Bound only while open so the
	// handler is not sitting on the document for the life of the page.
	useEffect(() => {
		if (!zoomed) {
			// Focus goes back where it came from, or it would be left on an element
			// that is no longer on screen.
			zoomTriggerRef.current?.focus()
			return
		}

		// Moving focus into the dialog is the point of opening one; `autoFocus`
		// would do it too, but only on first mount and the a11y rule flags it.
		closeZoomRef.current?.focus()

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') setZoomed(false)
		}

		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [zoomed])

	// A finished mosaic is the only thing worth enlarging.
	useEffect(() => {
		if (state.job !== 'done') setZoomed(false)
	}, [state.job])

	const canvasLabel = useMemo(() => {
		if (!grid || state.job !== 'done') return copy.empty
		return `${format(copy.gridSummary, { cols: grid.cols, rows: grid.rows })} — ${format(copy.photoCountSummary, { count: state.tileCount })}`
	}, [copy, grid, state.job, state.tileCount])

	if (state.supported === false) {
		return (
			<p className={styles.error} role="alert">
				{copy.errors.unsupported}
			</p>
		)
	}

	function handleMain(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.item(0)
		// Cleared so that choosing the same file again still fires a change; the
		// value is otherwise unchanged and the event never arrives.
		event.target.value = ''
		if (file) void setMainImage(file)
	}

	function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files
		// A folder pick hands back every file in it — .DS_Store, sidecars, videos
		// — so the non-images are dropped before they reach the decoder.
		const images = files ? imageFilesFrom(files) : []
		// Cleared so the same folder can be chosen twice; without this the value
		// is unchanged and no change event fires the second time.
		event.target.value = ''
		if (images.length > 0) addPhotos(images)
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		setDragging(false)
		// Walks into dropped folders; a folder arrives as one unusable File
		// otherwise.
		void imageFilesFromDrop(event.dataTransfer).then((files) => {
			if (files.length > 0) addPhotos(files)
		})
	}

	const selected = exportOptions[sizeIndex] ?? exportOptions[0]

	return (
		<div className={styles.container}>
			<div
				className={
					state.sourceReady
						? styles.panel
						: `${styles.panel} ${styles.panelSolo}`
				}
			>
				<div className={styles.preview}>
					{/* The frame takes the source's aspect ratio as soon as one is
					    chosen, so the placeholder and the finished mosaic occupy exactly
					    the same box and nothing reshapes on Generate. */}
					<div
						aria-label={zoomed ? copy.fullSizeLabel : undefined}
						aria-modal={zoomed ? true : undefined}
						className={zoomed ? styles.frameZoomed : styles.canvasFrame}
						role={zoomed ? 'dialog' : undefined}
						style={
							!zoomed && state.sourceWidth > 0
								? {
										aspectRatio: `${state.sourceWidth} / ${state.sourceHeight}`,
										minHeight: 0,
									}
								: undefined
						}
					>
						{zoomed ? (
							<button
								className={styles.zoomClose}
								ref={closeZoomRef}
								onClick={() => setZoomed(false)}
								type="button"
							>
								{copy.closeFullSize}
							</button>
						) : null}
						{state.sourcePreview && state.job !== 'done' ? (
							<img
								alt=""
								className={styles.placeholder}
								src={state.sourcePreview}
							/>
						) : null}
						{state.sourceReady && !zoomed ? (
							<label
								aria-label={copy.replaceMainImage}
								className={styles.cornerLeft}
								title={copy.replaceMainImage}
							>
								<IconArrowsShuffle size={ICON_SIZE} />
								<input
									accept="image/*"
									className={styles.fileOverInput}
									onChange={handleMain}
									type="file"
								/>
							</label>
						) : null}
						{state.job === 'done' && !zoomed ? (
							<button
								aria-label={copy.viewFullSize}
								className={styles.cornerRight}
								onClick={() => setZoomed(true)}
								ref={zoomTriggerRef}
								title={copy.viewFullSize}
								type="button"
							>
								<IconArrowsMaximize size={ICON_SIZE} />
							</button>
						) : null}
						{state.sourceReady ? null : (
							<label className={styles.emptyOverlay}>
								{copy.mainImageEmpty}
								<input
									accept="image/*"
									className={styles.fileOverInput}
									onChange={handleMain}
									type="file"
								/>
							</label>
						)}
						<canvas
							aria-busy={isBusy}
							aria-label={canvasLabel}
							className={styles.canvas}
							key={canvasKey}
							ref={attachCanvas}
							role="img"
						/>
					</div>

					{/* Kept in the layout while idle rather than unmounted: the mosaic
					    regenerates on every control change, and a bar that came and went
					    would make the whole column jump several times a second. */}
					<progress
						aria-label={state.phase ? phaseLabel(copy, state.phase) : undefined}
						className={
							isBusy
								? styles.progressBar
								: `${styles.progressBar} ${styles.progressIdle}`
						}
						max={1}
						value={isBusy ? state.progress : 0}
					/>

					{/* <output> carries an implicit status role, so the announcement
					    lives here rather than on a <p role="status">. */}
					<output aria-atomic aria-live="polite" className={styles.status}>
						{announced}
					</output>

					{state.error ? (
						<p className={styles.error} role="alert">
							{copy.errors[state.error]}
						</p>
					) : null}

					{/* No Generate button: the mosaic rebuilds itself whenever anything
					    it depends on changes, so the only actions left are stopping a run
					    and taking the result away. The size belongs with Download because
					    it is a property of that one action, not of the mosaic. */}
					<div className={styles.actions}>
						{isBusy ? (
							<button className={styles.button} onClick={cancel} type="button">
								{copy.cancel}
							</button>
						) : canExport ? (
							<span className={styles.exportRow}>
								<span className={styles.exportField}>
									<label className={styles.label} htmlFor={sizeId}>
										{copy.exportSizeLabel}
									</label>
									<select
										className={styles.exportSelect}
										id={sizeId}
										onChange={(event) => {
											setSizeIndex(Number(event.target.value))
											clearExport()
										}}
										value={sizeIndex}
									>
										{exportOptions.map((option, index) => (
											<option
												disabled={!option.available}
												key={option.edge}
												value={index}
											>
												{option.width} × {option.height}
												{option.nativeDetail ? ` — ${copy.nativeDetail}` : ''}
												{option.available
													? ''
													: ` — ${copy.exceedsCanvasLimit}`}
											</option>
										))}
									</select>
								</span>
								{state.downloadUrl ? (
									<a
										className={styles.downloadLink}
										download={state.downloadName ?? 'mosaic.png'}
										href={state.downloadUrl}
									>
										{copy.download}
									</a>
								) : (
									<button
										className={styles.button}
										disabled={!selected?.available}
										onClick={() => {
											if (selected) exportAt(selected)
										}}
										type="button"
									>
										{copy.download}
									</button>
								)}
							</span>
						) : null}
					</div>
				</div>

				{/* Nothing to configure until there is an image to configure it for,
				    and an empty rail of sliders beside an empty canvas only asks the
				    reader to work out which control to touch first. */}
				{state.sourceReady ? (
					<div className={styles.controls}>
						<div className={styles.group}>
							<h2 className={styles.groupHeading}>{copy.tilesHeading}</h2>
							{/* A plain div. It was a <label> once, but it now contains the two
						    picker buttons, and a label wrapping controls double-fires every
						    click through them — that opened a file dialog per level. */}
							<div
								className={
									dragging
										? `${styles.dropZone} ${styles.dropZoneActive}`
										: styles.dropZone
								}
								onDragLeave={() => setDragging(false)}
								onDragOver={(event) => {
									event.preventDefault()
									setDragging(true)
								}}
								onDrop={handleDrop}
							>
								<span className={styles.label}>{copy.photosLabel}</span>
								<span>
									{state.tileCount > 0
										? format(copy.dropPromptWithCount, {
												count: state.tileCount,
											})
										: copy.dropPrompt}
								</span>
								{/* Two buttons rather than one, because `webkitdirectory` is a
							    mode on the input: the OS picker offers files or folders,
							    never both. A drop handles either in one gesture, which is
							    why the zone around them takes both. */}
								{/* Each input is the button, stretched over it at zero opacity,
							    rather than something a button clicks for you. WebKit will not
							    open a picker for an input it considers hidden, so a
							    programmatic click on a clipped one silently does nothing. */}
								<span className={styles.pickerRow}>
									<label className={styles.pickerButton}>
										{state.tileCount > 0 ? copy.photosMore : copy.photosPick}
										<input
											accept="image/*"
											className={styles.fileOverInput}
											multiple
											onChange={handlePhotos}
											type="file"
										/>
									</label>
									<label className={styles.pickerButton}>
										{state.tileCount > 0 ? copy.folderMore : copy.folderLabel}
										<input
											className={styles.fileOverInput}
											multiple
											onChange={handlePhotos}
											ref={(element) => {
												// Assigned as a property, not a JSX attribute:
												// `webkitdirectory` is non-standard, so React would pass
												// it through as a string and TypeScript has no prop for
												// it.
												if (element) element.webkitdirectory = true
											}}
											type="file"
										/>
									</label>
								</span>
							</div>
							{/* Reading the photos belongs next to the photos, not down with the
							    mosaic's own progress. */}
							{state.ingesting ? (
								<progress
									aria-label={copy.phaseIngest}
									className={styles.ingestProgress}
									max={1}
									value={state.phase === 'ingest' ? state.progress : undefined}
								/>
							) : null}
							{/* The only rejection worth its own line, because it is the only
							    one the reader can act on. Counts of duplicates and unreadable
							    files were noise beside a photo count that already says how
							    many made it in. */}
							{looksLikeHeic(rejected.map((file) => file.name)) ? (
								<p className={styles.notice}>{copy.heicUnsupported}</p>
							) : null}
						</div>

						<div className={styles.group}>
							<InfoLabel
								explain={copy.explain}
								hint={copy.gridDensityHint}
								htmlFor={densityId}
							>
								{copy.gridDensityLabel}
							</InfoLabel>
							<Slider
								id={densityId}
								max={MAX_COLUMNS}
								min={MIN_COLUMNS}
								onChange={(event) =>
									updateSettings({ columns: Number(event.target.value) }, true)
								}
								value={settings.columns}
							/>
							<span className={styles.value}>
								{grid
									? format(copy.gridSummary, {
											cols: grid.cols,
											rows: grid.rows,
										})
									: `${settings.columns}`}
							</span>
						</div>

						<div className={styles.group}>
							<div className={styles.checkboxRow}>
								<Checkbox
									checked={settings.blackAndWhite}
									id={monoId}
									onChange={(event) =>
										updateSettings(
											{ blackAndWhite: event.target.checked },
											true,
										)
									}
								/>
								<label className={styles.label} htmlFor={monoId}>
									{copy.blackAndWhiteLabel}
								</label>
							</div>
						</div>

						<div className={styles.group}>
							<InfoLabel
								explain={copy.explain}
								hint={copy.tintHint}
								htmlFor={tintId}
							>
								{copy.tintLabel}
							</InfoLabel>
							<Slider
								disabled={settings.blackAndWhite}
								id={tintId}
								max={PERCENT}
								min={0}
								onChange={(event) =>
									updateSettings(
										{ tint: Number(event.target.value) / PERCENT },
										false,
									)
								}
								value={Math.round(settings.tint * PERCENT)}
							/>
							<span className={styles.value}>
								{Math.round(settings.tint * PERCENT)}%
							</span>
						</div>

						<div className={styles.group}>
							<div className={styles.checkboxRow}>
								<Checkbox
									checked={settings.allowRotation}
									id={orientationId}
									onChange={(event) =>
										updateSettings(
											{ allowRotation: event.target.checked },
											true,
										)
									}
								/>
								<InfoLabel
									explain={copy.explain}
									hint={copy.orientationHint}
									htmlFor={orientationId}
								>
									{copy.orientationLabel}
								</InfoLabel>
							</div>
						</div>

						<div className={styles.group}>
							<InfoLabel
								explain={copy.explain}
								hint={copy.tiltHint}
								htmlFor={rotationId}
							>
								{copy.tiltLabel}
							</InfoLabel>
							<Slider
								id={rotationId}
								max={MAX_ROTATION_DEGREES}
								min={0}
								onChange={(event) =>
									updateSettings({ tilt: Number(event.target.value) }, false)
								}
								value={settings.tilt}
							/>
							<span className={styles.value}>{settings.tilt}°</span>
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}
