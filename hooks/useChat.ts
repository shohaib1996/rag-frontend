import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: any[];
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mutation to send message to backend
  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await api.post("/ask", { question });
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error("Failed to get answer. Please try again.");
      setIsLoading(false);
      // Optional: Remove user message if failed? Or allow retry.
    },
  });

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: input,
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput("");

    mutation.mutate(question);
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  };
}
