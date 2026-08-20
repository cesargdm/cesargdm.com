# C Chess, compiled to WebAssembly

`board.c` and `cchess-server.c` are copied **verbatim** from
[cesargdm/c-chess](https://github.com/cesargdm/c-chess) at commit
`01581d4625085d4d41eaf4aede63ea790bf47630`. Do not edit them here — fix upstream
and re-copy, or the point of the exercise is lost: the board on the project page
is the 2017 course project running its own rules, not a JavaScript reimplementation
of them.

`chess_wasm.c` is the only new code. It exists because the engine was written as a
networked two-process game, and two of its assumptions do not hold in a browser:

- **Illegal moves are reported over a socket.** `is_move_valid` calls
  `send(player, "e-30", 4, 0)` and returns false. Defining `send` in the shim
  captures that code, so the UI reports the engine's actual complaint.
- **The board buffer is not a string.** `create_od_board` allocates
  `sizeof(char *) * 64` and never terminates, so the shim terminates it at index
  64 before handing it across the FFI boundary.

`cchess-client.c` is not vendored. It is pure BSD sockets and pthreads with no
game logic, and there is nothing for it to connect to.

## Building

```bash
./build.sh   # needs Docker; writes src/lib/chess/engine.js
```

The output is committed. CI does not build it — Cloudflare's builder has no
Emscripten, and the artifact only changes when the C does.

## Wire format

Moves are the engine's own notation, `"a2-a4"`. Teams are `-1` (white) and `1`
(black), matching `get_piece_team`. `chess_board()` returns 64 characters,
`'1'`–`'6'` for white rook/knight/bishop/queen/king/pawn, `'7'`–`'c'` for black,
`'0'` for empty.

## Known limits, inherited from 2017

The engine validates piece movement, path obstruction, captures and pawn
promotion. It has no check or checkmate detection, no castling, and no en
passant — `game_room` in the original drove turn order and the win condition
over the socket, and none of that is move validation. The UI says so rather than
pretending otherwise.
