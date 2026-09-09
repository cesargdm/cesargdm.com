---
title: Bachepolis
description: Un arcade tipo Moon Patrol sobre manejar un Tsuru rojo entre los baches de Toluca — geometría 2D en Three.js, un motor de paso fijo y un agente de IA que lo escribió y lo probó.
date: 2026-09
url: https://bachepolis.cesargdm.com
tags: [expo, react-native, three.js, webgl, cloudflare-workers]
---

# Bachepolis

[Bachepolis](https://bachepolis.cesargdm.com) es un juego arcade sobre el acto ordinario de cruzar Toluca en coche. Manejas un Tsuru rojo por una sola carretera infinita, saltas baches y alcantarillas sin tapa, y disparas a los topes que no alcanzas a librar. El chiste se cuenta solo: el viaje se parece tanto a _Moon Patrol_ que el juego de 1982 sirve de plantilla casi sin cambiarle nada. Los cráteres son baches, las rocas lunares son topes, y la superficie de la luna es Paseo Tollocan.

La carretera recorre cuatro avenidas reales — Tollocan, Las Torres, Tecnológico, Hidalgo — y regresa a Tollocan sin detenerse. Cada una tiene su paleta, su vocabulario de obstáculos y su subtítulo con cara seria: Tecnológico está clasificada como _ingeniería de suspensión_, y su advertencia dice "ese tope tiene código postal".

## Daño en vez de vidas

Casi todos los corredores infinitos te dan tres vidas y te quitan una por golpe. Aquí los tres golpes son tres estados del mismo coche. El primero rompe la suspensión y baja la carrocería sobre sus resortes. El segundo poncha una llanta delantera, que echa humo hasta que la repares. El tercero poncha la otra y termina el viaje. Sigues manejando, saltando y disparando durante todo eso: un Tsuru con una llanta ponchada sigue siendo, culturalmente hablando, un coche que funciona.

Eso convierte la reparación en la economía del juego. Las monedas flotan sobre la calle y valen 25 puntos cada una. Cada tanto pasa una vulcanizadora, y pasarla _sin saltar_ gasta seis monedas en una reparación — el precio sube tres cada vez, porque la segunda visita nunca cuesta lo mismo que la primera. La pantalla final es una nota del taller: obstáculos librados, topes destruidos, monedas juntadas, golpes a suspensión y llantas, reparaciones, gastado, mejor racha, "por poquito" y el reto en turno. Se despide con una garantía válida "hasta el siguiente bache".

## Una simulación que el renderizador no puede tocar

El motor tiene 226 líneas y no sabe nada de dibujar. Avanza en paso fijo, recibe su generador de números aleatorios como argumento del constructor, y expone estado más un flujo de eventos. Todo lo demás se suscribe.

Esa separación es lo que lo hace testeable, y las pruebas son la parte interesante. Corren veinte campañas con semilla para demostrar que toda secuencia de obstáculos se resuelve solo saltando, repiten los hoyos más anchos con la separación mínima a 20, 24, 30 y 60 cuadros por segundo para demostrar que la física no depende de la tasa de cuadros, y verifican que obstáculos y proyectiles se mantengan acotados por largo que sea el viaje.

Los obstáculos tampoco son aleatorios. Cada avenida tiene un puñado de frases cortas escritas a mano — `patchwork`, `missing-covers`, `jump-or-shoot`, `last-block` — y el motor elige una, la toca completa y deja un tramo de recuperación deliberado antes de la siguiente. El azar vive en la elección y en el ancho de los baches, no en el ritmo. El clima corre en su propio calendario, ajeno a los obstáculos: la lluvia empieza a los 24 segundos y se vuelve más larga y más frecuente por avenida, y el día se desliza hacia la noche sobre una curva de distancia, donde los faros y una docena de luminarias que se apagan por momentos sostienen la escena.

## Todo está dibujado, nada se carga

No hay texturas, sprites ni modelos en tiempo de ejecución. `scene.ts` construye sus 620 líneas de mundo con geometría plana de Three.js bajo una cámara ortográfica: el Tsuru, sus ruedas girando y el recorrido de la suspensión, la ciudad en paralaje, el corte de tierra poco profundo bajo la calle con sus huesos dispersos y bolsas de agua, y el Nevado de Toluca en la capa más lejana. Los monumentos aparecen como cameos estilizados detrás de los edificios comunes — Torres Bicentenario, la Catedral y Los Portales, el Cosmovitral, el Teatro Morelos, el Nemesio Díez. Es un panorama comprimido, no un mapa de calles; en el repositorio hay un Tsuru de Blender que sirve de referencia de forma y nunca se publica.

El audio se genera igual. Un script de Python de 24 líneas sintetiza cada sonido — salto, aterrizaje, golpe, disparo, destrucción, el motor en ciclo y una melodía de 32 notas — directo a archivos WAV. Sin samples, sin licencias.

Hacer que eso corriera en un teléfono fue el trabajo de verdad. Expo GL necesita `gl.flush()` antes de presentar o el cuadro nunca aparece, y medir el rendimiento es su propia trampa: `gl.finish` también se encola, así que una primera lectura de 60 FPS era la tasa de envío de comandos, no de cuadros mostrados. Bloquear JavaScript con un `gl.getParameter` después reveló el número honesto, y el arreglo fue desactivar la gestión de color de Three para arte plano en RGB de pantalla y renderizar a un destino acotado de 540 píxeles de alto.

## Escrito por un agente, y documentado

El juego lo construyó de principio a fin un agente de IA, y el repositorio está organizado para mantener eso honesto. Un documento de requisitos guarda las decisiones confirmadas y marca todo lo demás como propuesta. Un archivo de memoria carga las restricciones que una sesión nueva no podría volver a deducir. Un archivo de validación separa lo que de verdad se observó de lo que solo se supuso — que es donde fue a morir ese falso número de 60 FPS, junto a una nota explícita de que el juego en Android y el rendimiento en hardware físico siguen sin verificarse.

La verificación corrió con las mismas herramientas: un agente manejando un simulador de iOS y un navegador por automatización de dispositivo, jugando campañas completas, tomando capturas y leyendo tasas de cuadros. El resultado se publica como export web de Expo sobre Cloudflare Workers, y por eso un juego escrito para teléfonos abre de inmediato en una pestaña.
