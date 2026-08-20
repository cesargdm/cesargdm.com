---
title: C Chess
description: A two-player networked chess server written in C in 2017 — now compiled to WebAssembly and playable below.
date: 2017
repository:
  url: https://github.com/cesargdm/c-chess
  stars: 13
tags: [c, cli, websockets, webassembly]
---

# C Chess

A chess board and match server written in C for a university programming course
in 2017. Two players connect over TCP, the server holds the board, and every
move is validated before it is broadcast back to both terminals.

The interesting part was never the chess. It was that a single-threaded C program
had to become a matchmaker: `game_room` runs one thread per game, and the first
player to arrive blocks on a `pthread_cond_t` until a second one signals it. The
board itself is a `wchar_t **` so the pieces are literal Unicode chess glyphs in
memory, and it is flattened to 64 ASCII characters before going over the wire.

Move validation is where the real work is. `is_move_valid` checks piece
ownership, then dispatches on piece type: rooks and queens through
`is_rect_clear`, bishops and queens through `is_diagonal_clear`, knights by
magnitude, pawns with their first-move exception and their diagonal-only capture.
Each rejection has its own code — `e-30` for an obstructed path, `e-07` for
moving a piece that isn't yours — written straight to the offending player's
socket.

## Playable, eight years later

The board below is that same C code, compiled to WebAssembly with Emscripten.
`board.c` and `cchess-server.c` are vendored **unmodified**; the only new code is
a shim supplying a `send()` that captures the engine's error codes instead of
writing them to a socket that doesn't exist. When you make an illegal move, the
message you see is the 2017 engine's own verdict.

It compiles to 16KB of WebAssembly.

Two caveats, both honest inheritances rather than bugs introduced in the port.
The engine validates how pieces move but has no notion of check, checkmate,
castling or en passant — turn order and the win condition lived in the socket
loop, not in the rules. And `create_od_board` allocates `sizeof(char *)` per
square instead of `sizeof(char)`, quietly reserving 512 bytes for 64. Harmless,
and left in place: the point is to run the code that was written, not the code I
would write now.
