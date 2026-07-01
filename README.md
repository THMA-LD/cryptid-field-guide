# Cryptid Field Guide

Cryptid Field Guide is an AI chat app that uses an internal repository of documents to tell the user about fictional cyptids and other mysterious creatures.

## Project Structure

The LLM chat handler is implemented at `app/api/chat/route.ts`. It is enhanced by local docs in `app/api/chat/docs.ts` which are fetched by a `search` tool. These documents are intentionally fictional so that you can clearly see them referenced by the LLM.

Here are some questions that will trigger search and document reference:

- Where would I find the Ash River Howler?
- What does the Redcap Elk eat?
- Which two cryptids are most likely to compete for food, and why?
- Which cryptids are carnivorous versus omnivorous or herbivorous, and what does that imply about where they hunt or forage?

The chat interface is located at `app/page.tsx`.

## Getting Started

This is a [Next.js](https://nextjs.org) project.

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI Usage

This project is set up to use Open AI as an LLM provider.

To get this working, copy the .env example:

```
cp .env.example .env.local
```

And add your `OPENAI_API_KEY`.

If you prefer to use a different provider, follow the [AI SDK docs](https://ai-sdk.dev/providers/ai-sdk-providers)
