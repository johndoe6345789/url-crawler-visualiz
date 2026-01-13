# JSON URL Crawler

A visual JSON URL crawler that fetches JSON from a URL, recursively discovers and fetches nested URLs (including relative paths), and presents an interactive graph visualization of the discovered URL network.

## 🚀 Features

- **URL Input & Validation** - Accept a URL input that returns JSON data
- **JSON Crawling Engine** - Recursively walk JSON objects/arrays to find URL strings, resolve relative URLs, fetch them, and continue the process
- **Interactive Graph Visualization** - Display discovered URLs as an interactive force-directed graph with nodes (URLs) and edges (relationships)
- **URL Details Panel** - Show detailed information about selected URL (status code, response time, JSON preview, discovered URLs)
- **Crawl Progress Indicator** - Real-time display of crawl status (URLs queued, fetched, failed)
- **Headers Configuration Panel** - Configure custom HTTP headers for API requests

## 🏃 Local Development

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🚢 Deployment

This project is automatically deployed to two platforms:

### GitHub Pages
The application is automatically deployed to GitHub Pages on every push to the `main` branch.

**Live URL**: `https://johndoe6345789.github.io/url-crawler-visualiz/`

The GitHub Pages deployment is handled by the `.github/workflows/pages.yml` workflow.

### GitHub Container Registry (GHCR)
A Docker image is automatically built and pushed to GHCR on every push to the `main` branch.

**Image**: `ghcr.io/johndoe6345789/url-crawler-visualiz:main`

To run the Docker container locally:
```bash
docker pull ghcr.io/johndoe6345789/url-crawler-visualiz:main
docker run -p 8080:80 ghcr.io/johndoe6345789/url-crawler-visualiz:main
```

The container deployment is handled by the `.github/workflows/docker.yml` workflow.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
