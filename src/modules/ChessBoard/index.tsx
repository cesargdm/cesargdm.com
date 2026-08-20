import { useCallback, useEffect, useRef, useState } from 'react'

import type { ChessModule } from '@/lib/chess/engine.js'
import initEngine from '@/lib/chess/engine.js'

import {
	board as boardClass,
	container,
	error as errorClass,
	footnote,
	light,
	newGame,
	selected,
	square,
	status,
	target,
} from './styles.css'

const SIZE = 8
const WHITE = -1
const BLACK = 1

const PIECES: Record<string, string> = {
	'1': '♖',
	'2': '♘',
	'3': '♗',
	'4': '♕',
	'5': '♔',
	'6': '♙',
	'7': '♜',
	'8': '♞',
	'9': '♝',
	a: '♛',
	b: '♚',
	c: '♟',
}

const NAMES: Record<string, string> = {
	'1': 'white rook',
	'2': 'white knight',
	'3': 'white bishop',
	'4': 'white queen',
	'5': 'white king',
	'6': 'white pawn',
	'7': 'black rook',
	'8': 'black knight',
	'9': 'black bishop',
	a: 'black queen',
	b: 'black king',
	c: 'black pawn',
}

// The engine's own codes, written to the socket in cchess-server.c. Anything
// unlisted still surfaces raw rather than being swallowed.
const ERRORS: Record<string, string> = {
	'e-07': 'That is not your piece.',
	'e-08': 'There is no piece there.',
	'e-09': 'That square holds one of your own pieces.',
	'e-30': 'A piece is in the way.',
	'e-31': 'That piece does not move like that.',
}

type Engine = {
	newGame: () => void
	read: () => string
	move: (notation: string, team: number) => number
	lastError: () => string
}

/**
 * The engine stores rank 8 at row 0, so white sits at the top of its array.
 * Every chess board a visitor has seen puts white at the bottom, so the grid is
 * rendered bottom-up and this maps a rendered square back to an engine index.
 * cchess-server.c had the same problem and solved it the same way, with
 * print_board_buff_inverted.
 */
function toEngineIndex(rendered: number) {
	const row = Math.floor(rendered / SIZE)
	const column = rendered % SIZE

	return (SIZE - 1 - row) * SIZE + column
}

function toNotation(engineIndex: number) {
	const file = String.fromCharCode('a'.charCodeAt(0) + (engineIndex % SIZE))
	const rank = SIZE - Math.floor(engineIndex / SIZE)

	return `${file}${rank}`
}

function teamOf(piece: string) {
	if (piece === '0') return 0

	return piece >= '7' ? BLACK : WHITE
}

export default function ChessBoard() {
	const engineRef = useRef<Engine | null>(null)
	const [cells, setCells] = useState<string | null>(null)
	const [from, setFrom] = useState<number | null>(null)
	const [turn, setTurn] = useState(WHITE)
	const [message, setMessage] = useState<string | null>(null)
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		let cancelled = false

		initEngine()
			.then((module: ChessModule) => {
				if (cancelled) return

				const engine: Engine = {
					newGame: module.cwrap('chess_new_game', null, []),
					read: module.cwrap('chess_board', 'string', []),
					move: module.cwrap('chess_move', 'number', ['string', 'number']),
					lastError: module.cwrap('chess_last_error', 'string', []),
				}

				engine.newGame()
				engineRef.current = engine
				setCells(engine.read())
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})

		return () => {
			cancelled = true
		}
	}, [])

	const reset = useCallback(() => {
		const engine = engineRef.current
		if (!engine) return

		engine.newGame()
		setCells(engine.read())
		setFrom(null)
		setTurn(WHITE)
		setMessage(null)
	}, [])

	const handleSquare = useCallback(
		(index: number) => {
			const engine = engineRef.current
			if (!engine || !cells) return

			if (from === null) {
				if (teamOf(cells[index]) !== turn) {
					setMessage(
						cells[index] === '0'
							? 'Empty square — pick one of your pieces.'
							: 'That is not your piece.',
					)

					return
				}

				setMessage(null)
				setFrom(index)

				return
			}

			if (from === index) {
				setFrom(null)

				return
			}

			const notation = `${toNotation(from)}-${toNotation(index)}`
			const ok = engine.move(notation, turn)

			if (!ok) {
				const code = engine.lastError()
				setMessage(ERRORS[code] ?? `Rejected by the engine (${code}).`)
				setFrom(null)

				return
			}

			setCells(engine.read())
			setFrom(null)
			setTurn(turn === WHITE ? BLACK : WHITE)
			setMessage(null)
		},
		[cells, from, turn],
	)

	if (failed) {
		return (
			<div className={container}>
				<p className={status} role="alert">
					The WebAssembly engine did not load, so there is no board to play. The
					C it was built from is on{' '}
					<a href="https://github.com/cesargdm/c-chess">GitHub</a>.
				</p>
			</div>
		)
	}

	if (!cells) {
		return (
			<div className={container}>
				<p className={status}>Loading the engine…</p>
			</div>
		)
	}

	return (
		<div className={container}>
			<p className={status}>
				{turn === WHITE ? 'White' : 'Black'} to move
				{message ? <span className={errorClass}> — {message}</span> : null}
			</p>

			<div className={boardClass} role="grid" aria-label="Chess board">
				{Array.from({ length: SIZE * SIZE }, (_, rendered) => {
					const index = toEngineIndex(rendered)
					const piece = cells[index]
					const isLight =
						(Math.floor(rendered / SIZE) + (rendered % SIZE)) % 2 === 0
					const label = piece === '0' ? 'empty' : NAMES[piece]

					return (
						<button
							key={rendered}
							type="button"
							className={[
								square,
								isLight ? light : '',
								from === index ? selected : '',
								from !== null && teamOf(piece) === turn ? target : '',
							]
								.filter(Boolean)
								.join(' ')}
							aria-label={`${toNotation(index)}, ${label}`}
							aria-pressed={from === index}
							onClick={() => handleSquare(index)}
						>
							{piece === '0' ? '' : PIECES[piece]}
						</button>
					)
				})}
			</div>

			<button type="button" className={newGame} onClick={reset}>
				New game
			</button>

			<p className={footnote}>
				This is the 2017 C engine compiled to WebAssembly — every move above is
				validated by the original <code>is_move_valid</code>, not by JavaScript.
				It knows how pieces move, what blocks them and when a pawn promotes. It
				has no concept of check, castling or en passant; turn order was the
				server&rsquo;s job, and the server is not here.
			</p>
		</div>
	)
}
