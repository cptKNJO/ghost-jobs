# Job Application Tracker

## Development

Follow these steps to set up and run the development environment:

1.  **Start the Supabase server:**
    ```sh
    pnpm dev:supa
    ```
    This starts the local Supabase containers and services.

2.  **Start the Next.js app:**
    ```sh
    pnpm dev
    ```
    The web application will be available at `http://localhost:3000`.

3.  **Start the test server (Playwright UI):**
    ```sh
    pnpm test:e2e:ui
    ```
    This opens the Playwright test runner UI to run and debug end-to-end tests.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app built with [react-native-web](https://necolas.github.io/react-native-web/)
- `@repo/ui`: a stub [react-native](https://reactnative.dev/) component library shared by both `web` and `native` applications
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
