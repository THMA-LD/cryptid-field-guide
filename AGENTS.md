<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

## Project Overview

**Cryptid Field Guide** — a Next.js 16 chat app where users can ask questions about cryptids. An AI assistant (GPT) answers using a local document corpus via tool calls.

## Key Versions (breaking changes likely vs. training data)

| Package              | Version |
| -------------------- | ------- |
| `next`               | 16.2.9  |
| `react`              | 19.2.4  |
| `ai` (Vercel AI SDK) | 7.0.8   |
| `@ai-sdk/react`      | 4.0.9   |
| `@base-ui/react`     | 1.6.0   |
| `tailwindcss`        | 4.x     |
| `zod`                | 4.x     |

## Architecture

```
app/
  page.tsx              # Client component — chat UI
  layout.tsx            # Root layout with Geist fonts
  api/
    chat/
      route.ts          # POST /api/chat — Vercel AI SDK streaming route
      docs.ts           # Static cryptid document corpus (in-memory)
components/
  ui/
    input.tsx           # Shadcn-style Input wrapping @base-ui/react
    button.tsx
lib/
  utils.ts              # cn() helper (clsx + tailwind-merge)
```

## AI SDK Patterns (ai v7 — NOT v3/v4)

The API changed significantly. Key imports from `"ai"` used in this project:

```ts
import {
  streamText,
  stepCountIs,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
} from "ai";
```

- `UIMessage` (not `Message`) is the wire format from the client.
- `convertToModelMessages(messages)` converts `UIMessage[]` to model-compatible messages.
- `toUIMessageStream({ stream: result.stream })` converts the streamText result.
- `createUIMessageStreamResponse(...)` builds the HTTP response.
- `stepCountIs(n)` is the `stopWhen` predicate (not `maxSteps`).

Client hook (`@ai-sdk/react` v4):

```ts
import { useChat } from "@ai-sdk/react";
const { messages, sendMessage, status } = useChat({ ... });
// sendMessage({ text: input }) — NOT append()
// message.parts[].type === "text" — NOT message.content string
```

## UI Primitives

- Components use **`@base-ui/react`** (headless), not Radix UI. APIs differ — check `node_modules/@base-ui/react/` before modifying.
- Styling: **Tailwind CSS v4** — config is in `postcss.config.mjs` and CSS, not `tailwind.config.js`. There is no `tailwind.config.js`.
- `cn()` utility in `lib/utils.ts` for conditional class merging.

## Search / RAG

`app/api/chat/docs.ts` exports a static array of cryptid documents. The `search` tool in `route.ts` currently returns **all docs** regardless of query. To add real search, implement filtering inside the `execute` function — the schema and plumbing are already in place.

## Dev Commands

```bash
npm run dev    # start dev server (Next.js on port 3000)
npm run build  # production build
npm run lint   # eslint
```

## Environment Variables

The route uses `openai("gpt-5.1")` via `@ai-sdk/openai`. Requires `OPENAI_API_KEY` set in the environment (`.env.local`).

## Dos and Don'ts

- **Do** read `node_modules/next/dist/docs/01-app/` before touching routing or server/client boundaries.
- **Do** use `UIMessage` / `sendMessage` / `message.parts` — the old `Message` / `append` / `message.content` pattern is gone in ai v7.
- **Do** use `@base-ui/react` primitives for headless UI, not Radix.
- **Don't** add a `tailwind.config.js` — Tailwind v4 is configured via CSS.
- **Don't** create a `pages/` directory — this project uses the App Router only.
- **Don't** import from `"ai/react"` — use `"@ai-sdk/react"` instead.
