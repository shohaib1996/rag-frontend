"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
}

export function Typewriter({
  content,
  speed = 10,
  onComplete,
}: TypewriterProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If content changes drastically (e.g. new message content), reset.
    // However, for this simplified version, we assume content is static once passed
    // OR we just want to type it out.
    // If we want to skip animation for already fully loaded content, we need a flag.
    // But per user request: "when response come it should like chat gpt style typing".

    // Safety check: if content was already displayed fully, don't re-animate.
    // This simple comparison works if the parent controls when to mount Typewriter.
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, content, speed, onComplete]);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {displayedContent}
    </p>
  );
}
