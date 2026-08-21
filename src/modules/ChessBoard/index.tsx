import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { ChessModule } from '@/lib/chess/engine.js'
import initEngine from '@/lib/chess/engine.js'
import type { Locale } from '@/lib/i18n'
import type { MessageId } from '@/lib/message-ids'
import { getTranslate } from '@/lib/translate'

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

const NAMES: Record<string, MessageId> = {
	'1': 'chess.piece.whiteRook',
	'2': 'chess.piece.whiteKnight',
	'3': 'chess.piece.whiteBishop',
	'4': 'chess.piece.whiteQueen',
	'5': 'chess.piece.whiteKing',
	'6': 'chess.piece.whitePawn',
	'7': 'chess.piece.blackRook',
	'8': 'chess.piece.blackKnight',
	'9': 'chess.piece.blackBishop',
	a: 'chess.piece.blackQueen',
	b: 'chess.piece.blackKing',
	c: 'chess.piece.blackPawn',
}

// The engine's own codes, written to the socket in cchess-server.c. Anything
// unlisted still surfaces via chess.error.rejected rather than being swallowed.
const ERRORS: Record<string, MessageId> = {
	'e-07': 'chess.error.notYourPiece',
	'e-08': 'chess.error.emptySquare',
	'e-09': 'chess.error.ownPiece',
	'e-30': 'chess.error.blocked',
	'e-31': 'chess.error.illegalMove',
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

export default function ChessBoard({ locale }: { locale: Locale }) {
	const t = useMemo(() => getTranslate(locale), [locale])

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
						t(
							cells[index] === '0'
								? 'chess.error.pickYourPiece'
								: 'chess.error.notYourPiece',
						),
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
				const messageId = ERRORS[code]

				setMessage(
					messageId ? t(messageId) : t('chess.error.rejected', { code }),
				)
				setFrom(null)

				return
			}

			setCells(engine.read())
			setFrom(null)
			setTurn(turn === WHITE ? BLACK : WHITE)
			setMessage(null)
		},
		[cells, from, t, turn],
	)

	if (failed) {
		return (
			<div className={container}>
				<p className={status} role="alert">
					{t('chess.failed.before')}{' '}
					<a href="https://github.com/cesargdm/c-chess">GitHub</a>
					{t('chess.failed.after')}
				</p>
			</div>
		)
	}

	if (!cells) {
		return (
			<div className={container}>
				<p className={status}>{t('chess.loading')}</p>
			</div>
		)
	}

	return (
		<div className={container}>
			<p className={status}>
				{t(turn === WHITE ? 'chess.turn.white' : 'chess.turn.black')}
				{message ? <span className={errorClass}> — {message}</span> : null}
			</p>

			<div className={boardClass} role="grid" aria-label={t('chess.board')}>
				{Array.from({ length: SIZE * SIZE }, (_, rendered) => {
					const index = toEngineIndex(rendered)
					const piece = cells[index]
					const isLight =
						(Math.floor(rendered / SIZE) + (rendered % SIZE)) % 2 === 0
					const label = t(piece === '0' ? 'chess.square.empty' : NAMES[piece])

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
				{t('chess.newGame')}
			</button>

			<p className={footnote}>
				{t('chess.footnote.before')} <code>is_move_valid</code>
				{t('chess.footnote.after')}
			</p>
		</div>
	)
}
