---
title: C Chess
description: Un servidor de ajedrez en red para dos jugadores escrito en C en 2017 — ahora compilado a WebAssembly y jugable aquí abajo.
date: 2017
repository:
  url: https://github.com/cesargdm/c-chess
  stars: 13
tags: [c, cli, websockets, webassembly]
---

# C Chess

Un tablero de ajedrez y un servidor de partidas escritos en C para una materia de
programación en la universidad, en 2017. Dos jugadores se conectan por TCP, el
servidor mantiene el tablero y cada movimiento se valida antes de retransmitirse
a ambas terminales.

Lo interesante nunca fue el ajedrez. Fue que un programa en C de un solo hilo
tuviera que convertirse en emparejador: `game_room` corre un hilo por partida, y
el primer jugador en llegar se bloquea en un `pthread_cond_t` hasta que un
segundo lo despierta. El tablero es un `wchar_t **`, así que las piezas son
literalmente glifos Unicode de ajedrez en memoria, y se aplana a 64 caracteres
ASCII antes de viajar por la red.

La validación de movimientos es donde está el trabajo de verdad. `is_move_valid`
comprueba de quién es la pieza y luego despacha según su tipo: torres y damas por
`is_rect_clear`, alfiles y damas por `is_diagonal_clear`, caballos por magnitud,
peones con su excepción de primer movimiento y su captura solo en diagonal. Cada
rechazo tiene su propio código — `e-30` para un camino obstruido, `e-07` por
mover una pieza que no es tuya — escrito directo al socket del jugador que se
equivocó.

## Jugable, ocho años después

El tablero de abajo es ese mismo código en C, compilado a WebAssembly con
Emscripten. `board.c` y `cchess-server.c` están incluidos **sin modificar**; lo
único nuevo es un shim que provee un `send()` que captura los códigos de error
del motor en lugar de escribirlos a un socket que no existe. Cuando haces un
movimiento ilegal, el mensaje que ves es el veredicto del propio motor de 2017.

Compila a 16KB de WebAssembly.

Dos advertencias, ambas herencias honestas y no errores introducidos en el
port. El motor valida cómo se mueven las piezas pero no tiene noción de jaque,
jaque mate, enroque ni captura al paso — el orden de turnos y la condición de
victoria vivían en el bucle del socket, no en las reglas. Y `create_od_board`
reserva `sizeof(char *)` por casilla en vez de `sizeof(char)`, apartando
calladamente 512 bytes para 64. Inofensivo, y se queda: la idea es correr el
código que se escribió, no el que escribiría hoy.
