# cesargdm.com

[![Build](https://github.com/cesargdm/cesargdm.com/actions/workflows/integration.yml/badge.svg)](https://github.com/cesargdm/cesargdm.com/actions/workflows/integration.yml)

Welcome to the repository for my personal website, [cesargdm.com](https://cesargdm.com). This site serves as a digital hub for my work, thoughts, and projects. It's designed to be fast, responsive, and easy to navigate, leveraging modern web technologies.

## Features

- 🌍 **Internationalization**: The site supports multiple languages, offering a global user experience.
- 🖼️ **Dynamic OG Image Generation**: Open Graph images are generated on-the-fly to ensure social sharing looks great every time.
- 📄 **Markdown-Driven Content**: All content is sourced from Markdown files, making it easy to update and manage.
- 🔍 **Algolia Search Integration**: The site is fully searchable, thanks to Algolia, providing fast and relevant search results.
- 🧑‍⚖️ **MIT License**: This project is open-source under the MIT License, encouraging community contributions.
- 🏆 **Perfect Lighthouse Score**: Achieved a perfect score on Google's Lighthouse performance test, ensuring optimal speed, accessibility, and SEO.
- 🤖 **Workers AI assistant**: An on-site chat powered by Cloudflare Workers AI, answering in César's voice.
- 💅 **Zero Runtime CSS**: The site is styled with vanilla CSS, with no runtime dependencies, ensuring fast load times.

## Getting Started

### Development

To start the development server, run:

```bash
bun dev
```

Then, open http://localhost:4321 in your browser to view the site. The root path redirects to `/en` or `/es`.

Without Cloudflare credentials, use a local preview that skips remote bindings (Workers AI chat will not work):

```bash
bun run build
ASTRO_CF_NO_REMOTE=1 bun run preview
```

### Build

To build the project for production, use:

```bash
bun run build
```

This produces the Worker and static assets in `dist/`. Deploy with:

```bash
bunx wrangler deploy
```

## Benchmarks

### Lighthouse

The site has achieved a perfect score on Lighthouse, a tool by Google that audits performance, accessibility, best practices, and SEO.

<img width="400" alt="Screenshot 2024-08-20 at 11 54 26 p m" src="https://github.com/user-attachments/assets/c27abfdc-3d68-4276-9ffe-676c0019b7a4">

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page for existing issues or open a new one.

## Acknowledgments

- Cloudflare Workers for hosting and Workers AI.
- Astro for the web framework (React islands for interactivity).
- Algolia for search capabilities.
