/* eslint-disable jsx-a11y/prefer-tag-over-role -- the preview is a <canvas>,
   which cannot be an <img>; role="img" plus a label is the only way to give the
   rendered mosaic an accessible name. */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- the drop
   zone carries drag handlers but is not itself a control; the buttons inside it
   are, and they are what the keyboard uses. Dropping is enhancement on top, and
   removing it would cost mouse users the drop target for nothing. */
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

import type { MosaicCopy } from '@/lib/mosaic-copy'

import {
	MAX_COLUMNS,
	MAX_ROTATION_DEGREES,
	MIN_COLUMNS,
} from './engine/constants'
import { imageFilesFrom, imageFilesFromDrop } from './files'
import type { MosaicPhase } from './protocol'
import * as styles from './styles.css'
import { useMosaicEngine } from './useMosaicEngine'

const PERCENT = 100

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
		canGenerate,
		canExport,
		attachCanvas,
		setMainImage,
		addPhotos,
		updateSettings,
		generate,
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

	// A photo already in the set is not a failure, and saying it "could not be
	// used" reads as something having gone wrong.
	const duplicateCount = rejected.filter(
		(file) => file.reason === 'duplicate',
	).length
	const unreadableCount = rejected.length - duplicateCount

	const selected = exportOptions[sizeIndex] ?? exportOptions[0]

	return (
		<div className={styles.container}>
			<div className={styles.panel}>
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

					<span className={styles.pickerRow}>
						{state.sourceReady ? (
							<label className={styles.pickerButton}>
								{copy.replaceMainImage}
								<input
									accept="image/*"
									className={styles.fileOverInput}
									onChange={handleMain}
									type="file"
								/>
							</label>
						) : null}
						{state.job === 'done' ? (
							<button
								className={styles.pickerButton}
								onClick={() => setZoomed(true)}
								ref={zoomTriggerRef}
								type="button"
							>
								{copy.viewFullSize}
							</button>
						) : null}
					</span>

					<progress
						aria-label={state.phase ? phaseLabel(copy, state.phase) : undefined}
						className={styles.progressBar}
						max={1}
						value={isBusy ? state.progress : 1}
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

					{/* One action at a time. Every control re-runs the pipeline on its
					    own now, so Generate is only ever the first step; once there is a
					    mosaic the only thing left to do with it is take it away. */}
					<div className={styles.actions}>
						{isBusy ? (
							<button className={styles.button} onClick={cancel} type="button">
								{copy.cancel}
							</button>
						) : canExport ? (
							state.downloadUrl ? (
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
							)
						) : (
							<button
								className={styles.button}
								disabled={!canGenerate}
								onClick={generate}
								type="button"
							>
								{copy.generate}
							</button>
						)}
					</div>
				</div>

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
							<span>{copy.dropPrompt}</span>
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
									{copy.photosPick}
									<input
										accept="image/*"
										className={styles.fileOverInput}
										multiple
										onChange={handlePhotos}
										type="file"
									/>
								</label>
								<label className={styles.pickerButton}>
									{copy.folderLabel}
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
						<p className={styles.hint}>{copy.photosHint}</p>
						{state.tileCount > 0 ? (
							<p className={styles.notice}>
								{format(copy.photoCountSummary, { count: state.tileCount })}
							</p>
						) : null}
						{state.considered > state.added ? (
							<p className={styles.notice}>
								{format(copy.tooMany, {
									used: state.added,
									total: state.considered,
								})}
							</p>
						) : null}
						{duplicateCount > 0 ? (
							<p className={styles.notice}>
								{format(copy.duplicatesSkipped, { count: duplicateCount })}
							</p>
						) : null}
						{unreadableCount > 0 ? (
							<p className={styles.notice}>
								{format(copy.rejectedFiles, { count: unreadableCount })}
							</p>
						) : null}
						{looksLikeHeic(rejected.map((file) => file.name)) ? (
							<p className={styles.notice}>{copy.heicUnsupported}</p>
						) : null}
					</div>

					<div className={styles.group}>
						<label className={styles.label} htmlFor={densityId}>
							{copy.gridDensityLabel}
						</label>
						<input
							className={styles.slider}
							id={densityId}
							max={MAX_COLUMNS}
							min={MIN_COLUMNS}
							onChange={(event) =>
								updateSettings({ columns: Number(event.target.value) }, true)
							}
							type="range"
							value={settings.columns}
						/>
						<span className={styles.value}>
							{grid
								? format(copy.gridSummary, { cols: grid.cols, rows: grid.rows })
								: `${settings.columns}`}
						</span>
					</div>

					<div className={styles.group}>
						<div className={styles.checkboxRow}>
							<input
								checked={settings.blackAndWhite}
								className={styles.checkbox}
								id={monoId}
								onChange={(event) =>
									updateSettings({ blackAndWhite: event.target.checked }, true)
								}
								type="checkbox"
							/>
							<label className={styles.label} htmlFor={monoId}>
								{copy.blackAndWhiteLabel}
							</label>
						</div>
					</div>

					<div className={styles.group}>
						<label className={styles.label} htmlFor={tintId}>
							{copy.tintLabel}
						</label>
						<input
							className={styles.slider}
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
							type="range"
							value={Math.round(settings.tint * PERCENT)}
						/>
						<span className={styles.value}>
							{Math.round(settings.tint * PERCENT)}%
						</span>
						<p className={styles.hint}>{copy.tintHint}</p>
					</div>

					<div className={styles.group}>
						<div className={styles.checkboxRow}>
							<input
								checked={settings.allowRotation}
								className={styles.checkbox}
								id={orientationId}
								onChange={(event) =>
									updateSettings({ allowRotation: event.target.checked }, true)
								}
								type="checkbox"
							/>
							<label className={styles.label} htmlFor={orientationId}>
								{copy.orientationLabel}
							</label>
						</div>
						<p className={styles.hint}>{copy.orientationHint}</p>
					</div>

					<div className={styles.group}>
						<label className={styles.label} htmlFor={rotationId}>
							{copy.tiltLabel}
						</label>
						<input
							className={styles.slider}
							id={rotationId}
							max={MAX_ROTATION_DEGREES}
							min={0}
							onChange={(event) =>
								updateSettings({ tilt: Number(event.target.value) }, false)
							}
							type="range"
							value={settings.tilt}
						/>
						<span className={styles.value}>{settings.tilt}°</span>
						<p className={styles.hint}>{copy.tiltHint}</p>
					</div>

					<div className={styles.group}>
						<label className={styles.label} htmlFor={sizeId}>
							{copy.exportSizeLabel}
						</label>
						<select
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
									{option.available ? '' : ` — ${copy.exceedsCanvasLimit}`}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	)
}
