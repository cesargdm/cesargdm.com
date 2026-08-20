#!/usr/bin/env bash
#
# Compiles the C Chess engine to WebAssembly.
#
# Run manually after changing anything in this directory, then commit the
# regenerated engine. It is deliberately NOT part of `bun run build`: the site
# builds on Cloudflare with no Emscripten and no Docker, and a 30KB artifact
# that changes only when the C does is not worth a toolchain in CI.
#
#   ./src/wasm/c-chess/build.sh
#
# SINGLE_FILE base64-inlines the wasm into the JS glue, so the island has one
# import and no runtime path resolution — worth the ~33% size tax at this size.
set -euo pipefail

cd "$(dirname "$0")"
OUT=../../lib/chess/engine.js

docker run --rm -v "$PWD:/src" -w /src emscripten/emsdk:latest \
	emcc chess_wasm.c -O3 -o /src/engine.js \
	-sEXPORTED_RUNTIME_METHODS=cwrap \
	-sMODULARIZE -sEXPORT_ES6 -sENVIRONMENT=web \
	-sALLOW_MEMORY_GROWTH -sSINGLE_FILE \
	-sEXPORTED_FUNCTIONS=_chess_new_game,_chess_board,_chess_move,_chess_last_error,_malloc,_free

mkdir -p "$(dirname "$OUT")"
mv engine.js "$OUT"
echo "wrote $(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT") ($(du -h "$OUT" | cut -f1))"
