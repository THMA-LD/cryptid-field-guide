"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Suggestion } from "@/components/ai-elements/suggestion";
import { Input } from "@/components/ui/input";
import { PawPrint } from "lucide-react";

const EXAMPLE_QUESTIONS = [
  "Where would I find the Ash River Howler?",
  "What does the Redcap Elk eat?",
  "Which two cryptids are most likely to compete for food, and why?",
  "Which cryptids are carnivorous versus omnivorous or herbivorous, and what does that imply about where they hunt or forage?",
];

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    onError: (err) => console.error(err),
  });

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-6">
      <div className="flex h-[min(640px,100%)] w-full max-w-lg flex-col overflow-hidden rounded-lg border">
        <Conversation className="min-h-0">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState>
                <PawPrint className="size-12 text-muted-foreground" />
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Ask about a cryptid</h3>
                  <p className="text-muted-foreground text-sm">
                    Search the field guide for habitats, diets, and sightings
                  </p>
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <MessageResponse key={`${message.id}-${i}`}>
                              {part.text}
                            </MessageResponse>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="flex flex-col gap-2 border-t p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <Input
              value={input}
              placeholder="Ask something..."
              onChange={(e) => setInput(e.currentTarget.value)}
            />
          </form>

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((question) => (
              <Suggestion
                key={question}
                suggestion={question}
                onClick={(text) => sendMessage({ text })}
                className="h-auto max-w-full shrink whitespace-normal text-left"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
