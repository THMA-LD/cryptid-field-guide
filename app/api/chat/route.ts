import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5.1"),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        store: false,
        include: ["reasoning.encrypted_content"],
        reasoningEffort: "none",
        reasoningSummary: "auto",
      },
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
