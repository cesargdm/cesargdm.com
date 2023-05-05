---
title: Cretia
tags: [active, react, graphql, nodejs]
description: ERP for small and medium sized companies in Mexico
url: https://www.cretia.app
---

# Cretia

Creatia has been my biggest baby of them all, I've learned in this project like in no other.

## Web App

<img
	alt="Screen Shot 2022-05-31 at 3 27 43 PM"
	src="https://user-images.githubusercontent.com/10179494/171282225-07fdd1e1-6c8c-4f01-9e6f-a443142f18ef.png"
/>

> Sign in page

It started as a simple project, a small utility for my dad's pest control company, the first iteration was using the most poppular framework at the time, AngularJS, we're talking around 2016; as it evolved I researched and used several technologies like Redux, css-modules, css flex and grid, Angular 2, Svelte, Watermelon DB for the mobile app, and also it made me learn Swift with CoreData. Currently it uses cutting edge technologies like React, NodeJS, GraphQL, Docker, MongoDB, AWS services, React Native, and a lot more.

Cretia is now a Sass bussiness with over 16 different modules that solve different issues of bussinesses, even tho it started it's focus on Pest Control companies, it's also a CRM for small Mexican businesses; it's comprehended on a Mobile App, two Web Applications for different users and a set of microservices and one GraphQL API.

Some of it's highlights are:

- Custom authentication mechanisms, no Auth0
- Special sign-in mechanisms including Apple, Google, MagicLink and WebAuthn.
- Fully featured PWA
- Multi-language support
- Offline-ready mobile app that syncs data when network is available

<img
	alt="Screen Shot 2022-05-31 at 3 30 22 PM"
	src="https://user-images.githubusercontent.com/10179494/171282289-f483a0f2-8ce0-445c-94e1-b8eb2687de2f.png"
/>

> Dashboard view

Currently it serves a little over 50 users but it's still growing. We are aiming to convert it to the most beautiful and easiest to use ERP system for small businesses in Mexico.

You can get more information about Cretia in our [website](https://www.cretia.app/)

## NodeJS API

The API consists of a GraphQL API that serves the web app and the mobile app, database is served by MongoDB at MongoDB Cloud and the Node servers are hosted in AWS thru the SCS service.

## Mobile App

The mobile app is developed in React Native and it uses the Apollo Client to communicate with the GraphQL API and support offline capabilities. It has a Peer to Peer communication module on iOS.
