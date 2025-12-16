"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { TypingBubble } from "@/components/ui/TypingBubble";
import { Typewriter } from "@/components/ui/Typewriter";

export function ChatInterface() {
  const { messages, input, setInput, sendMessage, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      // scrollRef.current.scrollIntoView({ behavior: "smooth" });
      // Getting the scroll area viewport usually requires accessing the underlying primitive or just setting generic ref.
      // For Shadcn ScrollArea, we can target the last message.
      const root = document.getElementById("chat-scroll-area");
      // If the user added overflow-y-auto to the root, it might be the scroll container
      if (
        root &&
        root.scrollTop !== undefined &&
        root.scrollHeight > root.clientHeight
      ) {
        root.scrollTop = root.scrollHeight;
      } else {
        // Otherwise try to find the inner viewport (Radix UI)
        const viewport = root?.querySelector(
          '[data-slot="scroll-area-viewport"]'
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }
  }, [messages, isLoading]); // Scroll when messages change or loading starts/stops

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative overflow-hidden">
      {/* Messages Area */}
      <ScrollArea
        className="flex-1 overflow-y-auto no-scrollbar"
        id="chat-scroll-area"
      >
        <div
          className={`flex flex-col p-4 space-y-6 pb-20 ${
            messages.length > 0
              ? "min-h-full justify-end"
              : "h-full justify-center"
          }`}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 opacity-50 h-screen">
              <Bot className="w-16 h-16" />
              <p className="text-xl font-medium">How can I help you today?</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col max-w-[80%] ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 dark:bg-muted/30 border"
                  }`}
                >
                  {msg.role === "assistant" && index === messages.length - 1 ? (
                    <Typewriter content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  )}
                </div>
                {/* Sources Section */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Sources:</span>{" "}
                    {msg.sources.join(", ")}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-secondary">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl px-4 py-2.5 bg-muted/50 border flex items-center">
                <TypingBubble />
              </div>
            </div>
          )}
          {/* Invisible element to scroll to */}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-10">
        <form
          onSubmit={sendMessage}
          className="relative flex items-center max-w-4xl mx-auto"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="pr-12 py-6 rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-offset-0 focus-visible:ring-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 rounded-full h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
