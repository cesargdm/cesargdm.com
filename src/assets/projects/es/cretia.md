---
title: Cretia
date: 2017
description: ERP para pequeñas y medianas empresas en México, gastos, ventas, inventario, pagos y más.
url: https://www.cretia.app
highlight:
  logoUrl: 'https://web.cretia.app/maskable-icon.png'
  color: '#dddddd'
tags: [react-native, nodejs, graphql, mongodb]
---

# Cretia

Creatia ha sido mi proyecto más grande de todos, he aprendido en este proyecto como en ningún otro.

## Aplicación Web

![Página de inicio de sesión](https://user-images.githubusercontent.com/10179494/171282225-07fdd1e1-6c8c-4f01-9e6f-a443142f18ef.png)

> Página de inicio de sesión

Comenzó como un proyecto simple, una pequeña utilidad para la empresa de control de plagas de mi papá, la primera iteración fue usando el framework más popular en ese momento, AngularJS, estamos hablando alrededor de 2016; a medida que evolucionó, investigué y utilicé varias tecnologías como Redux, css-modules, css flex y grid, Angular 2, Svelte, Watermelon DB para la aplicación móvil, y también me hizo aprender Swift con CoreData. Actualmente utiliza tecnologías de vanguardia como React, NodeJS, GraphQL, Docker, MongoDB, servicios de AWS, React Native y mucho más.

Cretia es ahora un negocio SaaS con más de 16 módulos diferentes que resuelven distintos problemas de las empresas, aunque comenzó enfocándose en empresas de control de plagas, también es un CRM para pequeñas empresas mexicanas; se comprende en una aplicación móvil, dos aplicaciones web para diferentes usuarios y un conjunto de microservicios y una API GraphQL.

Algunos de sus puntos destacados son:

- Mecanismos de autenticación personalizados, sin Auth0
- Mecanismos especiales de inicio de sesión incluyendo Apple, Google, MagicLink y WebAuthn.
- PWA con todas las funciones
- Soporte multilenguaje
- Aplicación móvil lista para funcionar sin conexión que sincroniza datos cuando hay red disponible

![Vista del panel de control](https://user-images.githubusercontent.com/10179494/171282289-f483a0f2-8ce0-445c-94e1-b8eb2687de2f.png)

> Vista del panel de control

Actualmente sirve a poco más de 50 usuarios pero sigue creciendo. Nuestro objetivo es convertirlo en el sistema ERP más hermoso y fácil de usar para pequeñas empresas en México.

Puedes obtener más información sobre Cretia en nuestro [sitio web](https://www.cretia.app/)

## API de NodeJS

La API consiste en una API GraphQL que sirve a la aplicación web y a la aplicación móvil, la base de datos es servida por MongoDB en MongoDB Cloud y los servidores Node están alojados en AWS a través del servicio SCS.

## Aplicación Móvil

La aplicación móvil está desarrollada en React Native y utiliza Apollo Client para comunicarse con la API GraphQL y soportar capacidades offline. Tiene un módulo de comunicación Peer to Peer en iOS.
