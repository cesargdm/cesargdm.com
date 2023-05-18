---
title: Mejor
tags: [stale, web3, react]
date: 2022
url: https://mejor.tonim.xyz
description: Open source no-code generative art tool
---

# Mejor

While planning the creation of [They Xolo](https://theyxolo.art) I scoped around multiple generative art engines, I came up with a popular library named [Hashlips](https://github.com/HashLips) while it was an amazing open sourced tool it was terribly slow, at first I navigated thru it's source code to understand how it worked, after some iterations I came up with some simple optimizations, serialization with [NodeJS Worker Threads](https://nodejs.org/api/worker_threads.html), using a better optimized library for image manipulation [Sharp](https://sharp.pixelplumbing.com/) instead of [NodeJS canvas](https://www.npmjs.com/package/canvas), just with that, I came up with 3x faster times for a +2,000 item generation.

> Some image benchmark will be here anytime soon

So with these optimizations, I wanted to create a simple JSON to set the configuration for the collection generation, the collection PFPs where ready.

...

But it could not end there, I wanted more. So I started developing a UI for this, no need to a JSON to set the settings. Now the idea would be for anyone to configure their collection without coding skills. Collection name, PFPs name templates, layer rules, etc. everything was comming together, at the time some other tools where starting to surge, [Bueno](https://bueno.art/) (thus our name) and some others. But they were being really expensive, my proposal was open source and free. In order to support this requirements, the architecture would need to be really cheap to mantain, so in order to match that I would need to move the image generation serverless, moving the architecture to lambdas and event procedures I migrated the logic of image generation to a easy to mantain and cheap solution.

![Template settings screen](https://user-images.githubusercontent.com/10179494/193832066-232b7c19-be2e-44de-bbf7-5afe56c345aa.png)

![Layer settings screen](https://user-images.githubusercontent.com/10179494/193832076-838f5fa9-4fe3-4499-825d-71cad3b69571.png)

After the successful release of They Xolo the project came to a stale state, some other functionality that I would love to deliver like smart contract configuration and deployment, minting for non-generative artworks, minting site are still being on my wishlist.

[(PRs are welcome!)](https://github.com/theyxolo/mejor)
