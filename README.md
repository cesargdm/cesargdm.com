# cesargdm.com

[![Build](https://github.com/cesargdm/cesargdm.com/actions/workflows/integration.yml/badge.svg)](https://github.com/cesargdm/cesargdm.com/actions/workflows/integration.yml)

Welcome to the repository for my personal website, [cesargdm.com](https://cesargdm.com). This site serves as a digital hub for my work, thoughts, and projects. It's designed to be fast, responsive, and easy to navigate, leveraging modern web technologies.

## Features

- 🌍 **Internationalization**: The site supports multiple languages, offering a global user experience.
- 🖼️ **Dynamic OG Image Generation**: Open Graph images are generated on-the-fly to ensure social sharing looks great every time.
- 📄 **Markdown-Driven Content**: All content is sourced from Markdown files, making it easy to update and manage.
- 🔍 **Algolia Search Integration**: The site is fully searchable, thanks to Algolia, providing fast and relevant search results.
- 🧑‍⚖️ **MIT License**: This project is open-source under the MIT License, encouraging community contributions.
- 🏆 **Lighthouse**: 100 on accessibility, best practices and SEO. Performance is being worked on — see [Benchmarks](#benchmarks).
- 🤖 **Custom OpenAI Agent**: A custom-built AI agent provides intelligent interactions, enhancing user engagement.
- 💅 **Zero Runtime CSS**: Styled with Vanilla Extract — CSS authored in TypeScript and compiled away at build time, so no styling runtime ships to the browser.

## Getting Started

### Development

To start the development server, run:

```bash
bun dev
```

Then, open http://localhost:3000 in your browser to view the site.

Build
To build the project for production, use:

```bash
bun run build
```

This will generate the static assets ready for deployment.

## Benchmarks

### Lighthouse

Measured on `https://cesargdm.com/en`, mobile preset:

| Category       | Score |
| -------------- | ----- |
| Performance    | 86    |
| Accessibility  | 100   |
| Best Practices | 100   |
| SEO            | 100   |

Reproduce with:

```bash
bunx lighthouse https://cesargdm.com/en --output=json --output-path=./lighthouse.json
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page for existing issues or open a new one.

## Acknowledgments

- Vercel for hosting.
- Next.js for the React framework.
- Algolia for search capabilities.
- OpenAI for AI-powered interactions.
