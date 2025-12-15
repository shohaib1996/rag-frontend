"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      if (!localStorage.getItem("token")) {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not loading and no user, we are redirecting, so show nothing or loader
  if (!user && !localStorage.getItem("token")) {
    return null;
  }

  return (
    <ChatLayout>
      <ChatInterface />
    </ChatLayout>
  );
}
