---
title: 6 extensiones esenciales de VS Code
date: 2022-07-21
extract: Mejora tu forma de programar con 6 extensiones esenciales de VS Code, incluyendo GitHub Copilot o Tabnine como bonus.
technical: true
translationKey: vscode-extensions
---

# 6 extensiones esenciales de VS Code

Ya sea que apenas estés empezando a programar, que te hayas cambiado a VS Code o que ya tengas experiencia con él, a todos nos sirve descubrir —o redescubrir— herramientas que nos hagan más productivos y más seguros al escribir código.

## ESLint y Prettier

Este par es muy básico y nos ayuda a escribir código de forma más consistente. Prettier zanja el formato —comillas, espaciado, ancho de línea— para que nadie lo discuta en la revisión. ESLint atrapa lo que no es estilo en absoluto: una variable sin usar, una dependencia que falta en un hook, una promesa que nadie esperó.

Las extensiones solo muestran lo que tu proyecto ya decide. Leen la configuración del repositorio, así que antes de instalar nada, agrégalos al proyecto mismo y asegúrate de que todos los que colaboran tengan las mismas reglas.

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

Import Cost escribe el peso de cada import junto a la línea misma, así que el costo aparece mientras escribes y no después de analizar el bundle. Traerte todo lodash por un solo `debounce` se ve muy distinto cuando el número está ahí, al margen.

Así que por favor, por el bien de tus usuarios y para evitar quemar dinero, vigilemos cuántos K estamos usando en nuestros proyectos.

## GitLens

Al trabajar en un proyecto grande con distintos colaboradores, un historial largo de commits y mucho código, GitLens es una gran herramienta para ver la historia de nuestro código, culpar a quien lo haya roto (normalmente uno mismo), leer ese historial de forma más clara, navegar entre los últimos PRs y más.

La parte que más uso es el blame en línea: el autor y el mensaje del commit que tocó por última vez la línea actual, mostrados al final de ella. Casi siempre la pregunta no es _quién_ escribió una línea sino _por qué_, y el mensaje del commit es el camino más corto a esa respuesta.

## CodeMetrics

Siempre sabemos cuándo nuestro código apesta, pero CodeMetrics lo deja claro cuando no estamos siguiendo las buenas prácticas. Califica la complejidad ciclomática de cada función justo encima de ella, lo que convierte una sensación vaga en un número con el que puedes discutir.

![Complejidad 20](/images/complexity-20.webp)

> Podemos ver que este componente es demasiado complejo y deberíamos refactorizarlo.

![Complejidad 6](/images/complexity-6.webp)

> Ahh, mucho mejor. Componentes más pequeños, más fáciles de leer y entender.

## Code Spell Checker

Siempre podemos mejorar nuestra escritura, pero en el código una falta de ortografía es importante detectarla a tiempo. Imagina intentar refactorizar un `recieveMessage` que está escrito de tres formas distintas a lo largo del código, o buscar `length` en un archivo donde alguien tecleó `lenght`: la búsqueda no devuelve nada y el error se queda escondido.

Solo revisa identificadores, comentarios y cadenas, y entiende camelCase, así que lee `recieveMessage` como dos palabras y señala únicamente la equivocada.

## Bonus

## GitHub Copilot

Copilot es un proyecto increíble construido sobre los modelos de OpenAI. Sugiere líneas y funciones completas mientras escribes, y da lo mejor de sí en las partes aburridas: un caso de prueba parecido a los tres anteriores, una función de mapeo, la quinta variación de un manejador de formulario.

Trátalo como un autocompletado con opiniones, no como un autor. Es seguro de sí mismo cuando se equivoca, y revisar una sugerencia que no pensaste antes es más lento que escribir la línea tú mismo.

Una buena alternativa, si prefieres que tu código no salga de tu máquina, es Tabnine: ofrece un modelo que corre en local.
