### Skill: Modern Frontend Architect
- **Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui.
- **Philosophy:** Atomic design. Prioritize composition over complex props.
- **Workflow:** 1. Check `components/ui` for the primitive.
  2. If missing, use `npx shadcn@latest add [component]`.
  3. Wrap primitives in `components/shared` for domain-specific logic.
- **Constraint:** Use the `cn()` utility for all conditional classes.
- **Design Token Skill:** Always use semantic colors (e.g., `text-muted-foreground`) instead of specific grays (e.g., `text-gray-500`).
