import { useState, useEffect } from "react";
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load conversation on mount or change
  useEffect(() => {
    const handleConversationChange = async () => {
      // Parse URL for conversationId
      const params = new URLSearchParams(window.location.search);
      const id = params.get("conversationId");

      if (id) {
        setConversationId(id);
        setIsLoading(true);
        try {
          const res = await api.get(`/conversations/${id}`);
          setMessages(res.data.messages);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load conversation");
        } finally {
          setIsLoading(false);
        }
      } else {
        setConversationId(null);
        setMessages([]);
      }
    };

    // Listen for custom event
    window.addEventListener("conversationChanged", handleConversationChange);
    // Initial check
    handleConversationChange();

    return () => {
      window.removeEventListener(
        "conversationChanged",
        handleConversationChange
      );
    };
  }, []);

  // Mutation to send message to backend
  const mutation = useMutation({
    mutationFn: async (payload: {
      question: string;
      conversation_id?: string | null;
    }) => {
      // The backend expects snake_case: conversation_id
      const response = await api.post("/ask", payload);
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      // Update Conversation ID if new
      if (data.conversation_id) {
        setConversationId(data.conversation_id);

        // Update URL silently if it was new
        if (!conversationId) {
          const newUrl = `${window.location.pathname}?conversationId=${data.conversation_id}`;
          window.history.pushState({ path: newUrl }, "", newUrl);
          // Dispatch event so sidebar updates?
          // Ideally sidebar should re-fetch listing. We can trigger that too.
          // For now, let's just keep state consistent locally.
        }
      }

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

    mutation.mutate({ question, conversation_id: conversationId });
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  };
}
