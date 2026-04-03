# Taskora Marketplace

Taskora Marketplace is a lightweight, front-end task marketplace UI where users can browse tasks, filter/sort/search listings, save tasks, and start chat threads to coordinate details. It is built as a client-side React application (Create React App) with local persistence via `localStorage`.

## Features

- Task marketplace views: All Tasks, Saved Tasks, My Tasks
- Search, filter, and sort via the top navigation controls
- Create a new task from the marketplace intro and task feed
- Save/unsave tasks (local persistence)
- Inbox notifications (local persistence)
- Chat threads per task (local persistence)
- Settings page for profile defaults (name, country, city, bio) and theme

## Tech Stack

- React 18
- React Router (client-side routing)
- Material UI icons (`@mui/icons-material`)
- Create React App (`react-scripts`)
- Static hosting via `serve` (used by `npm run dev`)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
npm install
```

## Running the App

This project has two common ways to run locally:

### Development (recommended for editing)

Uses Create React App’s development server with fast refresh:

```bash
npm start
```

### Preview (static server)

Serves the production build output using `serve`:

```bash
npm run dev
```

Notes:

- The `dev` script does not provide hot-reload; it serves the compiled production build.
- The script tries port `4173`; if it’s already in use, `serve` will pick another available port.

## Scripts

- `npm start`: CRA dev server (hot reload)
- `npm run build`: production build output
- `npm run dev`: build + serve `build/` via `serve`
- `npm test`: CRA test runner
- `npm run eject`: CRA eject (irreversible)

## Project Structure

High-level structure (most important folders/files):

```
src/
  App.js                  # App state, routing, persistence, context provider
  index.js                # React bootstrap
  context/
    AppContext.js         # App-wide context accessor/provider
  data/
    tasks.js              # Seed task data (default tasks)
  pages/
    marketplace/          # Marketplace pages
    inbox/                # Inbox page
    chat/                 # Chat page
    settings/             # Settings page
  components/
    navbar/               # Top navigation + user menu
    taskFeed/             # Task list/feed and composer toggles
    taskCard/             # TaskItem and task modal
    CreateTask/           # Task creation UI
  utils/
    avatarDataUrl.js      # Avatar helper
```

## Data & Persistence

This app stores user and task state locally using `localStorage` (no backend required by default). Examples include:

- User profile defaults (name, country, city, bio)
- Theme selection
- Tasks list
- Saved tasks
- Inbox items
- Chat threads

If you need real multi-user support, authentication, or server persistence, you can add an API layer and replace these local storage calls with requests.

## Configuration / Environment Variables

No environment variables are required to run this project as-is.

If you introduce environment variables (for example, an API base URL), Create React App reads variables prefixed with `REACT_APP_` (e.g. `REACT_APP_API_BASE_URL`) from `.env` files.

## Deployment

### Build

```bash
npm run build
```

Deploy the generated production output directory to any static hosting provider (Netlify, Vercel static output, Cloudflare Pages, S3/CloudFront, Nginx, etc).

### Serve locally (production build)

```bash
npx serve -s build
```

## Contributing

- Keep changes small and focused.
- Follow existing code style and patterns (components/pages/context separation).
- Run a build before submitting changes:

```bash
npm run build
```
