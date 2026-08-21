/* eslint-disable jsx-a11y/prefer-tag-over-role -- the preview is a <canvas>,
   which cannot be an <img>; role="img" plus a label is the only way to give the
   rendered mosaic an accessible name. */
import { useId, useMemo, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

import type { MosaicCopy } from '@/lib/mosaic-copy'

import {
	MAX_COLUMNS,
	MAX_ROTATION_DEGREES,
	MIN_COLUMNS,
} from './engine/constants'
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
	const mainId = useId()
	const photosId = useId()
	const densityId = useId()
	const monoId = useId()
	const tintId = useId()
	const rotationId = useId()
	const sizeId = useId()

	const [dragging, setDragging] = useState(false)
	const [sizeIndex, setSizeIndex] = useState(1)

	const {
		state,
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
	} = useMosaicEngine()

	const { settings, grid, rejected } = state

	// Announced separately from the visual bar and only in 10% steps: a live
	// region updated at 10Hz is unusable with a screen reader.
	const announced = useMemo(() => {
		if (!state.phase) return ''
		const step = Math.round(state.progress * PERCENT * 0.1) * 10
		return `${phaseLabel(copy, state.phase)} ${format(copy.progressAnnouncement, { percent: step })}`
	}, [copy, state.phase, state.progress])

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
		if (file) void setMainImage(file)
	}

	function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files
		if (files) addPhotos([...files])
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		setDragging(false)
		const files = [...event.dataTransfer.files].filter((file) =>
			file.type.startsWith('image/'),
		)
		if (files.length > 0) addPhotos(files)
	}

	const selected = exportOptions[sizeIndex] ?? exportOptions[0]

	return (
		<div className={styles.container}>
			<div className={styles.panel}>
				<div className={styles.controls}>
					<div className={styles.group}>
						<h2 className={styles.groupHeading}>{copy.mainImageHeading}</h2>
						<label className={styles.label} htmlFor={mainId}>
							{copy.mainImageLabel}
						</label>
						<input
							accept="image/*"
							className={styles.fileInput}
							id={mainId}
							onChange={handleMain}
							type="file"
						/>
					</div>

					<div className={styles.group}>
						<h2 className={styles.groupHeading}>{copy.tilesHeading}</h2>
						{/* The input is a real focusable control inside the label, so the
						    keyboard path exists without any role or key handler; the drag
						    handlers are pure enhancement on top. */}
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
							<label className={styles.label} htmlFor={photosId}>
								{copy.photosLabel}
							</label>
							<span>{copy.dropPrompt}</span>
							<input
								accept="image/*"
								className={styles.visuallyHidden}
								id={photosId}
								multiple
								onChange={handlePhotos}
								type="file"
							/>
						</div>
						<p className={styles.hint}>{copy.photosHint}</p>
						{state.tileCount > 0 ? (
							<p className={styles.notice}>
								{format(copy.photoCountSummary, { count: state.tileCount })}
							</p>
						) : null}
						{state.considered > state.tileCount ? (
							<p className={styles.notice}>
								{format(copy.tooMany, {
									used: state.tileCount,
									total: state.considered,
								})}
							</p>
						) : null}
						{rejected.length > 0 ? (
							<p className={styles.notice}>
								{format(copy.rejectedFiles, { count: rejected.length })}
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
						<label className={styles.label} htmlFor={rotationId}>
							{copy.rotationLabel}
						</label>
						<input
							className={styles.slider}
							id={rotationId}
							max={MAX_ROTATION_DEGREES}
							min={0}
							onChange={(event) =>
								updateSettings({ rotation: Number(event.target.value) }, false)
							}
							type="range"
							value={settings.rotation}
						/>
						<span className={styles.value}>{settings.rotation}°</span>
						<p className={styles.hint}>{copy.rotationHint}</p>
					</div>

					<div className={styles.group}>
						<label className={styles.label} htmlFor={sizeId}>
							{copy.exportSizeLabel}
						</label>
						<select
							id={sizeId}
							onChange={(event) => setSizeIndex(Number(event.target.value))}
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

				<div className={styles.preview}>
					<div className={styles.canvasFrame}>
						{state.job === 'idle' && !state.sourceReady ? (
							<span>{copy.empty}</span>
						) : null}
						<canvas
							aria-busy={isBusy}
							aria-label={canvasLabel}
							className={styles.canvas}
							ref={attachCanvas}
							role="img"
						/>
					</div>

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

					<div className={styles.actions}>
						<button
							className={styles.button}
							disabled={!isBusy && !canGenerate}
							onClick={isBusy ? cancel : generate}
							type="button"
						>
							{isBusy ? copy.cancel : copy.generate}
						</button>

						{state.downloadUrl && canExport ? (
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
								disabled={!canExport || !selected?.available}
								onClick={() => {
									if (selected) exportAt(selected)
								}}
								type="button"
							>
								{copy.download}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
