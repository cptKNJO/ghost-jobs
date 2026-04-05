# NextJS Views Implementation Plan: Modern Job Application Tracker

This document serves as a reference for the design and implementation of the Next.js views using shadcn/ui and Tailwind CSS v4.

## Goals
- Establish a modern, clean visual identity using `shadcn/ui`.
- Implement a responsive navigation system.
- Create a high-conversion homepage with clear CTAs.
- Adhere to the project's atomic design philosophy and "Universal TypeScript" standards.

## 1. UI Primitives (@repo/ui)
The following shadcn components will be added or verified in the shared UI package:
- `NavigationMenu`: For the main desktop navbar.
- `Sheet`: For the mobile navigation drawer.
- `DropdownMenu`: For user settings and profile actions.
- `Button`, `Card`, `Input`: Existing primitives to be used for layout and forms.

**Exports:** All components must be exported via `packages/ui/src/components/ui/index.tsx` (or similar) to be accessible as `@repo/ui/components/[name]`.

## 2. Shared Layout Components (apps/web)
- **Navbar (`src/components/shared/navbar.tsx`)**:
    - Sticky top positioning with a subtle blur/glass effect.
    - Branding: "JobTracker" (using a bold, modern font).
    - Desktop Links: Features, pricing, roadmap.
    - Right-side Actions: "Login" (Ghost button) and "Get Started" (Primary button).
    - Mobile: Hamburger menu opening a `Sheet` with vertical navigation.

- **Footer (`src/components/shared/footer.tsx`)**:
    - Minimalist design with copyright, social links, and legal pages.

## 3. Page Implementations

### Homepage (`src/app/page.tsx`)
- **Hero Section**:
    - Large, bold headline: "Land Your Dream Job, Organized."
    - Supporting text: "The ultimate application tracker for modern software engineers. Sync your progress, manage interviews, and track offers in one place."
    - CTAs: Primary "Get Started" and Outline "View Demo".
- **Features Grid**:
    - Using `Card` components to highlight key functionality (Kanban board, automated reminders, AI insights).
- **Social Proof/Stats**:
    - Simple row showing "10,000+ Applications Tracked" or similar placeholders.

### Layout Update (`src/app/layout.tsx`)
- Integrate `Navbar` and `Footer`.
- Ensure proper spacing using a main container: `<main className="flex-1 container mx-auto px-4 py-8">`.

## 4. Design Tokens & Styling
- **Colors**: Use `oklch` semantic tokens (`primary`, `muted-foreground`, etc.) defined in the `@repo/ui` global CSS.
- **Spacing**: Follow a strict 4px/8px grid system.
- **Typography**: Geist Sans for body text, Geist Mono for code or technical labels.

## 5. Verification Workflow
1. **Linting**: `pnpm turbo lint` to ensure no styling or type regressions.
2. **Responsive Check**: Test across mobile, tablet, and desktop breakpoints.
3. **Accessibility**: Ensure buttons have labels and navigation is keyboard-navigable.
