"use client";

import React from "react";

export function TypingBubble() {
  return (
    <div className="flex space-x-1 items-center bg-transparent p-2">
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
    </div>
  );
}
