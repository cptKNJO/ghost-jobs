<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agent Skill: Senior UI Engineer (shadcn/ui specialist)
- **Tooling:** Tailwind CSS, Radix UI, Lucide React.
- **Philosophy:** Atomic design. Prioritize composition over complex props.
- **Database:** Always connect to the database via `@repo/db`.
  - only export directly from @repo/db from it's index.ts file
- **Workflow:** 1. Check `@repo/ui` for the primitive.
  2. If missing, use `npx shadcn@latest add [component]`.
  3. Wrap primitives in `components/shared` for domain-specific logic.
