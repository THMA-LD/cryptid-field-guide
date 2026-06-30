import {
  streamText,
  stepCountIs,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
} from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";
import { docs } from "./docs";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  //   You have access to a search tool that can be used to find relevant information from ___. If you don't know the answer, you should say "I don't know."

  const result = streamText({
    model: openai("gpt-5.1"),
    system: `You are a cryptid field guide that can answer questions about cryptids and other mysterious creatures.

    # General Instructions
    - Write clearly in Markdown. Use formatting (bold, italics, lists, horizontal lines, blockquotes) for clarity and readability with short paragraphs. Use bullets, numbered lists sparingly and avoid nested lists. Maintain a conversational tone.
    - Keep responses brief (< 100 words) and concise. Avoid unnecessary repetition or filler content. Focus on providing relevant information.

    # Tool Use
    You have access to a search tool that can be used to find relevant information from the provided cryptid field guide. Always use this when answering questions about cyptids or other creatures, don't rely on internal training data. If you don't know the answer based on the documents returned from this search tool, disclose to the user that you don't know.

    After calling this tool, you should always summarize the results and provide a clear answer to the user. If the search results are not relevant to the user's question, you should say "I don't know."
    `,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    providerOptions: {
      openai: {
        store: false,
        include: ["reasoning.encrypted_content"],
        reasoningEffort: "none",
        reasoningSummary: "auto",
      },
    },
    tools: {
      search: tool({
        description: "Search local resources for relevant information.",
        inputSchema: z.object({
          query: z.string().describe("The search query."),
        }),
        outputSchema: z
          .array(
            z.object({
              id: z
                .string()
                .describe("The unique identifier of the search result."),
              title: z.string().describe("The title of the search result."),
              text: z
                .string()
                .describe("The text content of the search result."),
            }),
          )
          .describe("The search results."),
        execute: async () => {
          // NOTE: This is an extremely naive search implementation that always returns all documents. Searching and filtering based on `query` is out-of-scope for this sample app.
          return docs;
        },
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
