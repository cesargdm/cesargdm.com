---
title: Cretia
tags: [active, react, graphql, nodejs]
date: 2017-01-01
description: ERP for small and medium sized companies in Mexico, expenses, sales, inventory, payments and more.
url: https://www.cretia.app
highlight:
  logoUrl: 'https://cretia.app/maskable-icon.png'
  color: '#dddddd'
---

# Cretia

Creatia has been my biggest baby of them all, I've learned in this project like in no other.

## Web App

![Sign in page](https://user-images.githubusercontent.com/10179494/171282225-07fdd1e1-6c8c-4f01-9e6f-a443142f18ef.png)

> Sign in page

It started as a simple project, a small utility for my dad's pest control company, the first iteration was using the most popular framework at the time, AngularJS, we're talking around 2016; as it evolved I researched and used several technologies like Redux, css-modules, css flex and grid, Angular 2, Svelte, Watermelon DB for the mobile app, and also it made me learn Swift with CoreData. Currently it uses cutting edge technologies like React, NodeJS, GraphQL, Docker, MongoDB, AWS services, React Native, and a lot more.

Cretia is now a Sass bussiness with over 16 different modules that solve different issues of bussinesses, even tho it started it's focus on Pest Control companies, it's also a CRM for small Mexican businesses; it's comprehended on a Mobile App, two Web Applications for different users and a set of microservices and one GraphQL API.

Some of it's highlights are:

- Custom authentication mechanisms, no Auth0
- Special sign-in mechanisms including Apple, Google, MagicLink and WebAuthn.
- Fully featured PWA
- Multi-language support
- Offline-ready mobile app that syncs data when network is available

![Dashboard view](https://user-images.githubusercontent.com/10179494/171282289-f483a0f2-8ce0-445c-94e1-b8eb2687de2f.png)

> Dashboard view

Currently it serves a little over 50 users but it's still growing. We are aiming to convert it to the most beautiful and easiest to use ERP system for small businesses in Mexico.

You can get more information about Cretia in the [website](https://about.cretia.app/).

## APIs

The API is built using GraphQL, which is used to serve both the web and mobile app. The database is hosted on MongoDB Cloud, while the Node servers are hosted on Amazon Web Services (AWS) using the Elastic Container Service (ECS) for scalability.

In addition to this, some microservices are used to handle specific tasks such as sending and receiving emails, listening for Stripe webhooks, and more. This allows for a more efficient and streamlined approach to managing the platform, as these tasks can be handled independently from the main API.

## Mobile App

The mobile application was developed using React Native, a popular framework for creating cross-platform mobile applications. It leverages the Apollo Client to communicate with the GraphQL API, allowing for a more efficient and secure exchange of data. The app also supports offline mode and Peer to Peer communication features on iOS, so that in-field workers can easily distribute the work and synchronize their data without an internet connection.

The initial version of the app was written in Swift and CoreData, but as the requirements of the project grew and the need to support Android devices became apparent, I decided to rewrite the application in React Native. This allowed me to create a single codebase that could be used across multiple platforms, making the development process more efficient and cost-effective.
