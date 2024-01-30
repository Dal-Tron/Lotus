# Getting Started

## Dependencies

- React
- TypeScript
- Tailwind CSS
- Supabase

## Available Scripts

In the project directory, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

To build, use this command:

```bash
npm run build
# or
yarn build
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Project structure

- `src/` - Main part of the app

  - `components/` - React components

    - `common/` - common components
    - `elements/` - components specific to pages
    - `modules/` - section components for pages
    - `scenes/` - main contents for pages

  - `pages/` - Page components
  - `layouts/` - layout components

## Architecture guides

### Components

- Try to keep it modular - one component should be one directory that includes two files.

- Keep a **flat** components folder structure - do not nest components inside other components folders

- Code, independent of state and props should be moved outside component body

- In general components should countain only ui logic

- Try to keep definition order inside component body:
  1. State - useState, useFetchedData, etc.
  2. Calculated variables from state and props
  3. Functions reused in the component, e.g. event handlers
  4. useEffect
  5. Render

### Tailwind CSS classes

Order: Out-to-in

- position
- display
- width, height
- border
- margin
- padding
- text
  - font-size
  - color
- background-color
- cursor
- opacity
- duration
