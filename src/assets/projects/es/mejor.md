---
title: Mejor
description: Herramienta de arte generativo no-code y de código abierto, hecha con NodeJS.
date: 2022
url: https://mejor.tonim.xyz
repository:
  url: https://github.com/theyxolo/mejor
  stars: 2
tags: [web3, react]
---

# Mejor

Mientras planeaba la creación de [They Xolo](https://theyxolo.art) revisé varios motores de arte generativo y di con una librería popular llamada [Hashlips](https://github.com/HashLips). Era una herramienta open source estupenda, pero terriblemente lenta. Al principio recorrí su código para entender cómo funcionaba y, después de algunas iteraciones, llegué a un par de optimizaciones simples: serialización con [Worker Threads de NodeJS](https://nodejs.org/api/worker_threads.html) y una librería mejor optimizada para manipular imágenes, [Sharp](https://sharp.pixelplumbing.com/), en lugar del [canvas de NodeJS](https://www.npmjs.com/package/canvas). Solo con eso conseguí tiempos 3 veces más rápidos para generar más de 2,000 piezas.

Con esas optimizaciones quise crear un JSON simple para configurar la generación de la colección, y los PFPs quedaron listos.

...

Pero no podía terminar ahí, quería más. Así que empecé a desarrollar una interfaz para esto, sin necesidad de un JSON para definir la configuración. Ahora la idea era que cualquiera pudiera configurar su colección sin saber programar: nombre de la colección, plantillas para los nombres de los PFPs, reglas de capas, etcétera. Todo iba tomando forma. Por entonces empezaban a surgir otras herramientas, [Bueno](https://bueno.art/) (de ahí nuestro nombre) y algunas más, pero eran realmente caras; mi propuesta era open source y gratuita. Para sostener esos requisitos, la arquitectura tenía que ser muy barata de mantener, así que necesitaba mover la generación de imágenes a algo serverless: migré esa lógica a lambdas y procedimientos por eventos, una solución barata y fácil de mantener.

![Pantalla de configuración de plantillas](https://user-images.githubusercontent.com/10179494/193832066-232b7c19-be2e-44de-bbf7-5afe56c345aa.png)

![Pantalla de configuración de capas](https://user-images.githubusercontent.com/10179494/193832076-838f5fa9-4fe3-4499-825d-71cad3b69571.png)

Tras el lanzamiento exitoso de They Xolo el proyecto quedó estancado. Otras funcionalidades que me encantaría entregar —configurar y desplegar contratos inteligentes, minteo para obras no generativas, un sitio de minteo— siguen en mi lista de deseos.

[(¡Los PRs son bienvenidos!)](https://github.com/theyxolo/mejor)
