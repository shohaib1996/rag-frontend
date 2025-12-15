import React from "react";
import { ModeToggle } from "@/components/ModeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background decoration (optional but adds premium feel) */}
      <div className="absolute top-0 right-0 p-4">
        <ModeToggle />
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20" />

      <div className="w-full max-w-md p-6 z-10">{children}</div>
    </div>
  );
}
