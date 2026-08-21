---
title: 6 extensiones esenciales de VS Code
date: 2022-07-21
extract: Mejora tu forma de programar con 6 extensiones esenciales de VS Code, incluyendo GitHub Copilot o Tab9 como bonus.
technical: true
translationKey: vscode-extensions
---

# 6 extensiones esenciales de VS Code

Ya sea que apenas estés empezando a programar, que te hayas cambiado a VS Code o que ya tengas experiencia con él, a todos nos sirve descubrir —o redescubrir— herramientas que nos hagan más productivos y más seguros al escribir código.

## ESLint y Prettier

Esta es una herramienta muy básica que nos ayuda a escribir código de forma más consistente.

> Imagen de código con advertencias, errores y mal formato

Ten en cuenta que probablemente quieras tenerlos ya ... proyecto y tener ambos instalados.

```bash
npm install --dev prettier eslint
```

Y con un conjunto de reglas de eslint y prettier ya existentes: hay muchos estándares por ahí, pero puedes usar estos que ya dejé probados en equipo.

```bash
npm install --dev eslint-config-cretia prettier-config-cretia
```

Y solo modifica tu `package.json` para incluir las siguientes líneas

```json
{
  ...,
  "prettier": "prettier-config-cretia",
  "eslint-config": {
    "extends": "eslint-config-cretia"
  }
}
```

> PD: también puede que quieras actualizar tus preferencias de formato en VS Code, para que al guardar el archivo se formatee automáticamente.

## Import Cost

Cuando trabajamos en código de frontend deberíamos ser cuidadosos con la cantidad de código que importamos; librerías populares pero pesadas como lodash o moment.js todavía se ven por ahí.

> IMAGEN de usar lodash, moment y node, :(

Así que por favor, por el bien de tus usuarios y para evitar quemar dinero, vigilemos cuántos K estamos usando en nuestros proyectos.

## GitLens

Al trabajar en un proyecto grande con distintos colaboradores, un historial largo de commits y mucho código, GitLens es una gran herramienta para ver la historia de nuestro código, culpar a quien lo haya roto (normalmente uno mismo), leer ese historial de forma más clara, navegar entre los últimos PRs y más.

> Meme de Spider-Man con el texto de quién introdujo este bug.

## CodeMetrics

Siempre sabemos cuándo nuestro código apesta, pero CodeMetrics lo deja claro cuando no estamos siguiendo las buenas prácticas.

![Complejidad 20](/images/complexity-20.webp)

> Podemos ver que este componente es demasiado complejo y deberíamos refactorizarlo.

![Complejidad 20](/images/complexity-6.webp)

> Ahh, mucho mejor. Componentes más pequeños, más fáciles de leer y entender.

## Code Spell Checker

Siempre podemos mejorar nuestra escritura, pero en el código una falta de ortografía es importante detectarla a tiempo; imagina intentar refactorizar

## Bonus

## GitHub Copilot

Copilot es un proyecto increíble que usa GPT-3…
Una buena alternativa por si no consigues la beta ahora mismo es Tab9
