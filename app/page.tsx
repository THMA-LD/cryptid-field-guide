"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    onError: (err) => console.error(err),
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Streamdown
                    key={`${message.id}-${i}`}
                    animated
                    plugins={{ code }}
                    isAnimating={status === "streaming"}
                  >
                    {part.text}
                  </Streamdown>
                );
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <Input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
