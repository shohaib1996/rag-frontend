import { ReactNode, useState, useEffect } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, Plus, MessageSquare, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TrainBotModal } from "@/components/knowledge/TrainBotModal";
import { DocumentsListModal } from "@/components/knowledge/DocumentsListModal";
import { BrainCircuit, Database } from "lucide-react";
import api from "@/lib/api";

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
};

export function ChatLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/conversations");
      setConversations(res.data);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.delete(`/conversations/${id}`);
      setConversations(conversations.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete conversation", error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          size="lg"
          onClick={() => {
            setSelectedId(null);
            // We need a way to tell children to reset.
            // For now, simpler to just reload or use context/URL.
            // Let's rely on window.location or similar if we can't pass props down easily
            // But actually, we are wrapping children. We should probably cloneElement or use Context.
            window.location.href = "/";
          }}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <div className="flex-1 px-2 py-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          Recent
        </div>
        <div className="space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                selectedId === conv.id
                  ? "bg-accent/50 text-accent-foreground"
                  : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setSelectedId(conv.id);
                // Hacky way to navigate for now if we don't have a router setup for ids
                // Ideally we use Next.js dynamic routes: /chat/[id]
                // But sticking to single page for now:
                window.history.pushState({}, "", `?conversationId=${conv.id}`);
                // Dispatch custom event to notify ChatInterface
                window.dispatchEvent(new Event("conversationChanged"));
              }}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1">{conv.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, conv.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 mt-auto border-t space-y-2">
        <TrainBotModal>
          <Button variant="secondary" className="w-full justify-start gap-2">
            <BrainCircuit className="h-4 w-4" />
            Train Bot
          </Button>
        </TrainBotModal>
        <DocumentsListModal>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Database className="h-4 w-4" />
            Manage Data
          </Button>
        </DocumentsListModal>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium overflow-hidden">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary uppercase shrink-0">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span
              className="leading-none font-semibold truncate"
              title={user?.name}
            >
              {user?.name || "User"}
            </span>
            <span
              className="text-xs text-muted-foreground font-normal leading-none mt-1 truncate max-w-[100px]"
              title={user?.email}
            >
              {user?.email}
            </span>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Log out"
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] border-r bg-muted/10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <div className="md:hidden absolute top-4 left-4 z-50">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="p-0 w-[260px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full h-full">
        {children}
      </main>
    </div>
  );
}
