"use client";

import { ReactNode } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, Plus, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TrainBotModal } from "@/components/knowledge/TrainBotModal";
import { DocumentsListModal } from "@/components/knowledge/DocumentsListModal";
import { BrainCircuit, Database } from "lucide-react";

export function ChatLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          size="lg"
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
          {/* Placeholder for history */}
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal truncate"
          >
            <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
            Previous conversation...
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal truncate"
          >
            <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
            Project brainstorming
          </Button>
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
