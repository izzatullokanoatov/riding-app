# Horse Racing Game

An interactive horse racing simulation game built with Vue 3, TypeScript, Vuex, and Tailwind CSS.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright)

## Features

- **20 Unique Horses**: Each horse has a unique name, color, and condition score (1-100)
- **6 Race Rounds**: Progressive distances from 1200m to 2200m
- **Real-time Animation**: Smooth horse movement with SVG animations
- **Race Results**: Accurate results based on actual finish times
- **Pause/Resume**: Control the race at any time
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript
- **State Management**: Vuex 4 with typed modules
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components (HorseIcon)
│   ├── horse/            # Horse-related components
│   ├── layout/           # Layout components (AppHeader)
│   └── race/             # Race components (Track, Schedule, Results)
├── composables/          # Vue composables for typed store access
├── constants/            # Game constants and configuration
├── store/
│   └── modules/          # Vuex store modules (horses, race)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── __tests__/            # Unit tests
e2e/                      # End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd horse-racing-app

# Install dependencies
npm install

# Install Playwright browsers (for e2e tests)
npx playwright install chromium
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build

```bash
# Type-check and build for production
npm run build

# Preview production build
npm run preview
```

## Testing

### Unit Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Run e2e tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## Code Quality

```bash
# Lint and fix
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Game Rules

1. **Horses**: 20 horses with unique colors and condition scores (1-100)
2. **Rounds**: 6 rounds with increasing distances:
   - Round 1: 1200m
   - Round 2: 1400m
   - Round 3: 1600m
   - Round 4: 1800m
   - Round 5: 2000m
   - Round 6: 2200m
3. **Selection**: 10 random horses are selected for each round
4. **Speed**: Horse speed is influenced by condition score and randomness
5. **Results**: Horses are ranked by their actual finish time

## Architecture Decisions

### State Management
- **Vuex 4** with namespaced modules for horses and race state
- **Typed composables** (`useHorsesStore`, `useRaceStore`) for type-safe store access
- **Centralized constants** for maintainability

### Component Design
- **Single Responsibility**: Each component has one clear purpose
- **Composition API**: Using `<script setup>` for cleaner code
- **Typed Props**: Full TypeScript support with interfaces

### Testing Strategy
- **Unit Tests**: Utils, store modules, and components
- **E2E Tests**: Full user flows with Playwright
- **103+ unit tests** and **22 e2e tests**

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests (watch mode) |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run quick e2e tests (~20s) |
| `npm run test:e2e:full` | Run all e2e tests including slow race tests |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type checking |

## License

MIT
# horse-racing-app
