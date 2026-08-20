/*
 * Browser entry point for the C Chess engine.
 *
 * board.c and cchess-server.c are vendored verbatim (see README.md). Nothing in
 * them is patched — every rule, every bounds check and every error code is the
 * original 2017 code. This file is the whole adaptation layer, and it exists to
 * bridge exactly two things the browser cannot provide:
 *
 *   1. The engine reports an illegal move by writing a four-byte code straight
 *      to the offending player's socket. Defining send() here captures the code
 *      instead, which is what lets the UI show the engine's own diagnosis
 *      rather than a generic "invalid move".
 *
 *   2. create_od_board() allocates with sizeof(char *) per square and never
 *      terminates the buffer, so reading it as a C string runs off the end of
 *      the board. chess_board() terminates it before handing it to JS. The
 *      over-allocation means writing index 64 is well within the block.
 */
#include <string.h>
#include <sys/types.h>
#include <emscripten.h>

#define BOARD_CELLS 64
#define ERROR_CODE_SIZE 8

static char last_error[ERROR_CODE_SIZE];

ssize_t send(int fd, const void *buf, size_t len, int flags) {
	(void)fd;
	(void)flags;
	size_t n = len < sizeof(last_error) - 1 ? len : sizeof(last_error) - 1;
	memcpy(last_error, buf, n);
	last_error[n] = '\0';
	return (ssize_t)len;
}

/* cchess-server.c is a standalone program; its main() would collide with ours. */
#define main cchess_server_main
#include "cchess-server.c"
#undef main

static wchar_t **board;
static char *od_board;

EMSCRIPTEN_KEEPALIVE void chess_new_game(void) {
	if (!board) {
		board = create_board();
		od_board = create_od_board();
	}
	initialize_board(board);
	last_error[0] = '\0';
}

/* 64 chars: '1'-'6' white RNBQKP, '7'-'c' black RNBQKP, '0' empty. */
EMSCRIPTEN_KEEPALIVE const char *chess_board(void) {
	to_one_dimension_char(board, od_board);
	od_board[BOARD_CELLS] = '\0';
	return od_board;
}

EMSCRIPTEN_KEEPALIVE const char *chess_last_error(void) {
	return last_error;
}

/* `notation` is the engine's own wire format: "a2-a4". `team` is -1 or 1. */
EMSCRIPTEN_KEEPALIVE int chess_move(const char *notation, int team) {
	int move[4];
	last_error[0] = '\0';
	translate_to_move(move, (char *)notation);
	/*
	 * is_move_valid is not a pure predicate: the pawn branch calls promote_piece
	 * itself when the destination is the back rank. Calling it again here turned
	 * every move into a promotion.
	 */
	if (!is_move_valid(board, -1, team, move)) return 0;
	move_piece(board, move);
	return 1;
}
